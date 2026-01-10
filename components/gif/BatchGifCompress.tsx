// 文件路径: /components/gif/BatchGifCompress.tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type GifJobStatus = '待处理' | '处理中' | '完成' | '失败'

interface GifJob {
  id: string
  file: File
  name: string
  originalBytes: number
  outputBytes: number | null
  outputUrl: string | null
  status: GifJobStatus
  errorMessage: string | null
}

/**
 * modern-gif 的最小类型声明（避免在 TS 下失去类型提示）
 * - decode: 读取宽高等元信息
 * - decodeFrames: 解码所有帧的 RGBA 数据
 * - encode: 重新编码输出 GIF（二进制 Uint8Array）
 *
 * 参考：modern-gif README（GitHub）中的用法示例
 */
type ModernGifModule = {
  decode: (buffer: ArrayBuffer) => { width: number; height: number }
  decodeFrames: (
    buffer: ArrayBuffer,
    options?: { workerUrl?: string },
  ) => Promise<Array<{ width: number; height: number; delay: number; data: Uint8ClampedArray }>>
  encode: (options: {
    workerUrl?: string
    width: number
    height: number
    frames: Array<{ width: number; height: number; delay: number; data: Uint8ClampedArray }>
    maxColors?: number
  }) => Promise<Uint8Array>
}

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, Math.round(n)))
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '-'
  const units = ['B', 'KB', 'MB', 'GB'] as const
  let v = bytes
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  const digits = i === 0 ? 0 : i === 1 ? 1 : 2
  return `${v.toFixed(digits)} ${units[i]}`
}

function percentSaved(original: number, out: number | null): string {
  if (!out || original <= 0) return '-'
  const saved = 1 - out / original
  const p = Math.round(saved * 1000) / 10
  return `${p}%`
}

