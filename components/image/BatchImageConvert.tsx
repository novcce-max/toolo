// 文件路径: /components/image/BatchImageConvert.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { formatBytes } from '@/lib/bytes'

type OutputFormat = 'image/webp' | 'image/jpeg' | 'image/png'
type ItemStatus = 'pending' | 'processing' | 'done' | 'error'

type ConvertItem = {
  id: string
  file: File
  name: string
  type: string
  originalBytes: number

  status: ItemStatus
  outputBytes?: number
  savedPercent?: number
  errorMessage?: string

  outputBlob?: Blob
  outputUrl?: string
  outputFilename?: string
}

type ConvertSettings = {
  outputFormat: OutputFormat
  quality: number // 0-100（仅对 webp/jpeg 生效）
  maxWidth: number // 0 表示不缩放
}

const ACCEPTED_TYPES = new Set<string>(['image/jpeg', 'image/png', 'image/webp'])

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function stripExtension(filename: string): string {
  const idx = filename.lastIndexOf('.')
  if (idx <= 0) return filename
  return filename.slice(0, idx)
}

function extFromMime(mime: OutputFormat): string {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  return 'webp'
}

function fileTypeLabel(mime: string): string {
  if (mime === 'image/jpeg') return 'JPG'
  if (mime === 'image/png') return 'PNG'
  if (mime === 'image/webp') return 'WebP'
  return mime
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms))
}

/**
 * 触发下载（使用 ObjectURL）
 * - 注意：此处只负责“触发”，URL 的创建与回收由外部统一管理
 */
function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/**
 * 将图片绘制到 canvas 并导出为指定格式 Blob
 * - 纯本地：createImageBitmap + canvas.toBlob
 * - JPG：先填充白底，避免透明区域变黑
 * - maxWidth：0 表示不缩放；>0 则按宽等比缩放
 */
async function convertImageToBlob(
  file: File,
  settings: ConvertSettings,
): Promise<{ blob: Blob; width: number; height: number }> {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error('不支持的格式：仅支持 JPG / PNG / WebP')
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('读取图片失败：可能文件损坏或内存不足')
  }

  try {
    const srcW = bitmap.width
    const srcH = bitmap.height

    const mw = Number.isFinite(settings.maxWidth) ? Math.max(0, Math.floor(settings.maxWidth)) : 0
    const targetW = mw > 0 && srcW > mw ? mw : srcW
    const scale = targetW / srcW
    const targetH = Math.max(1, Math.round(srcH * scale))

    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 初始化失败：无法获取 2D 上下文')

    if (settings.outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, targetW, targetH)
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, 0, 0, targetW, targetH)

    const quality01 =
      settings.outputFormat === 'image/png' ? undefined : clamp(settings.quality, 0, 100) / 100

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (!b) {
            reject(new Error('导出失败：toBlob 返回空（浏览器不支持或内存不足）'))
            return
          }
          resolve(b)
        },
        settings.outputFormat,
        quality01,
      )
    })

    return { blob, width: targetW, height: targetH }
  } finally {
    bitmap.close()
  }
}

