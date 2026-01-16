'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import PdfLibScript from '@/components/pdf/PdfLibScript'

type PageMode = 'a4' | 'original'

function formatSize(bytes?: number | null) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

function u8ToArrayBuffer(u8: Uint8Array) {
  const ab = new ArrayBuffer(u8.byteLength)
  new Uint8Array(ab).set(new Uint8Array(u8.buffer, u8.byteOffset, u8.byteLength))
  return ab
}

async function fileToEmbeddedImage(pdfDoc: any, file: File) {
  const ab = await file.arrayBuffer()
  const bytes = new Uint8Array(ab)

  if (file.type === 'image/png') return pdfDoc.embedPng(bytes)
  if (file.type === 'image/jpeg') return pdfDoc.embedJpg(bytes)

  // WebP：pdf-lib 不支持直接 embed，转换成 PNG 再 embed（稳定优先）
  if (file.type === 'image/webp') {
    const url = URL.createObjectURL(file)
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image()
        el.onload = () => resolve(el)
        el.onerror = () => reject(new Error('decode webp failed'))
        el.src = url
      })

      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth || img.width
      canvas.height = img.naturalHeight || img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('canvas not supported')
      ctx.drawImage(img, 0, 0)

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
      })
      const pngBytes = new Uint8Array(await pngBlob.arrayBuffer())
      return pdfDoc.embedPng(pngBytes)
    } finally {
      try {
        URL.revokeObjectURL(url)
      } catch {
        // ignore
      }
    }
  }

  throw new Error('unsupported image type')
}

