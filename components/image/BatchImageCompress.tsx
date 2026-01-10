// 文件路径: /components/image/BatchImageCompress.tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { formatBytes, formatPercent } from '@/lib/bytes'

type FileStatus = 'pending' | 'processing' | 'done' | 'error'
type OutputFormat = 'image/png' | 'image/webp' | 'image/jpeg'

type CompressSettings = {
  quality: number
  maxWidth: number | null
}

type Row = {
  id: string
  file: File
  name: string
  mime: string
  originalSize: number
  status: FileStatus

  // 输出格式（按需求：png 默认 png；jpg/webp 默认 webp；允许切换）
  format: OutputFormat

  // 输出结果
  outputBlob?: Blob
  outputUrl?: string // 仅用于“下载”按钮；必须在替换/清空/卸载时 revokeObjectURL
  outputSize?: number
  ratio?: number // outputSize / originalSize

  errorMessage?: string
}

const ACCEPT_MIME: readonly string[] = ['image/jpeg', 'image/png', 'image/webp'] as const

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function defaultFormatFor(file: File): OutputFormat {
  // 需求：原图 png -> 默认 png；原图 jpg/webp -> 默认 webp
  if (file.type === 'image/png') return 'image/png'
  return 'image/webp'
}

function allowedFormatsFor(file: File): readonly OutputFormat[] {
  // 需求：png 允许切换为 webp；jpg/webp 允许切换为 jpg
  if (file.type === 'image/png') return ['image/png', 'image/webp'] as const
  return ['image/webp', 'image/jpeg'] as const
}

function extFromMime(mime: OutputFormat): string {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/jpeg') return 'jpg'
  return 'bin'
}

function buildDownloadName(originalName: string, format: OutputFormat): string {
  const base = originalName.replace(/\.[^.]+$/, '')
  return `${base}.toolo.${extFromMime(format)}`
}

function mapErrorMessage(err: unknown): string {
  // 关键：明确失败原因（格式不支持/内存不足/未知错误）
  if (err instanceof DOMException) {
    const msg = (err.message || '').toLowerCase()
    if (msg.includes('memory') || msg.includes('out of memory')) return '内存不足：图片过大或浏览器内存紧张'
    if (err.name === 'NotSupportedError') return '格式不支持：无法解码该图片'
    return `处理失败：${err.name || 'DOMException'}`
  }
  if (err instanceof Error) {
    const msg = (err.message || '').toLowerCase()
    if (msg.includes('memory') || msg.includes('out of memory')) return '内存不足：图片过大或浏览器内存紧张'
    return err.message || '未知错误'
  }
  return '未知错误'
}

async function readBitmap(file: File): Promise<ImageBitmap> {
  // 关键：优先使用 createImageBitmap，失败后降级到 Image + objectURL
  try {
    return await createImageBitmap(file)
  } catch {
    const url = URL.createObjectURL(file)
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image()
        el.onload = () => resolve(el)
        el.onerror = () => reject(new Error('图片解码失败'))
        el.src = url
      })
      return await createImageBitmap(img)
    } finally {
      URL.revokeObjectURL(url)
    }
  }
}

async function compressOne(file: File, format: OutputFormat, settings: CompressSettings): Promise<Blob> {
  const bitmap = await readBitmap(file)
  try {
    const srcW = bitmap.width
    const srcH = bitmap.height

    const maxW = settings.maxWidth
    const targetW = maxW && maxW > 0 ? Math.min(srcW, Math.floor(maxW)) : srcW
    const scale = srcW > 0 ? targetW / srcW : 1
    const targetH = Math.max(1, Math.floor(srcH * scale))

    // 关键：优先 OffscreenCanvas（若可用），否则使用普通 canvas
    const canvas: OffscreenCanvas | HTMLCanvasElement =
      typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(targetW, targetH)
        : Object.assign(document.createElement('canvas'), { width: targetW, height: targetH })

    const ctx = (canvas as any).getContext('2d') as
      | OffscreenCanvasRenderingContext2D
      | CanvasRenderingContext2D
      | null
    if (!ctx) throw new Error('Canvas 初始化失败')

    // 关键：JPEG 不支持透明，需要先铺白底
    if (format === 'image/jpeg') {
      ;(ctx as any).fillStyle = '#ffffff'
      ;(ctx as any).fillRect(0, 0, targetW, targetH)
    } else {
      ;(ctx as any).clearRect(0, 0, targetW, targetH)
    }

    ;(ctx as any).imageSmoothingEnabled = true
    ;(ctx as any).imageSmoothingQuality = 'high'
    ;(ctx as any).drawImage(bitmap as any, 0, 0, targetW, targetH)

    const q = Math.min(0.95, Math.max(0.4, settings.quality))

    // 关键：导出 Blob（PNG 会忽略 quality）
    if ('convertToBlob' in canvas) {
      return await (canvas as OffscreenCanvas).convertToBlob({
        type: format,
        quality: format === 'image/png' ? undefined : q,
      } as any)
    }

    return await new Promise<Blob>((resolve, reject) => {
      ;(canvas as HTMLCanvasElement).toBlob(
        (b) => {
          if (!b) reject(new Error('导出失败：toBlob 返回空'))
          else resolve(b)
        },
        format,
        format === 'image/png' ? undefined : q,
      )
    })
  } finally {
    // 关键：释放 bitmap，降低内存占用
    try {
      bitmap.close()
    } catch {
      // ignore
    }
  }
}