function safeBaseName(name: string): string {
  const dot = name.lastIndexOf('.')
  if (dot <= 0) return name
  return name.slice(0, dot)
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function isGifFile(file: File): boolean {
  // 某些浏览器/系统可能 type 为空；兜底用扩展名判断
  if (file.type === 'image/gif') return true
  return /\.gif$/i.test(file.name)
}

function makeId(): string {
  // 简单稳定的 id：不依赖 crypto，避免在某些环境不可用
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

/**
 * 关键修复（TS + DOM 类型稳定）：
 * - 在 TS 5.x 下，TypedArray 的 buffer 可能被推断为 ArrayBufferLike（含 SharedArrayBuffer 分支）
 * - 但 DOM 的 ImageData / BlobPart 类型期望更偏向 ArrayBuffer
 * - 这里用“显式创建 ArrayBuffer + 拷贝”的方式，保证类型与运行时都稳定
 */
function makeArrayBufferFromBytes(byteLength: number): ArrayBuffer {
  return new ArrayBuffer(Math.max(0, Math.floor(byteLength)))
}

function toArrayBufferCopyFromU8Like(src: Uint8Array | Uint8ClampedArray): ArrayBuffer {
  const ab = makeArrayBufferFromBytes(src.byteLength)
  new Uint8Array(ab).set(new Uint8Array(src.buffer, src.byteOffset, src.byteLength))
  return ab
}

export default function BatchGifCompress() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [jobs, setJobs] = useState<GifJob[]>([])
  const [isWorking, setIsWorking] = useState<boolean>(false)

  // 确保 input 元素在组件挂载时正确初始化（解决客户端路由切换后文件上传失效的问题）
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // 参数：maxWidth / keepEvery / maxColors
  const [maxWidth, setMaxWidth] = useState<number>(720)
  const [keepEvery, setKeepEvery] = useState<number>(1)
  const [maxColors, setMaxColors] = useState<number>(128)

  // 进度：当前处理第几个（1-based）/ 总数
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  })

  // 动态 import 的模块缓存：必须在点击“开始压缩”后才加载
  const modernGifRef = useRef<ModernGifModule | null>(null)

  // 用于避免并发：串行处理时记录取消标记
  const cancelRef = useRef<{ cancelled: boolean }>({ cancelled: false })

  // 统一管理所有创建过的 ObjectURL，组件卸载时集中回收
  const objectUrlsRef = useRef<Set<string>>(new Set())

  const hasAnyDone = useMemo(() => jobs.some((j) => j.status === '完成' && !!j.outputUrl), [jobs])
  const hasAnyPending = useMemo(() => jobs.some((j) => j.status === '待处理'), [jobs])
  const hasAnyError = useMemo(() => jobs.some((j) => j.status === '失败'), [jobs])

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files)
    if (list.length === 0) return

    const next: GifJob[] = []
    for (const file of list) {
      if (!isGifFile(file)) {
        // 不把不支持的文件加入队列（避免后续一堆失败项）
        continue
      }
      next.push({
        id: makeId(),
        file,
        name: file.name,
        originalBytes: file.size,
        outputBytes: null,
        outputUrl: null,
        status: '待处理',
        errorMessage: null,
      })
    }

    if (next.length === 0) return

    setJobs((prev) => [...prev, ...next])
  }, [])

  const onPickFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return
      addFiles(files)
      // 允许重复选择同一批文件
      e.target.value = ''
    },
    [addFiles],
  )

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const files = e.dataTransfer.files
      if (!files || files.length === 0) return
      addFiles(files)
    },
    [addFiles],
  )

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const revokeUrl = useCallback((url: string | null) => {
    if (!url) return
    try {
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
    objectUrlsRef.current.delete(url)
  }, [])

  const clearAll = useCallback(() => {
    setJobs((prev) => {
      // 回收所有已生成的 ObjectURL
      for (const j of prev) revokeUrl(j.outputUrl)
      return []
    })
    setProgress({ current: 0, total: 0 })
  }, [revokeUrl])

  // 组件卸载时：回收所有 ObjectURL，避免内存泄漏
  useEffect(() => {
    return () => {
      cancelRef.current.cancelled = true
      for (const url of objectUrlsRef.current) {
        try {
          URL.revokeObjectURL(url)
        } catch {
          // ignore
        }
      }
      objectUrlsRef.current.clear()
    }
  }, [])

  const downloadByUrl = useCallback((url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noreferrer'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [])

  const downloadSingle = useCallback(
    (job: GifJob) => {
      if (!job.outputUrl) return
      const base = safeBaseName(job.name)
      downloadByUrl(job.outputUrl, `${base}.compressed.gif`)
    },
    [downloadByUrl],
  )

  const downloadAll = useCallback(async () => {
    const done = jobs.filter((j) => j.status === '完成' && !!j.outputUrl)
    if (done.length === 0) return

    // 逐个触发下载，并做轻微节流，降低浏览器拦截概率
    for (let i = 0; i < done.length; i++) {
      const j = done[i]
      if (!j.outputUrl) continue
      const base = safeBaseName(j.name)
      downloadByUrl(j.outputUrl, `${base}.compressed.gif`)
      await sleep(200)
    }
  }, [downloadByUrl, jobs])

  const updateJob = useCallback((id: string, patch: Partial<GifJob>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)))
  }, [])

  const scaleFramesIfNeeded = useCallback(
    async (
      frames: Array<{ width: number; height: number; delay: number; data: Uint8ClampedArray }>,
      srcWidth: number,
      srcHeight: number,
      targetMaxWidth: number,
    ): Promise<{
      width: number
      height: number
      frames: Array<{ width: number; height: number; delay: number; data: Uint8ClampedArray }>
    }> => {
      const mw = clampInt(targetMaxWidth, 0, 16384)
      if (mw <= 0 || srcWidth <= mw) {
        return { width: srcWidth, height: srcHeight, frames }
      }

      // 计算等比缩放尺寸
      const scale = mw / srcWidth
      const tw = mw
      const th = Math.max(1, Math.round(srcHeight * scale))

      // 关键性能点：复用 canvas，避免每帧重复创建 DOM 节点
      const srcCanvas = document.createElement('canvas')
      srcCanvas.width = srcWidth
      srcCanvas.height = srcHeight
      const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })
      if (!srcCtx) throw new Error('浏览器不支持 Canvas 2D（无法处理）')

      const dstCanvas = document.createElement('canvas')
      dstCanvas.width = tw
      dstCanvas.height = th
      const dstCtx = dstCanvas.getContext('2d', { willReadFrequently: true })
      if (!dstCtx) throw new Error('浏览器不支持 Canvas 2D（无法处理）')

      dstCtx.imageSmoothingEnabled = true
      dstCtx.imageSmoothingQuality = 'high'

      const outFrames: Array<{ width: number; height: number; delay: number; data: Uint8ClampedArray }> =
        []

      for (let i = 0; i < frames.length; i++) {
        const f = frames[i]

        /**
         * TS 关键修复：
         * - new ImageData(typedArray, w, h) 在 TS 5.x 下可能因 buffer 推断为 ArrayBufferLike 而报错
         * - 这里显式创建 ArrayBuffer 再拷贝，确保类型为 Uint8ClampedArray<ArrayBuffer>
         */
        const ab: ArrayBuffer = toArrayBufferCopyFromU8Like(f.data)
        const rgba: Uint8ClampedArray<ArrayBuffer> = new Uint8ClampedArray(ab)

        const imgData = new ImageData(rgba, f.width, f.height)
        srcCtx.putImageData(imgData, 0, 0)

        // 绘制到目标尺寸
        dstCtx.clearRect(0, 0, tw, th)
        dstCtx.drawImage(srcCanvas, 0, 0, tw, th)

        // 读回缩放后的 RGBA
        const scaled = dstCtx.getImageData(0, 0, tw, th)

        outFrames.push({
          width: tw,
          height: th,
          delay: f.delay,
          data: scaled.data,
        })

        // 让出主线程：避免长 GIF 卡死页面（串行处理更稳）
        if (i % 3 === 0) await sleep(0)
      }

      return { width: tw, height: th, frames: outFrames }
    },
    [],
  )

  const compressOne = useCallback(
    async (job: GifJob, settings: { maxWidth: number; keepEvery: number; maxColors: number }) => {
      if (!isGifFile(job.file)) {
        throw new Error('格式不支持：仅支持 GIF 文件')
      }

      // 读取文件二进制
      let buffer: ArrayBuffer
      try {
        buffer = await job.file.arrayBuffer()
      } catch {
        throw new Error('读取失败：无法读取文件内容')
      }

      // 动态 import 的模块必须在“开始压缩”后才引入，且只引入一次缓存
      if (!modernGifRef.current) {
        const mod = (await import('modern-gif')) as unknown as ModernGifModule
        modernGifRef.current = mod
      }
      const modernGif = modernGifRef.current

      // decode 读取宽高等元信息
      const info = modernGif.decode(buffer)
      const srcW = info.width
      const srcH = info.height

      // decodeFrames 解码出所有帧 RGBA 数据
      const rawFrames = await modernGif.decodeFrames(buffer)

      // keepEvery：抽帧（保留每 N 帧中的 1 帧），并合并 delay 保持整体速度接近
      const ke = clampInt(settings.keepEvery, 1, 60)
      const framesKept: Array<{ width: number; height: number; delay: number; data: Uint8ClampedArray }> =
        []
      for (let i = 0; i < rawFrames.length; i++) {
        if (i % ke !== 0) continue
        const f = rawFrames[i]
        framesKept.push({
          width: f.width,
          height: f.height,
          data: f.data,
          delay: Math.max(10, Math.round(f.delay * ke)), // 合并延时：跳过的帧用更长 delay 近似补偿
        })
      }
      if (framesKept.length === 0) {
        throw new Error('解码失败：未能读取到有效帧')
      }

      // maxWidth：按宽度等比缩放（只在必要时执行）
      const scaled = await scaleFramesIfNeeded(framesKept, srcW, srcH, settings.maxWidth)

      // maxColors：2~255（颜色越少通常体积越小）
      const mc = clampInt(settings.maxColors, 2, 255)

      // encode：重新编码输出二进制
      let output: Uint8Array
      try {
        output = await modernGif.encode({
          width: scaled.width,
          height: scaled.height,
          frames: scaled.frames,
          maxColors: mc,
        })
      } catch {
        throw new Error('编码失败：可能是内存不足或帧数据异常')
      }

      /**
       * TS 关键修复：
       * - BlobPart 在 TS 5.x 下对 ArrayBufferLike 分支更严格
       * - 这里用 ArrayBuffer 作为 BlobPart，保证类型与运行时都稳定
       */
      const outAb: ArrayBuffer = toArrayBufferCopyFromU8Like(output)
      const blob = new Blob([outAb], { type: 'image/gif' })

      const url = URL.createObjectURL(blob)
      objectUrlsRef.current.add(url)

      return { url, bytes: blob.size }
    },
    [scaleFramesIfNeeded],
  )

  const startCompress = useCallback(async () => {
    if (isWorking) return
    const pending = jobs.filter((j) => j.status === '待处理')
    if (pending.length === 0) return

    setIsWorking(true)
    cancelRef.current.cancelled = false
    setProgress({ current: 0, total: pending.length })

    // 固定本次设置快照：避免处理中用户改参数导致结果不一致
    const settings = {
      maxWidth: clampInt(maxWidth, 0, 16384),
      keepEvery: clampInt(keepEvery, 1, 60),
      maxColors: clampInt(maxColors, 2, 255),
    }

    try {
      // 串行处理：一次只处理一个文件，避免浏览器卡死
      for (let i = 0; i < pending.length; i++) {
        if (cancelRef.current.cancelled) break

        const job = pending[i]
        setProgress({ current: i + 1, total: pending.length })
        updateJob(job.id, { status: '处理中', errorMessage: null })

        try {
          // 若该项之前有输出 URL，先回收再生成新的
          if (job.outputUrl) revokeUrl(job.outputUrl)

          const result = await compressOne(job, settings)
          updateJob(job.id, {
            status: '完成',
            outputBytes: result.bytes,
            outputUrl: result.url,
            errorMessage: null,
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : '未知错误'
          updateJob(job.id, { status: '失败', errorMessage: msg, outputBytes: null, outputUrl: null })
        }

        // 让出主线程，降低长任务对 UI 的压迫感
        await sleep(0)
      }
    } finally {
      setIsWorking(false)
      setProgress((p) => ({ ...p, current: 0 }))
    }
  }, [compressOne, isWorking, jobs, keepEvery, maxColors, maxWidth, revokeUrl, updateJob])

  const retryOne = useCallback(
    async (id: string) => {
      if (isWorking) return
      const job = jobs.find((j) => j.id === id)
      if (!job) return

      setIsWorking(true)
      cancelRef.current.cancelled = false
      setProgress({ current: 1, total: 1 })

      const settings = {
        maxWidth: clampInt(maxWidth, 0, 16384),
        keepEvery: clampInt(keepEvery, 1, 60),
        maxColors: clampInt(maxColors, 2, 255),
      }

      try {
        updateJob(id, { status: '处理中', errorMessage: null })

        try {
          if (job.outputUrl) revokeUrl(job.outputUrl)
          const result = await compressOne(job, settings)
          updateJob(id, {
            status: '完成',
            outputBytes: result.bytes,
            outputUrl: result.url,
            errorMessage: null,
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : '未知错误'
          updateJob(id, { status: '失败', errorMessage: msg, outputBytes: null, outputUrl: null })
        }
      } finally {
        setIsWorking(false)
        setProgress({ current: 0, total: 0 })
      }
    },
    [compressOne, isWorking, jobs, keepEvery, maxColors, maxWidth, revokeUrl, updateJob],
  )

  const applyPreset = useCallback((preset: 'balanced' | 'smaller') => {
    // 两个预设按钮：主要用于“一键得到更小体积”
    if (preset === 'balanced') {
      setMaxWidth(720)
      setKeepEvery(1)
      setMaxColors(128)
      return
    }
    // smaller
    setMaxWidth(480)
    setKeepEvery(2)
    setMaxColors(64)
  }, [])

  return (
    <div className="space-y-6">
      {/* 上传区 */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm p-5"
        role="region"
        aria-label="文件上传区域"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-900">选择 GIF 文件（可多选）</div>
            <div className="text-xs text-slate-600">支持拖拽到此处。全部在浏览器本地处理，不上传。</div>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 active:scale-[0.99]">
            选择文件
            <input
              ref={fileInputRef}
              type="file"
              accept=".gif,image/gif"
              multiple
              className="hidden"
              onChange={onPickFiles}
              aria-label="选择 GIF 文件进行压缩"
            />
          </label>
        </div>

        {jobs.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={startCompress}
              disabled={isWorking || !hasAnyPending}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={isWorking ? `正在处理，进度：${progress.current}/${progress.total}` : '开始压缩选中的 GIF 文件'}
            >
              {isWorking ? '处理中…' : '开始压缩'}
            </button>

            <button
              type="button"
              onClick={downloadAll}
              disabled={isWorking || !hasAnyDone}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              下载全部（逐个触发）
            </button>

            <button
              type="button"
              onClick={clearAll}
              disabled={isWorking || jobs.length === 0}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              清空列表
            </button>

            {isWorking && progress.total > 0 && (
              <div className="ml-auto text-xs text-slate-600" role="status" aria-live="polite" aria-atomic="true">
                进度：{progress.current}/{progress.total}（串行处理）
              </div>
            )}
          </div>
        )}
      </div>

      {/* 参数区（默认折叠） */}
      <details className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm p-5">
        <summary className="cursor-pointer select-none text-sm font-medium text-slate-900" role="button" aria-expanded="false">
          压缩参数（可选）
        </summary>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset('balanced')}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
            >
              预设：平衡
            </button>
            <button
              type="button"
              onClick={() => applyPreset('smaller')}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
            >
              预设：更小
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">最大宽度 maxWidth（0=不缩放）</label>
              <input
                type="number"
                min={0}
                max={16384}
                value={maxWidth}
                onChange={(e) => setMaxWidth(clampInt(Number(e.target.value), 0, 16384))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
              />
              <div className="text-xs text-slate-500">缩放通常是最有效的体积优化手段。</div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">抽帧 keepEvery（1=不抽帧）</label>
              <input
                type="number"
                min={1}
                max={60}
                value={keepEvery}
                onChange={(e) => setKeepEvery(clampInt(Number(e.target.value), 1, 60))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
              />
              <div className="text-xs text-slate-500">例如 2 表示每 2 帧保留 1 帧。</div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">最大颜色数 maxColors（2~255）</label>
              <input
                type="number"
                min={2}
                max={255}
                value={maxColors}
                onChange={(e) => setMaxColors(clampInt(Number(e.target.value), 2, 255))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
              />
              <div className="text-xs text-slate-500">颜色越少通常越小，但画质可能下降。</div>
            </div>
          </div>

          <div className="text-xs text-slate-600">
            提示：GIF 编码较耗 CPU。建议先试“预设：平衡”，如仍偏大再逐步降低 maxWidth / maxColors 或增大
            keepEvery。
          </div>
        </div>
      </details>

      {/* 列表区 */}
      {jobs.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm" role="region" aria-label="文件处理列表">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="text-sm font-semibold text-slate-900">文件列表</div>
            <div className="mt-1 text-xs text-slate-600">状态：待处理 / 处理中 / 完成 / 失败（失败可单项重试）</div>
          </div>

          <div className="divide-y divide-slate-200" role="list">
            {jobs.map((j) => (
              <div key={j.id} className="px-5 py-4" role="listitem">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="truncate text-sm font-medium text-slate-900">{j.name}</div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span>原始：{formatBytes(j.originalBytes)}</span>
                      <span>输出：{j.outputBytes ? formatBytes(j.outputBytes) : '-'}</span>
                      <span>节省：{percentSaved(j.originalBytes, j.outputBytes)}</span>
                      <span>
                        状态：
                        <span
                          className={[
                            'ml-1 inline-flex items-center rounded-full px-2 py-0.5',
                            j.status === '完成'
                              ? 'bg-emerald-50 text-emerald-700'
                              : j.status === '失败'
                                ? 'bg-rose-50 text-rose-700'
                                : j.status === '处理中'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-slate-100 text-slate-700',
                          ].join(' ')}
                        >
                          {j.status}
                        </span>
                      </span>
                    </div>

                    {j.status === '失败' && j.errorMessage && (
                      <div className="text-xs text-rose-700">失败原因：{j.errorMessage}</div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadSingle(j)}
                      disabled={isWorking || j.status !== '完成' || !j.outputUrl}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`下载压缩后的文件：${j.name}`}
                    >
                      下载
                    </button>

                    <button
                      type="button"
                      onClick={() => retryOne(j.id)}
                      disabled={isWorking || j.status !== '失败'}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`重试处理文件：${j.name}`}
                    >
                      重试
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(hasAnyError || hasAnyDone) && (
            <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-600">
              隐私提示：所有压缩在本地完成。下载链接使用 ObjectURL，并在需要时自动回收，避免内存泄漏。
            </div>
          )}
        </div>
      )}
    </div>
  )
}