export default function BatchImageConvert() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [items, setItems] = useState<ConvertItem[]>([])
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const [settings, setSettings] = useState<ConvertSettings>({
    outputFormat: 'image/webp',
    quality: 80,
    maxWidth: 0,
  })

  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const completedCount = useMemo(() => items.filter((i) => i.status === 'done').length, [items])
  const totalCount = items.length

  const itemsRef = useRef<ConvertItem[]>([])
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  /**
   * 统一管理 ObjectURL，避免内存泄漏
   */
  const urlSetRef = useRef<Set<string>>(new Set())

  function rememberUrl(url: string) {
    urlSetRef.current.add(url)
  }

  function forgetUrl(url?: string) {
    if (!url) return
    if (urlSetRef.current.has(url)) urlSetRef.current.delete(url)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    return () => {
      urlSetRef.current.forEach((url) => URL.revokeObjectURL(url))
      urlSetRef.current.clear()
    }
  }, [])

  const canStart = totalCount > 0 && !isRunning
  const showQuality = settings.outputFormat === 'image/webp' || settings.outputFormat === 'image/jpeg'

  function addFiles(fileList: FileList | File[]) {
    const next: ConvertItem[] = []
    const now = Date.now()

    Array.from(fileList).forEach((file, idx) => {
      if (!ACCEPTED_TYPES.has(file.type)) return
      const id = `${now}-${idx}-${Math.random().toString(16).slice(2)}`
      next.push({
        id,
        file,
        name: file.name,
        type: file.type,
        originalBytes: file.size,
        status: 'pending',
      })
    })

    if (next.length === 0) return
    setItems((prev) => [...prev, ...next])
  }

  function onPickClick() {
    if (isRunning) return
    inputRef.current?.click()
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isRunning) {
      e.target.value = ''
      return
    }
    const files = e.target.files
    if (files && files.length > 0) addFiles(files)
    e.target.value = ''
  }

  function clearAll() {
    items.forEach((it) => {
      if (it.outputUrl) forgetUrl(it.outputUrl)
    })
    setItems([])
    setCurrentIndex(0)
  }

  function updateItem(id: string, patch: Partial<ConvertItem>) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it
        return { ...it, ...patch }
      }),
    )
  }

  function resetItemForRetry(id: string) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it
        if (it.outputUrl) forgetUrl(it.outputUrl)
        return {
          ...it,
          status: 'pending',
          outputBytes: undefined,
          savedPercent: undefined,
          errorMessage: undefined,
          outputBlob: undefined,
          outputUrl: undefined,
          outputFilename: undefined,
        }
      }),
    )
  }

  async function processOne(item: ConvertItem) {
    updateItem(item.id, { status: 'processing', errorMessage: undefined })

    try {
      const effective: ConvertSettings = {
        ...settings,
        maxWidth: Math.max(0, Math.floor(settings.maxWidth || 0)),
      }

      const { blob } = await convertImageToBlob(item.file, effective)

      const outBytes = blob.size
      const savedPercent =
        item.originalBytes > 0 ? ((item.originalBytes - outBytes) / item.originalBytes) * 100 : 0

      const url = URL.createObjectURL(blob)
      rememberUrl(url)

      const base = stripExtension(item.name)
      const ext = extFromMime(settings.outputFormat)
      const filename = `${base}.${ext}`

      updateItem(item.id, {
        status: 'done',
        outputBlob: blob,
        outputUrl: url,
        outputBytes: outBytes,
        savedPercent,
        outputFilename: filename,
      })
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : typeof err === 'string' ? err : '未知错误：转换失败'
      updateItem(item.id, { status: 'error', errorMessage: msg })
    }
  }

  async function start() {
    if (!canStart) return
    setIsRunning(true)
    setCurrentIndex(0)

    try {
      // 串行处理：每轮都从 itemsRef 取最新状态，避免闭包读旧数组
      for (let i = 0; i < itemsRef.current.length; i++) {
        const it = itemsRef.current[i]
        setCurrentIndex(i + 1)
        if (!it) continue
        if (it.status === 'done') continue
        await processOne(it)
        await sleep(30)
      }
    } finally {
      setIsRunning(false)
    }
  }

  async function downloadAll() {
    if (isRunning) return
    const doneItems = items.filter((it) => it.status === 'done' && it.outputUrl && it.outputFilename)
    for (let i = 0; i < doneItems.length; i++) {
      const it = doneItems[i]
      triggerDownload(it.outputUrl as string, it.outputFilename as string)
      await sleep(200)
    }
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (isRunning) return
    const dt = e.dataTransfer
    if (dt?.files && dt.files.length > 0) addFiles(dt.files)
  }

  return (
    <div className="space-y-6">
      {/* 上传区 */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          'rounded-3xl border bg-white px-6 py-6',
          isDragging ? 'border-slate-400' : 'border-slate-200',
        ].join(' ')}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-slate-900">选择或拖拽图片</div>
            <div className="text-sm text-slate-600">支持 JPG / PNG / WebP。处理仅在本地进行，不上传。</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onPickClick}
              disabled={isRunning}
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
            >
              选择图片
            </button>

            <button
              type="button"
              onClick={clearAll}
              disabled={items.length === 0 || isRunning}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
            >
              清空
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {/* 参数区 */}
      <details className="rounded-3xl border border-slate-200 bg-white px-6 py-5" open={false}>
        <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">参数设置</summary>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="space-y-1">
              <div className="text-sm font-medium text-slate-900">输出格式</div>
              <select
                value={settings.outputFormat}
                disabled={isRunning}
                onChange={(e) => setSettings((s) => ({ ...s, outputFormat: e.target.value as OutputFormat }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
              >
                <option value="image/webp">WebP</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
              </select>
            </label>

            <label className="space-y-1">
              <div className="text-sm font-medium text-slate-900">最大宽度（px）</div>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={settings.maxWidth}
                disabled={isRunning}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setSettings((s) => ({ ...s, maxWidth: Number.isFinite(v) ? v : 0 }))
                }}
                placeholder="0 表示不缩放"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
              />
              <div className="text-xs text-slate-500">0 表示不缩放；超过该宽度才会等比缩放。</div>
            </label>

            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-900">质量（0-100）{showQuality ? '' : '（PNG 不使用）'}</div>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-700">
                    {settings.outputFormat === 'image/jpeg'
                      ? 'JPG'
                      : settings.outputFormat === 'image/webp'
                        ? 'WebP'
                        : 'PNG'}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{settings.quality}</div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={settings.quality}
                  disabled={!showQuality || isRunning}
                  onChange={(e) => setSettings((s) => ({ ...s, quality: Number(e.target.value) }))}
                  className="w-full disabled:opacity-50"
                />
                <div className="text-xs text-slate-500">JPG/WebP 越低体积越小；PNG 不使用质量参数。</div>
              </div>
            </div>
          </div>
        </div>
      </details>

      {/* 操作与进度 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          {totalCount > 0 ? (
            <>
              已选 <span className="font-semibold text-slate-900">{totalCount}</span> 个文件
              {isRunning ? (
                <>
                  ，处理中 <span className="font-semibold text-slate-900">{currentIndex}</span>/
                  <span className="font-semibold text-slate-900">{totalCount}</span>
                </>
              ) : (
                <>
                  ，已完成 <span className="font-semibold text-slate-900">{completedCount}</span>
                </>
              )}
            </>
          ) : (
            '尚未选择文件'
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={start}
            disabled={!canStart}
            className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
          >
            开始转换
          </button>

          <button
            type="button"
            onClick={downloadAll}
            disabled={completedCount === 0 || isRunning}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
          >
            下载全部（逐个触发）
          </button>
        </div>
      </div>

      {/* 列表 */}
      <div className="rounded-3xl border border-slate-200 bg-white px-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-900">文件列表</div>
          <div className="text-xs text-slate-500 mt-1">串行处理更稳定；输出为 {fileTypeLabel(settings.outputFormat)}。</div>
        </div>

        {items.length === 0 ? (
          <div className="px-6 py-8 text-sm text-slate-600">暂无文件。请先选择或拖拽图片。</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {items.map((it) => {
              const outBytes = it.outputBytes
              const saved = typeof it.savedPercent === 'number' ? it.savedPercent : null
              const savedText =
                saved === null ? '—' : saved >= 0 ? `节省 ${saved.toFixed(1)}%` : `增大 ${Math.abs(saved).toFixed(1)}%`

              return (
                <div key={it.id} className="px-6 py-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="text-sm font-semibold text-slate-900 break-all">{it.name}</div>
                      <div className="text-xs text-slate-500">
                        原始 {formatBytes(it.originalBytes)} · 输出 {outBytes ? formatBytes(outBytes) : '—'} · {savedText}
                      </div>
                      {it.status === 'error' && it.errorMessage ? (
                        <div className="text-xs text-rose-600">{it.errorMessage}</div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={[
                          'inline-flex items-center rounded-full border px-3 py-1 text-xs',
                          it.status === 'pending'
                            ? 'border-slate-200 bg-slate-50 text-slate-700'
                            : it.status === 'processing'
                              ? 'border-slate-200 bg-white text-slate-700'
                              : it.status === 'done'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-rose-200 bg-rose-50 text-rose-700',
                        ].join(' ')}
                      >
                        {it.status === 'pending'
                          ? '待处理'
                          : it.status === 'processing'
                            ? '处理中'
                            : it.status === 'done'
                              ? '完成'
                              : '失败'}
                      </span>

                      {it.status === 'done' && it.outputUrl && it.outputFilename ? (
                        <button
                          type="button"
                          onClick={() => triggerDownload(it.outputUrl as string, it.outputFilename as string)}
                          disabled={isRunning}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
                        >
                          下载
                        </button>
                      ) : null}

                      {it.status === 'error' ? (
                        <button
                          type="button"
                          disabled={isRunning}
                          onClick={() => resetItemForRetry(it.id)}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
                        >
                          重试（加入队列）
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="text-xs text-slate-500 leading-relaxed">
        提示：若一次选择大量大图，浏览器可能出现短暂卡顿。建议分批处理，或设置最大宽度以降低内存压力。
      </div>
    </div>
  )
}