export default function BatchImageCompress() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const cancelRef = useRef<boolean>(false)

  const [quality, setQuality] = useState<number>(0.8)
  const [maxWidthText, setMaxWidthText] = useState<string>('1920')

  // 确保 input 元素在组件挂载时正确初始化（解决客户端路由切换后文件上传失效的问题）
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  const settings: CompressSettings = useMemo(() => {
    const raw = maxWidthText.trim()
    if (!raw) return { quality, maxWidth: null }
    const n = Number(raw)
    if (!Number.isFinite(n) || n <= 0) return { quality, maxWidth: null } // 空/0/非法都视为不限制
    return { quality, maxWidth: Math.floor(n) }
  }, [quality, maxWidthText])

  const [rows, setRows] = useState<Row[]>([])
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [dragOver, setDragOver] = useState<boolean>(false)

  const totals = useMemo(() => {
    const total = rows.length
    const pending = rows.filter((r) => r.status === 'pending').length
    const processing = rows.filter((r) => r.status === 'processing').length
    const done = rows.filter((r) => r.status === 'done').length
    const error = rows.filter((r) => r.status === 'error').length
    return { total, pending, processing, done, error }
  }, [rows])

  const canStart = useMemo(() => rows.some((r) => r.status === 'pending'), [rows])
  const canDownloadAll = useMemo(() => rows.some((r) => r.status === 'done' && r.outputUrl), [rows])

  const revokeUrl = useCallback((url?: string) => {
    if (!url) return
    try {
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }, [])

  // 关键：组件卸载时清理所有输出 URL，避免内存泄漏
  useEffect(() => {
    return () => {
      rows.forEach((r) => revokeUrl(r.outputUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const patchRow = useCallback(
    (id: string, patch: Partial<Row>) => {
      setRows((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r
          // 关键：若替换 outputUrl，先 revoke 旧 URL
          if (patch.outputUrl && patch.outputUrl !== r.outputUrl) {
            revokeUrl(r.outputUrl)
          }
          // 关键：若显式清空 outputUrl，也要 revoke 旧 URL
          if (patch.outputUrl === undefined && 'outputUrl' in patch && r.outputUrl) {
            revokeUrl(r.outputUrl)
          }
          return { ...r, ...patch }
        }),
      )
    },
    [revokeUrl],
  )

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files)
      if (list.length === 0) return

      const next: Row[] = list.map((file) => {
        const ok = ACCEPT_MIME.includes(file.type)
        const base: Row = {
          id: makeId(),
          file,
          name: file.name,
          mime: file.type || 'unknown',
          originalSize: file.size,
          status: ok ? 'pending' : 'error',
          format: defaultFormatFor(file),
          errorMessage: ok ? undefined : '格式不支持：仅支持 JPG / PNG / WebP',
        }
        return base
      })

      setRows((prev) => [...prev, ...next])
    },
    [setRows],
  )

  const onPick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) addFiles(files)
      // 关键：允许重复选择同一批文件
      e.currentTarget.value = ''
    },
    [addFiles],
  )

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
      const files = e.dataTransfer.files
      if (files && files.length > 0) addFiles(files)
    },
    [addFiles],
  )

  const clearAll = useCallback(() => {
    if (isRunning) return
    // 关键：清空前 revoke 所有输出 URL
    setRows((prev) => {
      prev.forEach((r) => revokeUrl(r.outputUrl))
      return []
    })
  }, [isRunning, revokeUrl])

  const downloadRow = useCallback((r: Row) => {
    if (!r.outputUrl) return
    // 关键：下载使用已缓存的 objectURL（由压缩完成时创建），避免每次创建新 URL
    const a = document.createElement('a')
    a.href = r.outputUrl
    a.download = buildDownloadName(r.name, r.format)
    a.click()
  }, [])

  const downloadAll = useCallback(async () => {
    // 需求：不得引入 zip 依赖；采用“逐个触发下载”
    const list = rows.filter((r) => r.status === 'done' && r.outputUrl)
    for (const r of list) {
      downloadRow(r)
      // 关键：拉开间隔，减少浏览器拦截/卡顿概率
      await new Promise((res) => window.setTimeout(res, 250))
    }
  }, [downloadRow, rows])

  const retryOne = useCallback(
    async (id: string) => {
      const target = rows.find((x) => x.id === id)
      if (!target) return

      if (!ACCEPT_MIME.includes(target.file.type)) {
        patchRow(id, { status: 'error', errorMessage: '格式不支持：仅支持 JPG / PNG / WebP' })
        return
      }

      // 关键：重试前清理旧结果
      patchRow(id, {
        status: 'processing',
        errorMessage: undefined,
        outputBlob: undefined,
        outputSize: undefined,
        ratio: undefined,
        outputUrl: undefined,
      })

      try {
        const blob = await compressOne(target.file, target.format, settings)
        const url = URL.createObjectURL(blob)
        const outSize = blob.size
        const ratio = target.originalSize > 0 ? outSize / target.originalSize : 1

        patchRow(id, {
          status: 'done',
          outputBlob: blob,
          outputUrl: url,
          outputSize: outSize,
          ratio,
        })
      } catch (err) {
        patchRow(id, { status: 'error', errorMessage: mapErrorMessage(err) })
      }
    },
    [patchRow, rows, settings],
  )

  const startSerial = useCallback(async () => {
    if (isRunning) return
    cancelRef.current = false
    setIsRunning(true)

    // 关键：对本次任务使用参数快照，避免过程中用户调整导致前后不一致
    const snapshotSettings: CompressSettings = { ...settings }

    try {
      for (const r of rows) {
        if (cancelRef.current) break
        if (r.status !== 'pending') continue

        patchRow(r.id, { status: 'processing', errorMessage: undefined })

        try {
          if (!ACCEPT_MIME.includes(r.file.type)) {
            patchRow(r.id, { status: 'error', errorMessage: '格式不支持：仅支持 JPG / PNG / WebP' })
            continue
          }

          const blob = await compressOne(r.file, r.format, snapshotSettings)
          const url = URL.createObjectURL(blob)
          const outSize = blob.size
          const ratio = r.originalSize > 0 ? outSize / r.originalSize : 1

          patchRow(r.id, {
            status: 'done',
            outputBlob: blob,
            outputUrl: url,
            outputSize: outSize,
            ratio,
          })
        } catch (err) {
          patchRow(r.id, { status: 'error', errorMessage: mapErrorMessage(err) })
        }

        // 关键：让出主线程一点时间，进一步降低 UI 卡顿
        await new Promise((res) => window.setTimeout(res, 10))
      }
    } finally {
      setIsRunning(false)
    }
  }, [isRunning, patchRow, rows, settings])

  const statusBadge = useCallback((status: FileStatus) => {
    if (status === 'pending')
      return { text: '待处理', cls: 'bg-slate-50 text-slate-700 border-slate-200' }
    if (status === 'processing')
      return { text: '处理中', cls: 'bg-amber-50 text-amber-700 border-amber-200' }
    if (status === 'done')
      return { text: '完成', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    return { text: '失败', cls: 'bg-red-50 text-red-700 border-red-200' }
  }, [])

  const onChangeFormat = useCallback(
    (id: string, nextFormat: OutputFormat) => {
      // 关键：切换输出格式后，若已完成/失败/处理中，统一回到待处理并清空旧输出，避免格式与输出不一致
      patchRow(id, {
        format: nextFormat,
        status: 'pending',
        errorMessage: undefined,
        outputBlob: undefined,
        outputSize: undefined,
        ratio: undefined,
        outputUrl: undefined,
      })
    },
    [patchRow],
  )

  return (
    <div className="space-y-4">
      {/* 参数区（可折叠；默认折叠） */}
      <details className="rounded-2xl border border-slate-200 bg-white" open={false}>
        <summary className="cursor-pointer select-none px-5 py-4 text-sm font-semibold text-slate-900">
          压缩参数
          <span className="ml-2 text-xs font-medium text-slate-500">（质量 / 最大宽度）</span>
        </summary>

        <div className="px-5 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-medium text-slate-700">质量</div>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={0.4}
                  max={0.95}
                  step={0.01}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
                <div className="shrink-0 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700">
                  {Math.round(quality * 100)}%
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                建议 0.75~0.85。PNG 输出为 PNG 时会忽略质量；转 WebP/JPG 才会生效。
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-medium text-slate-700">最大宽度</div>
              <div className="mt-2 flex items-center gap-3">
                <input
                  value={maxWidthText}
                  onChange={(e) => setMaxWidthText(e.target.value)}
                  placeholder="1920（留空/0 表示不限制）"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <div className="shrink-0 text-xs text-slate-500">px</div>
              </div>
              <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                默认 1920。留空或 0 表示不限制，保持原始尺寸。
              </div>
            </div>
          </div>
        </div>
      </details>

      {/* 上传区（建议实现拖拽上传） */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={[
          'rounded-3xl border border-slate-200 bg-white px-6 py-6',
          dragOver ? 'ring-2 ring-slate-300 bg-slate-50' : '',
        ].join(' ')}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">批量选择图片</div>
            <div className="mt-1 text-xs text-slate-600">
              支持 JPG / PNG / WebP。可点击选择或拖拽到此区域（本地处理）。
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={onInputChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={onPick}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              选择文件
            </button>

            <button
              type="button"
              onClick={() => void startSerial()}
              disabled={!canStart || isRunning}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900"
            >
              {isRunning ? '处理中...' : '开始压缩'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span>总计：{totals.total}</span>
          <span>待处理：{totals.pending}</span>
          <span>处理中：{totals.processing}</span>
          <span>完成：{totals.done}</span>
          <span>失败：{totals.error}</span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={downloadAll}
            disabled={!canDownloadAll}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-40"
          >
            下载全部（逐个触发）
          </button>

          <button
            type="button"
            onClick={clearAll}
            disabled={isRunning || rows.length === 0}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-40"
          >
            清空列表
          </button>

          {isRunning ? (
            <button
              type="button"
              onClick={() => {
                // 关键：停止只影响后续未处理文件；当前正在处理的文件会完成/失败后再结束
                cancelRef.current = true
              }}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              停止
            </button>
          ) : null}
        </div>
      </div>

      {/* 列表区 */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="text-sm font-semibold text-slate-900">处理列表</div>
          <div className="mt-1 text-xs text-slate-600">
            串行逐个压缩（一次只处理一个）。支持选择输出格式；失败可重试单个文件。
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="px-6 py-10 text-sm text-slate-600">暂无文件。请先选择或拖拽图片。</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {rows.map((r) => {
              const badge = statusBadge(r.status)
              const outSizeText = r.outputSize != null ? formatBytes(r.outputSize) : '-'
              const ratioText = r.ratio != null ? formatPercent(r.ratio) : '-'
              const savedText =
                r.outputSize != null && r.originalSize > 0
                  ? formatPercent(1 - r.outputSize / r.originalSize)
                  : '-'

              const formats = allowedFormatsFor(r.file)

              return (
                <div key={r.id} className="px-6 py-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-slate-900 truncate max-w-[560px]">
                          {r.name}
                        </div>
                        <div className={`rounded-xl border px-2.5 py-1 text-xs font-medium ${badge.cls}`}>
                          {badge.text}
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                          {r.mime || 'unknown'}
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                        <div>
                          <div className="text-slate-500">原始大小</div>
                          <div className="text-slate-900">{formatBytes(r.originalSize)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">压缩后大小</div>
                          <div className="text-slate-900">{outSizeText}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">压缩后比例</div>
                          <div className="text-slate-900">{ratioText}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">节省</div>
                          <div className="text-slate-900">{savedText}</div>
                        </div>
                      </div>

                      {r.status === 'error' && r.errorMessage ? (
                        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                          {r.errorMessage}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                      {/* 输出格式选择：按原图类型提供可选项 */}
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <span className="text-xs font-medium text-slate-700">输出</span>
                        <select
                          value={r.format}
                          onChange={(e) => onChangeFormat(r.id, e.target.value as OutputFormat)}
                          className="text-sm bg-transparent text-slate-900 focus:outline-none"
                          disabled={r.status === 'processing'}
                        >
                          {formats.map((f) => (
                            <option key={f} value={f}>
                              {f === 'image/png' ? 'PNG' : f === 'image/webp' ? 'WebP' : 'JPG'}
                            </option>
                          ))}
                        </select>
                      </div>

                      {r.status === 'done' ? (
                        <button
                          type="button"
                          onClick={() => downloadRow(r)}
                          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                        >
                          下载
                        </button>
                      ) : null}

                      {r.status === 'error' ? (
                        <button
                          type="button"
                          onClick={() => void retryOne(r.id)}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
                        >
                          重试
                        </button>
                      ) : null}

                      {r.status === 'pending' ? (
                        <div className="text-xs text-slate-500 px-2 py-1">等待开始</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="text-xs text-slate-600 leading-relaxed">
        说明：一期不引入 ZIP 相关依赖，“下载全部”采用逐个触发下载方式。所有压缩过程在本地浏览器内完成。
      </div>
    </div>
  )
}