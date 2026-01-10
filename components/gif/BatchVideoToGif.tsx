// 文件路径: /components/gif/BatchVideoToGif.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { u8ToArrayBuffer } from '@/lib/bytes'

type ToolStatus = '待处理' | '处理中' | '完成' | '失败' | '已取消'

/**
 * modern-gif 最小类型声明（只声明本组件用到的部分）
 * - README：encode 的 frames 支持 { data, delay }，decodeFrames 返回的 frames 含 { width,height,delay,data }
 * - 我们这里直接构造 decodeFrames 同结构的帧对象传入 encode
 */
type ModernGifModule = {
  encode: (options: {
    workerUrl?: string
    width: number
    height: number
    frames: Array<{ width: number; height: number; delay: number; data: Uint8ClampedArray }>
    maxColors?: number
  }) => Promise<Uint8Array>
}

function getUAFlags() {
  if (typeof navigator === 'undefined') {
    return { isIOS: false, isWeChat: false }
  }
  const ua = navigator.userAgent || ''
  const isIOS = /iP(hone|ad|od)/u.test(ua)
  const isWeChat = /MicroMessenger/u.test(ua)
  return { isIOS, isWeChat }
}

interface ValidationResult {
  ok: boolean
  message?: string
}

interface RenderPlan {
  outputWidth: number
  outputHeight: number
  totalFrames: number
  delayMs: number
  startSec: number
  durationSec: number
  fps: number
  maxColors: number
}

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, Math.round(n)))
}

function clampNumber(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB'] as const
  let v = bytes
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  const fixed = i === 0 ? 0 : i === 1 ? 1 : 2
  return `${v.toFixed(fixed)} ${units[i]}`
}

function safeRevokeObjectURL(url: string | null) {
  if (!url) return
  try {
    URL.revokeObjectURL(url)
  } catch {
    // ignore
  }
}

async function waitMediaEvent<K extends keyof HTMLMediaElementEventMap>(
  el: HTMLMediaElement,
  type: K,
  timeoutMs: number,
): Promise<HTMLMediaElementEventMap[K]> {
  return new Promise((resolve, reject) => {
    let done = false

    const timer = window.setTimeout(() => {
      if (done) return
      done = true
      cleanup()
      reject(new Error(`等待事件超时：${String(type)}`))
    }, timeoutMs)

    const onEvent = (ev: Event) => {
      if (done) return
      done = true
      cleanup()
      resolve(ev as HTMLMediaElementEventMap[K])
    }

    const onError = () => {
      if (done) return
      done = true
      cleanup()
      reject(new Error('视频读取失败或格式不受支持'))
    }

    const cleanup = () => {
      window.clearTimeout(timer)
      el.removeEventListener(type, onEvent as EventListener)
      el.removeEventListener('error', onError as EventListener)
    }

    el.addEventListener(type, onEvent as EventListener, { once: true })
    el.addEventListener('error', onError as EventListener, { once: true })
  })
}

/**
 * 逐帧 seek 的等待：
 * - 优先用 requestVideoFrameCallback 确保帧已渲染
 * - 不支持则降级：等待 readyState 足够 + setTimeout(0) 让浏览器刷新
 */
