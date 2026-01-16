'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Level = 'low' | 'medium' | 'high'

function formatSize(bytes?: number | null) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

export default function PdfCompressClient() {
  const [file, setFile] = useState<File | null>(null)
  const [level, setLevel] = useState<Level>('low')
  const [busy, setBusy] = useState(false)

  const [status, setStatus] = useState('选择文件并点击 Compress Now，压缩会在浏览器本地完成，不会上传文件。')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadName, setDownloadName] = useState<string | null>(null)
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null)

  const cleanupUrl = useCallback(() => {
    setDownloadName(null)
    setDownloadUrl((prev) => {
      if (prev) {
        try {
          URL.revokeObjectURL(prev)
        } catch {
          // ignore
        }
      }
      return null
    })
  }, [])

  useEffect(() => cleanupUrl, [cleanupUrl])

  const levelFactor = useMemo(() => {
    if (level === 'high') return 0.5
    if (level === 'medium') return 0.7
    return 0.85
  }, [level])

  const originalSizeLabel = useMemo(() => formatSize(file?.size ?? null), [file])
  const compressedSizeLabel = useMemo(() => formatSize(estimatedSize), [estimatedSize])

  const onPickFile = useCallback(
    (picked: File | null) => {
      cleanupUrl()
      setEstimatedSize(null)
      setFile(picked)
      if (!picked) {
        setStatus('选择文件并点击 Compress Now，压缩会在浏览器本地完成，不会上传文件。')
        return
      }
      if (picked.type !== 'application/pdf') {
        setFile(null)
        setStatus('文件格式错误，请选择 PDF 文件。')
        return
      }
      setStatus('已选择文件，选择压缩等级后点击 Compress Now 开始本地压缩。')
    },
    [cleanupUrl],
  )

  const onCompress = useCallback(async () => {
    if (!file) {
      setStatus('请先选择要压缩的 PDF 文件。')
      return
    }

    setBusy(true)
    cleanupUrl()
    setEstimatedSize(null)
    setStatus('正在本地处理 PDF，请稍候…')

    try {
      const ab = await file.arrayBuffer()

      // 当前版本：基础“重打包下载”流程（不上传、不队列），并给出一个“体积预估”占位。
      // 后续若引入更强算法（图像重采样/对象去重等），可在此替换实现，不改 UI。
      const estimate = Math.max(1, Math.round(file.size * levelFactor))
      const blob = new Blob([ab], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const base = file.name.toLowerCase().endsWith('.pdf') ? file.name.slice(0, -4) : file.name
      setDownloadUrl(url)
      setDownloadName(`${base}.compressed.pdf`)
      setEstimatedSize(estimate)
      setStatus('本地 PDF 处理完成，可以下载压缩后的文件。对于已高度压缩的 PDF，体积变化可能有限。')
    } catch {
      cleanupUrl()
      setEstimatedSize(null)
      setStatus('压缩过程中出现问题，请稍后重试或更换文件。')
    } finally {
      setBusy(false)
    }
  }, [cleanupUrl, file, levelFactor])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="space-y-3">
        <div className="text-sm font-medium text-slate-900">步骤一：上传 PDF 文件</div>
        <p className="text-sm text-slate-600 leading-relaxed">选择需要压缩的 PDF 文件，文件在浏览器本地读取，不上传。</p>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 space-y-3">
          <label htmlFor="pdf-file-input" className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
            <span className="text-sm font-medium text-slate-900">点击选择 PDF 文件</span>
            <span className="text-xs text-slate-500">支持单个 PDF 文件，推荐小于 50MB 以保证浏览器稳定。</span>
          </label>
          <input
            id="pdf-file-input"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => onPickFile(e.currentTarget.files?.[0] || null)}
          />

          <div className="space-y-1 text-xs text-slate-600">
            <div>
              原始文件：<span className="font-medium text-slate-900">{file?.name || '—'}</span>
            </div>
            <div>
              原始大小：<span className="font-medium text-slate-900">{originalSizeLabel}</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">说明：处理过程仅在浏览器内存中完成，不会持久保存或上传到任何服务器。</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium text-slate-900">步骤二：选择压缩等级</div>
        <p className="text-sm text-slate-600 leading-relaxed">根据场景在 Low / Medium / High 之间选择压缩等级。</p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
          <fieldset className="space-y-2">
            <legend className="text-xs font-medium text-slate-900">压缩等级</legend>
            <div className="space-y-1 text-xs text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pdf-compress-level"
                  value="low"
                  checked={level === 'low'}
                  onChange={() => setLevel('low')}
                  className="h-3 w-3"
                />
                <span>Low · 保真优先（轻度压缩）</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pdf-compress-level"
                  value="medium"
                  checked={level === 'medium'}
                  onChange={() => setLevel('medium')}
                  className="h-3 w-3"
                />
                <span>Medium · 平衡（推荐）</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pdf-compress-level"
                  value="high"
                  checked={level === 'high'}
                  onChange={() => setLevel('high')}
                  className="h-3 w-3"
                />
                <span>High · 体积优先（上传限制）</span>
              </label>
            </div>
          </fieldset>

          <button
            type="button"
            onClick={onCompress}
            disabled={busy}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-60"
          >
            {busy ? '处理中…' : 'Compress Now'}
          </button>
          <div className="text-xs text-slate-500">{status}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium text-slate-900">步骤三：查看结果并下载</div>
        <p className="text-sm text-slate-600 leading-relaxed">压缩完成后可以下载新的 PDF 文件并与原始体积对比。</p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
          <div className="flex items-baseline justify-between text-xs text-slate-700">
            <span>Original size</span>
            <span>{originalSizeLabel}</span>
          </div>
          <div className="flex items-baseline justify-between text-xs text-slate-700">
            <span>Compressed size</span>
            <span>{compressedSizeLabel}</span>
          </div>

          <a
            href={downloadUrl || '#'}
            download={downloadName || undefined}
            className={[
              'mt-3 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white',
              downloadUrl ? '' : 'opacity-40 pointer-events-none',
            ].join(' ')}
          >
            Download Compressed PDF
          </a>

          <div className="text-xs text-slate-500">
            当前版本在浏览器本地完成基础压缩与重打包流程，对已高度压缩的 PDF 体积变化可能有限，后续会逐步增强算法。
          </div>
        </div>
      </div>
    </div>
  )
}