export default function ImagesToPdfClient() {
  const [libReady, setLibReady] = useState(false)
  const [pageMode, setPageMode] = useState<PageMode>('a4')
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('选择图片并调整顺序后，点击“生成 PDF 文件”即可在浏览器本地完成合成并下载。')
  const [summarySize, setSummarySize] = useState<number | null>(null)

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const cleanupUrl = useCallback(() => {
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

  const countLabel = useMemo(() => String(files.length), [files.length])
  const summarySizeLabel = useMemo(() => formatSize(summarySize), [summarySize])

  const addPickedFiles = useCallback(
    (picked: FileList | null) => {
      cleanupUrl()
      setSummarySize(null)

      const arr = Array.from(picked || [])
      const next = arr.filter((f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type))

      setFiles(next)
      if (next.length === 0) {
        setStatus('请至少选择一张 JPG/PNG/WebP 图片。')
      } else {
        setStatus(`已选择 ${next.length} 张图片，你可以调整顺序后生成 PDF。`)
      }
    },
    [cleanupUrl],
  )

  const onDropFiles = useCallback(
    (picked: FileList | null) => {
      setDragActive(false)
      addPickedFiles(picked)
    },
    [addPickedFiles],
  )

  const move = useCallback((from: number, to: number) => {
    setFiles((prev) => {
      if (to < 0 || to >= prev.length) return prev
      const next = prev.slice()
      const tmp = next[from]
      next[from] = next[to]
      next[to] = tmp
      return next
    })
  }, [])

  const removeAt = useCallback(
    (idx: number) => {
      cleanupUrl()
      setSummarySize(null)
      setFiles((prev) => prev.filter((_, i) => i !== idx))
    },
    [cleanupUrl],
  )

  const onGenerate = useCallback(async () => {
    if (!libReady || !window.PDFLib) {
      setStatus('PDF 处理库加载中，请稍后重试。')
      return
    }
    if (files.length === 0) {
      setStatus('请先选择至少一张图片。')
      return
    }

    setBusy(true)
    cleanupUrl()
    setSummarySize(null)
    setStatus('正在本地生成 PDF，请稍候…')

    try {
      const pdfDoc = await window.PDFLib.PDFDocument.create()
      for (const file of files) {
        const image = await fileToEmbeddedImage(pdfDoc, file)
        const width = image.width
        const height = image.height

        let pageWidth = width
        let pageHeight = height
        if (pageMode === 'a4') {
          pageWidth = 595.28
          pageHeight = 841.89
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight])

        let scale = 1
        if (pageMode === 'a4') {
          const scaleX = pageWidth / width
          const scaleY = pageHeight / height
          scale = Math.min(scaleX, scaleY, 1)
        }

        const drawW = width * scale
        const drawH = height * scale
        const x = (pageWidth - drawW) / 2
        const y = (pageHeight - drawH) / 2
        page.drawImage(image, { x, y, width: drawW, height: drawH })
      }

      const pdfBytes: Uint8Array = await pdfDoc.save({ useObjectStreams: true })
      const blob = new Blob([u8ToArrayBuffer(pdfBytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      setDownloadUrl(url)
      setSummarySize(pdfBytes.length)
      setStatus('PDF 已在本地生成，可以点击“下载合成后的 PDF”保存到本地。')
    } catch {
      cleanupUrl()
      setSummarySize(null)
      setStatus('生成 PDF 过程中出现错误，可以尝试减少图片数量或降低分辨率后重试。')
    } finally {
      setBusy(false)
    }
  }, [cleanupUrl, files, libReady, pageMode])

  return (
    <>
      <PdfLibScript onReady={() => setLibReady(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤一：选择多张图片</div>
          <p className="text-sm text-slate-600 leading-relaxed">
            点击按钮选择多张图片，支持 JPG/JPEG/PNG/WebP。建议按大致顺序选择，后续可以微调。
          </p>

          <div
            className={[
              'rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 space-y-3 transition-colors',
              dragActive ? 'ring-2 ring-slate-300' : '',
            ].join(' ')}
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setDragActive(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              onDropFiles(e.dataTransfer?.files || null)
            }}
          >
            <label htmlFor="images-to-pdf-input" className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800">
                {files.length > 0 ? `已选择 ${files.length} 张图片（点击重新选择）` : '选择要合成的图片'}
              </span>
              <span className="text-xs text-slate-500">支持拖拽图片到此区域，所有处理在浏览器本地完成，不上传。</span>
            </label>
            <input
              id="images-to-pdf-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => addPickedFiles(e.currentTarget.files)}
            />

            <div className="space-y-1 text-xs text-slate-600">
              <div>
                已选择图片数：<span className="font-medium text-slate-900">{countLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤二：调整顺序与页面尺寸</div>
          <p className="text-sm text-slate-600 leading-relaxed">
            通过“上移/下移/删除”调整图片在 PDF 中的顺序，并选择 A4 或按图片原尺寸生成页面。
          </p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3 max-h-64 overflow-auto">
            <fieldset className="space-y-2">
              <legend className="text-xs font-medium text-slate-900">页面尺寸</legend>
              <div className="space-y-1 text-xs text-slate-700">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="images-to-pdf-page-size"
                    value="a4"
                    checked={pageMode === 'a4'}
                    onChange={() => setPageMode('a4')}
                    className="h-3 w-3"
                  />
                  <span>A4 页面（适合打印和标准文档）</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="images-to-pdf-page-size"
                    value="original"
                    checked={pageMode === 'original'}
                    onChange={() => setPageMode('original')}
                    className="h-3 w-3"
                  />
                  <span>按图片原尺寸生成页面（保持原始分辨率）</span>
                </label>
              </div>
            </fieldset>

            <div className="mt-3 text-xs font-medium text-slate-900">图片顺序</div>
            <ul className="space-y-2 text-xs text-slate-700">
              {files.length === 0 ? (
                <li className="text-xs text-slate-500">暂无图片，请先选择。</li>
              ) : (
                files.map((f, index) => (
                  <li
                    key={`${f.name}-${f.size}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-slate-900">{f.name}</div>
                      <div className="text-[11px] text-slate-500">{formatSize(f.size)}</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(index, index - 1)}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                      >
                        上移
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, index + 1)}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                      >
                        下移
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAt(index)}
                        className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] text-rose-700 hover:bg-rose-100"
                      >
                        删除
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤三：生成并下载 PDF</div>
          <p className="text-sm text-slate-600 leading-relaxed">生成完成后，可以下载合成后的 PDF 文件。</p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
            <div className="flex items-baseline justify-between text-xs text-slate-700">
              <span>生成的 PDF 大小</span>
              <span>{summarySizeLabel}</span>
            </div>

            <button
              type="button"
              onClick={onGenerate}
              disabled={busy}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-60"
            >
              {busy ? '生成中…' : '生成 PDF 文件'}
            </button>

            <a
              href={downloadUrl || '#'}
              download="images-to-pdf.pdf"
              className={[
                'inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white',
                downloadUrl ? '' : 'opacity-40 pointer-events-none',
              ].join(' ')}
            >
              下载合成后的 PDF
            </a>

            <div className="text-xs text-slate-500">{status}</div>
          </div>
        </div>
      </div>
    </>
  )
}