async function seekAndWaitFrame(video: HTMLVideoElement, targetTime: number, cancelRef: React.MutableRefObject<boolean>) {
  if (cancelRef.current) throw new Error('已取消')

  let lastError: unknown = null

  // iOS / 微信 上某些视频 seek 容易超时，这里做有限次重试
  for (let attempt = 0; attempt < 3; attempt++) {
    if (cancelRef.current) throw new Error('已取消')

    try {
      // 触发 seek（视频暂停状态也可 seek），每次尝试稍微偏移一点时间点，避免卡在同一关键帧
      try {
        const jitter = attempt * 0.0005
        video.currentTime = targetTime + jitter
      } catch {
        throw new Error('无法定位到指定时间点（视频未就绪或不支持跳转）')
      }

      await waitMediaEvent(video, 'seeked', 8000)
      if (cancelRef.current) throw new Error('已取消')

      // 某些浏览器 seeked 后仍未到 HAVE_CURRENT_DATA，需要额外等待
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        await waitMediaEvent(video, 'loadeddata', 8000)
      }

      if (cancelRef.current) throw new Error('已取消')

      const rvfc = (video as unknown as { requestVideoFrameCallback?: (cb: (now: number, metadata: unknown) => void) => number })
        .requestVideoFrameCallback

      if (typeof rvfc === 'function') {
        await new Promise<void>((resolve) => {
          let done = false
          const timer = window.setTimeout(() => {
            if (done) return
            done = true
            resolve()
          }, 2000)

          try {
            rvfc(() => {
              if (done) return
              done = true
              window.clearTimeout(timer)
              resolve()
            })
          } catch {
            window.clearTimeout(timer)
            resolve()
          }
        })
        return
      }

      // 兜底：给一次事件循环时间
      await new Promise<void>((resolve) => window.setTimeout(resolve, 0))
      return
    } catch (err) {
      lastError = err
      const msg = err instanceof Error ? err.message : String(err)
      const isTimeout = msg.includes('等待事件超时')

      // 非超时错误或已达到最大重试次数，直接抛出
      if (!isTimeout || attempt === 2) {
        throw err
      }

      // 简单退避一小段时间后再试，给浏览器一点缓冲时间
      await new Promise<void>((resolve) => window.setTimeout(resolve, 200))
    }
  }

  throw (lastError instanceof Error ? lastError : new Error('无法定位到指定时间点'))
}

function buildValidation(args: {
  file: File | null
  maxWidth: number
  fps: number
  startSec: number
  durationSec: number
  maxColors: number
  naturalWidth: number
  naturalHeight: number
  videoDuration: number
}): ValidationResult {
  const { file, maxWidth, fps, startSec, durationSec, maxColors, naturalWidth, naturalHeight, videoDuration } = args

  if (!file) return { ok: false, message: '请先选择一个视频文件' }
  if (!Number.isFinite(videoDuration) || videoDuration <= 0) return { ok: false, message: '视频时长读取失败，请更换文件重试' }

  // 稳定优先：时长上限
  if (durationSec > 10) return { ok: false, message: '为保证稳定，一次截取时长上限为 10 秒，请降低 durationSec' }
  if (durationSec <= 0) return { ok: false, message: '截取时长必须大于 0 秒' }

  // 稳定优先：帧数上限
  const totalFrames = Math.ceil(fps * durationSec)
  if (totalFrames > 200) {
    return { ok: false, message: `为保证稳定，总帧数上限为 200（当前约 ${totalFrames} 帧）。请降低 FPS 或缩短时长。` }
  }

  if (fps < 1 || fps > 24) return { ok: false, message: 'FPS 必须在 1~24 之间' }
  if (startSec < 0) return { ok: false, message: '起始时间不能为负数' }
  if (startSec >= videoDuration) return { ok: false, message: '起始时间超过视频时长' }
  if (startSec + durationSec > videoDuration + 0.001) return { ok: false, message: '起始时间 + 截取时长 超出视频范围，请调整参数' }

  // 像素上限保护（稳定优先）
  const outW = maxWidth > 0 ? Math.min(maxWidth, naturalWidth) : naturalWidth
  const outH = Math.max(1, Math.round((naturalHeight * outW) / Math.max(1, naturalWidth)))
  const pixels = outW * outH
  // 针对现在主流设备（高分辨率视频）适当放宽像素上限
  const PIXEL_LIMIT = 2_000_000
  if (pixels > PIXEL_LIMIT) {
    return {
      ok: false,
      message: `为保证稳定，输出像素上限约为 ${PIXEL_LIMIT.toLocaleString()}（当前约 ${pixels.toLocaleString()}）。请降低 maxWidth 或选择分辨率更小的视频。`,
    }
  }

  // modern-gif：2~255
  if (maxColors < 2 || maxColors > 255) return { ok: false, message: 'maxColors 必须在 2~255 之间' }

  return { ok: true }
}

export default function BatchVideoToGif() {
  const [file, setFile] = useState<File | null>(null)
  const [inputUrl, setInputUrl] = useState<string | null>(null)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)

  const [status, setStatus] = useState<ToolStatus>('待处理')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [progressText, setProgressText] = useState<string>('')

  const [maxWidth, setMaxWidth] = useState<number>(() => {
    const { isIOS, isWeChat } = getUAFlags()
    // 移动端 / 微信 上默认参数更保守一些
    if (isIOS || isWeChat) return 360
    return 480
  })
  const [fps, setFps] = useState<number>(() => {
    const { isIOS, isWeChat } = getUAFlags()
    if (isIOS || isWeChat) return 8
    return 10
  })
  const [startSec, setStartSec] = useState<number>(0)
  const [durationSec, setDurationSec] = useState<number>(() => {
    const { isIOS, isWeChat } = getUAFlags()
    // iOS / 微信 上更多是短片段场景，默认 2.5s
    if (isIOS || isWeChat) return 2.5
    return 3
  })
  const [maxColors, setMaxColors] = useState<number>(128)

  const [naturalWidth, setNaturalWidth] = useState<number>(0)
  const [naturalHeight, setNaturalHeight] = useState<number>(0)
  const [videoDuration, setVideoDuration] = useState<number>(0)

  const [origBytes, setOrigBytes] = useState<number>(0)
  const [outBytes, setOutBytes] = useState<number>(0)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 取消/中断控制
  const cancelRef = useRef<boolean>(false)

  // 确保 input 元素在组件挂载时正确初始化（解决客户端路由切换后文件上传失效的问题）
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // 避免重复点击开始
  const runningRef = useRef<boolean>(false)

  // 动态 import 缓存：只在点击“开始生成”后加载
  const modernGifRef = useRef<ModernGifModule | null>(null)

  // 卸载时回收 ObjectURL
  useEffect(() => {
    return () => {
      safeRevokeObjectURL(inputUrl)
      safeRevokeObjectURL(outputUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const computedPlan: RenderPlan | null = useMemo(() => {
    if (!file || naturalWidth <= 0 || naturalHeight <= 0) return null

    const mw = clampInt(maxWidth, 0, 16384)
    const outW = mw > 0 ? Math.min(mw, naturalWidth) : naturalWidth
    const outH = Math.max(1, Math.round((naturalHeight * outW) / Math.max(1, naturalWidth)))
    const f = clampNumber(fps, 1, 24)
    const d = clampNumber(durationSec, 0.01, 10)
    const totalFrames = Math.ceil(f * d)

    // delay（ms）：现代库示例用 100ms；这里按 FPS 计算，且设置下限避免过小
    const delayMs = Math.max(20, Math.round(1000 / f))
    const mc = clampInt(maxColors, 2, 255)

    return {
      outputWidth: outW,
      outputHeight: outH,
      totalFrames,
      delayMs,
      startSec: Math.max(0, startSec),
      durationSec: d,
      fps: f,
      maxColors: mc,
    }
  }, [file, naturalWidth, naturalHeight, maxWidth, fps, startSec, durationSec, maxColors])

  function resetAll(keepFile: boolean) {
    setErrorMsg('')
    setProgressText('')
    setStatus('待处理')
    setOutBytes(0)

    cancelRef.current = false
    runningRef.current = false

    safeRevokeObjectURL(outputUrl)
    setOutputUrl(null)

    if (!keepFile) {
      safeRevokeObjectURL(inputUrl)
      setInputUrl(null)
      setFile(null)
      setNaturalWidth(0)
      setNaturalHeight(0)
      setVideoDuration(0)
      setOrigBytes(0)
    }
  }

  function onPickFile(f: File | null) {
    resetAll(false)
    if (!f) return

    if (!f.type.startsWith('video/')) {
      setStatus('失败')
      setErrorMsg('不支持的文件类型：请选择视频文件（如 mp4/webm/mov 等）')
      return
    }

    setFile(f)
    setOrigBytes(f.size)

    const url = URL.createObjectURL(f)
    setInputUrl(url)
  }

  async function loadVideoMeta(url: string) {
    const video = videoRef.current
    if (!video) throw new Error('视频组件未就绪')

    // 绑定 src 并加载 metadata
    video.src = url
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'
    video.pause()

    await waitMediaEvent(video, 'loadedmetadata', 10000)

    if (!Number.isFinite(video.videoWidth) || video.videoWidth <= 0) {
      throw new Error('读取视频分辨率失败（可能是格式不受支持）')
    }

    setNaturalWidth(video.videoWidth)
    setNaturalHeight(video.videoHeight)
    setVideoDuration(Number.isFinite(video.duration) ? video.duration : 0)
  }

  async function ensureModernGif() {
    if (modernGifRef.current) return modernGifRef.current
    const mod = (await import('modern-gif')) as unknown as ModernGifModule
    modernGifRef.current = mod
    return mod
  }

  async function start() {
    if (runningRef.current) return
    if (!file || !inputUrl) {
      setStatus('失败')
      setErrorMsg('请先选择视频文件')
      return
    }

    setErrorMsg('')
    setProgressText('')
    setOutBytes(0)
    setStatus('处理中')
    cancelRef.current = false
    runningRef.current = true

    try {
      await loadVideoMeta(inputUrl)

      const nw = videoRef.current?.videoWidth ?? 0
      const nh = videoRef.current?.videoHeight ?? 0
      const vd = videoRef.current?.duration ?? 0

      const validation = buildValidation({
        file,
        maxWidth: clampInt(maxWidth, 0, 16384),
        fps: clampNumber(fps, 1, 24),
        startSec: clampNumber(startSec, 0, 1e9),
        durationSec: clampNumber(durationSec, 0.01, 10),
        maxColors: clampInt(maxColors, 2, 255),
        naturalWidth: nw,
        naturalHeight: nh,
        videoDuration: vd,
      })

      if (!validation.ok) {
        setStatus('失败')
        setErrorMsg(validation.message || '参数校验失败')
        return
      }

      if (!computedPlan) {
        setStatus('失败')
        setErrorMsg('处理计划生成失败，请刷新页面重试')
        return
      }

      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) throw new Error('渲染组件未就绪')

      // 初始化 canvas
      canvas.width = computedPlan.outputWidth
      canvas.height = computedPlan.outputHeight
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) throw new Error('Canvas 初始化失败')

      // 动态加载 modern-gif（避免首屏包体积）
      const modernGif = await ensureModernGif()

      // 关键：逐帧抽取 RGBA（稳定优先：串行 + 让步 UI）
      const frames: Array<{ width: number; height: number; delay: number; data: Uint8ClampedArray }> = []
      const totalFrames = computedPlan.totalFrames

      const { isIOS, isWeChat } = getUAFlags()
      const highPixel = computedPlan.outputWidth * computedPlan.outputHeight > 1_000_000

      // 防止越界：最后一帧时间点可能略超出 duration，做轻微 clamp
      const endSec = Math.min(computedPlan.startSec + computedPlan.durationSec, Math.max(0, video.duration - 0.0001))

      for (let i = 0; i < totalFrames; i++) {
        if (cancelRef.current) throw new Error('已取消')

        const tRaw = computedPlan.startSec + i * (1 / computedPlan.fps)
        const t = Math.min(tRaw, endSec)

        setProgressText(`进度：${i + 1} / ${totalFrames} 帧（抽帧中…）`)

        // 等待定位到目标帧
        await seekAndWaitFrame(video, t, cancelRef)

        // 绘制到 canvas（等比缩放由 canvas 尺寸控制）
        ctx.clearRect(0, 0, computedPlan.outputWidth, computedPlan.outputHeight)
        ctx.drawImage(video, 0, 0, computedPlan.outputWidth, computedPlan.outputHeight)

        // 读取 RGBA
        const imageData = ctx.getImageData(0, 0, computedPlan.outputWidth, computedPlan.outputHeight)

        frames.push({
          width: computedPlan.outputWidth,
          height: computedPlan.outputHeight,
          delay: computedPlan.delayMs,
          data: imageData.data,
        })

        // 让出主线程（防卡死）
        // - iOS / 微信 或 高像素 GIF：更激进地让步，降低一次性内存/CPU 峰值
        // - 其他环境：维持较轻的让步频率
        if (isIOS || isWeChat || highPixel) {
          const delay = i % 2 === 0 ? 30 : 10
          await new Promise<void>((r) => window.setTimeout(r, delay))
        } else if (i % 2 === 0) {
          await new Promise<void>((r) => window.setTimeout(r, 0))
        }
      }

      if (frames.length === 0) throw new Error('未能抽取到有效帧')

      setProgressText(`进度：${totalFrames} / ${totalFrames} 帧（编码中…）`)

      // 编码输出 GIF（maxColors 越低通常体积越小）
      const outputU8 = await modernGif.encode({
        width: computedPlan.outputWidth,
        height: computedPlan.outputHeight,
        frames,
        maxColors: computedPlan.maxColors,
      })

      // TS 兼容：使用统一的 u8ToArrayBuffer 函数（处理 byteOffset 和 byteLength）
      const blob = new Blob([u8ToArrayBuffer(outputU8)], { type: 'image/gif' })

      safeRevokeObjectURL(outputUrl)
      const outUrl = URL.createObjectURL(blob)
      setOutputUrl(outUrl)
      setOutBytes(blob.size)

      setStatus('完成')
      setProgressText(`完成：${totalFrames} / ${totalFrames} 帧`)
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : '未知错误'
      const { isIOS, isWeChat } = getUAFlags()
      let friendlyMsg = msg === '已取消' ? '已取消' : msg

      // iOS / 微信 上常见的超时 / seek 失败，给出额外说明，方便用户理解和调整
      if (
        (msg.includes('等待事件超时') ||
          msg.includes('无法定位到指定时间点') ||
          msg.includes('读取视频分辨率失败') ||
          msg.includes('视频读取失败')) &&
        (isIOS || isWeChat)
      ) {
        friendlyMsg +=
          '。检测到当前为 iOS/微信 浏览环境，部分设备/编码格式对逐帧读取和时间跳转支持较弱，可能导致抽帧失败。' +
          '建议尝试：1）截取更短片段；2）降低 maxWidth/FPS；3）在系统相册中导出为标准 MP4 再上传。'
      }

      setStatus(cancelRef.current ? '已取消' : '失败')
      setErrorMsg(friendlyMsg)
      setProgressText('')
    } finally {
      runningRef.current = false
    }
  }

  function cancel() {
    if (status !== '处理中') return
    cancelRef.current = true
  }

  function downloadSingle() {
    if (!outputUrl) return
    const a = document.createElement('a')
    a.href = outputUrl
    a.download = 'output.gif'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const savingsText = useMemo(() => {
    if (origBytes <= 0 || outBytes <= 0) return ''
    const diff = origBytes - outBytes
    const ratio = (diff / origBytes) * 100
    const sign = diff >= 0 ? '-' : '+'
    return `体积变化：${sign}${Math.abs(ratio).toFixed(1)}%（${formatBytes(origBytes)} → ${formatBytes(outBytes)}）`
  }, [origBytes, outBytes])

  return (
    <div className="space-y-6">
      {/* 输入区 */}
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-8 py-6">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">选择视频文件</div>
            <div className="mt-2 text-sm text-slate-600 leading-relaxed">
              本工具默认纯浏览器本地处理，不上传。稳定优先限制：截取 ≤ 10 秒、总帧数 ≤ 200、输出像素上限、编码颜色数可控。
            </div>
          </div>

          <div
            className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4"
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const f = e.dataTransfer.files?.[0] ?? null
              onPickFile(f)
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-full file:border file:border-slate-200 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-100/70 focus:outline-none"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null
                  onPickFile(f)
                  // 允许重复选择同一文件
                  e.target.value = ''
                }}
                disabled={status === '处理中'}
              />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-60"
                onClick={() => resetAll(false)}
                disabled={status === '处理中'}
              >
                清空
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500">支持拖拽文件到此处。建议短视频/小分辨率优先。</div>
          </div>

          {file ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-sm text-slate-900 font-medium break-all">{file.name}</div>
              <div className="mt-1 text-xs text-slate-600">
                原始大小：{formatBytes(file.size)}
                {videoDuration > 0 ? ` · 时长：${videoDuration.toFixed(2)}s` : ''}
                {naturalWidth > 0 && naturalHeight > 0 ? ` · 分辨率：${naturalWidth}×${naturalHeight}` : ''}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* 参数区 */}
      <details className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-8 py-6">
        <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">参数设置（稳定预设可直接用）</summary>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <label className="block">
            <div className="text-xs font-medium text-slate-700">最大宽度 maxWidth（0=不缩放）</div>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={maxWidth}
              onChange={(e) => setMaxWidth(clampInt(Number(e.target.value || 0), 0, 16384))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              disabled={status === '处理中'}
            />
          </label>

          <label className="block">
            <div className="text-xs font-medium text-slate-700">FPS（1-24）</div>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={24}
              step={1}
              value={fps}
              onChange={(e) => setFps(clampInt(Number(e.target.value || 10), 1, 24))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              disabled={status === '处理中'}
            />
          </label>

          <label className="block">
            <div className="text-xs font-medium text-slate-700">起始时间 startSec</div>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step={0.1}
              value={startSec}
              onChange={(e) => setStartSec(Math.max(0, Number(e.target.value || 0)))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              disabled={status === '处理中'}
            />
          </label>

          <label className="block">
            <div className="text-xs font-medium text-slate-700">截取时长 durationSec（≤10）</div>
            <input
              type="number"
              inputMode="decimal"
              min={0.1}
              max={10}
              step={0.1}
              value={durationSec}
              onChange={(e) => setDurationSec(clampNumber(Number(e.target.value || 3), 0.1, 10))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              disabled={status === '处理中'}
            />
          </label>

          <label className="block">
            <div className="text-xs font-medium text-slate-700">最大颜色数 maxColors（2-255）</div>
            <input
              type="number"
              inputMode="numeric"
              min={2}
              max={255}
              step={1}
              value={maxColors}
              onChange={(e) => setMaxColors(clampInt(Number(e.target.value || 128), 2, 255))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              disabled={status === '处理中'}
            />
          </label>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 leading-relaxed">
          <div className="font-medium text-slate-900">稳定性保护说明</div>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>截取时长上限：10 秒。</li>
            <li>总帧数上限：200（总帧数 = FPS × 时长）。</li>
            <li>输出像素上限：约 1.2M 像素（过大分辨率会显著增加内存与耗时）。</li>
            <li>maxColors 越低通常越省体积，但画质可能下降（建议 128 起步）。</li>
          </ul>
        </div>
      </details>

      {/* 操作区 */}
      <section className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-8 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={start}
              disabled={!file || status === '处理中'}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-60"
            >
              开始生成 GIF
            </button>

            <button
              type="button"
              onClick={cancel}
              disabled={status !== '处理中'}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-60"
            >
              取消
            </button>

            <button
              type="button"
              onClick={() => resetAll(true)}
              disabled={status === '处理中'}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-60"
            >
              重置输出
            </button>

            <div className="ml-auto text-sm text-slate-600">
              状态： <span className="font-medium text-slate-900">{status}</span>
            </div>
          </div>

          {progressText ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{progressText}</div>
          ) : null}

          {errorMsg ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 leading-relaxed">{errorMsg}</div>
          ) : null}

          {outputUrl ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <div className="text-sm font-semibold text-slate-900">预览</div>
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={outputUrl} alt="GIF 预览" className="block h-auto w-full" />
                </div>
                {savingsText ? <div className="mt-3 text-xs text-slate-600">{savingsText}</div> : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <div className="text-sm font-semibold text-slate-900">下载</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={downloadSingle}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    下载 GIF
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!outputUrl) return
                      const a = document.createElement('a')
                      a.href = outputUrl
                      const base = file?.name?.replace(/\.[^.]+$/u, '') || 'output'
                      a.download = `${base}.gif`
                      a.rel = 'noopener'
                      document.body.appendChild(a)
                      a.click()
                      a.remove()
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    使用原文件名下载
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 leading-relaxed">
                  <div className="font-medium text-slate-900">提示</div>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>生成过慢：降低 FPS 或缩短截取时长。</li>
                    <li>体积过大：优先降低 maxWidth，其次降低 maxColors 或 FPS。</li>
                    <li>若平台支持，MP4/WebM 通常更省体积；GIF 适合循环/自动播放兼容场景。</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* 隐藏媒体元素（用于抽帧） */}
      <div className="sr-only" aria-hidden="true">
        <video ref={videoRef} />
        <canvas ref={canvasRef} />
      </div>

      {/* 说明区 */}
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-8 py-6">
        <h3 className="text-sm font-semibold text-slate-900">工作方式（本地处理）</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          该工具会在浏览器中逐帧定位视频时间点，将画面绘制到 Canvas，并用 modern-gif 在本地编码为 GIF（支持 maxColors 降色）。
          文件不会上传；下载链接通过 ObjectURL 创建，并在组件卸载时回收。
        </p>
      </section>
    </div>
  )
}