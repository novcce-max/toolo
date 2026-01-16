'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import PdfLibScript from '@/components/pdf/PdfLibScript'

type ScopeMode = 'all' | 'range'
type Angle = 90 | 180 | 270

function formatSize(bytes?: number | null) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

function parseRanges(text: string, maxPage: number): number[] {
  const raw = (text || '').replace(/\s+/g, '')
  if (!raw) return []
  const parts = raw.split(',')
  const indices = new Set<number>()

  for (const part of parts) {
    if (!part) continue
    if (part.includes('-')) {
      const seg = part.split('-')
      if (seg.length !== 2) continue
      let start = parseInt(seg[0] || '', 10)
      let end = parseInt(seg[1] || '', 10)
      if (!start || !end || start < 1 || end < 1) continue
      if (start > end) [start, end] = [end, start]
      if (start > maxPage) continue
      if (end > maxPage) end = maxPage
      for (let p = start; p <= end; p += 1) indices.add(p - 1)
    } else {
      const num = parseInt(part, 10)
      if (!num || num < 1 || num > maxPage) continue
      indices.add(num - 1)
    }
  }

  return Array.from(indices).sort((a, b) => a - b)
}

function u8ToArrayBuffer(u8: Uint8Array) {
  const ab = new ArrayBuffer(u8.byteLength)
  new Uint8Array(ab).set(new Uint8Array(u8.buffer, u8.byteOffset, u8.byteLength))
  return ab
}

export default function PdfRotateClient() {
  const [libReady, setLibReady] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)

  const [angle, setAngle] = useState<Angle>(90)
  const [scope, setScope] = useState<ScopeMode>('all')
  const [rangesText, setRangesText] = useState('')

  const [busy, setBusy] = useState(false)
  const [processedCount, setProcessedCount] = useState<number | null>(null)
  const [status, setStatus] = useState('上传 PDF 并设置好角度与范围后，点击“开始旋转”即可在浏览器本地完成处理并下载。')

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadName, setDownloadName] = useState<string | null>(null)

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

  const originalSizeLabel = useMemo(() => formatSize(file?.size ?? null), [file])
  const fileNameLabel = useMemo(() => (file?.name ? file.name : '—'), [file])

  const onPickFile = useCallback(
    async (picked: File | null) => {
      cleanupUrl()
      setProcessedCount(null)
      setPageCount(null)
      setFileBytes(null)
      setFile(picked)

      if (!picked) {
        setStatus('请选择需要旋转的 PDF 文件。')
        return
      }
      if (picked.type !== 'application/pdf') {
        setFile(null)
        setStatus('文件格式错误，请选择 PDF 文件。')
        return
      }
      if (!libReady || !window.PDFLib) {
        setStatus('PDF 处理库加载中，请稍后重试。')
        return
      }

      setStatus('正在本地读取 PDF 页面信息，请稍候…')
      try {
        const ab = await picked.arrayBuffer()
        const bytes = new Uint8Array(ab)
        setFileBytes(bytes)

        const pdfDoc = await window.PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true })
        const count = pdfDoc.getPageCount()
        setPageCount(count)
        setStatus(`已读取 PDF，共 ${count} 页。请选择旋转角度与范围。`)
      } catch {
        setFile(null)
        setFileBytes(null)
        setPageCount(null)
        setStatus('解析 PDF 文件失败，请检查文件是否损坏。')
      }
    },
    [cleanupUrl, libReady],
  )

  const onDropFile = useCallback(
    (f: File | null) => {
      setDragActive(false)
      void onPickFile(f)
    },
    [onPickFile],
  )

  const onRotate = useCallback(async () => {
    if (!libReady || !window.PDFLib) {
      setStatus('PDF 处理库加载中，请稍后重试。')
      return
    }
    if (!fileBytes || !pageCount) {
      setStatus('请先上传需要旋转的 PDF 文件。')
      return
    }

    let targetIndices: number[] = []
    if (scope === 'range') {
      targetIndices = parseRanges(rangesText, pageCount)
      if (targetIndices.length === 0) {
        setStatus('页码范围无效，请检查格式，例如：1,3,5-8，并确认不超过总页数。')
        return
      }
    } else {
      targetIndices = Array.from({ length: pageCount }, (_, i) => i)
    }

    setBusy(true)
    cleanupUrl()
    setProcessedCount(null)
    setStatus('正在本地旋转 PDF 页面，请稍候…')

    try {
      const PDFLib = window.PDFLib
      const pdfDoc = await PDFLib.PDFDocument.load(fileBytes, { ignoreEncryption: true })
      const pages = pdfDoc.getPages()

      let rotated = 0
      for (let i = 0; i < pages.length; i += 1) {
        if (!targetIndices.includes(i)) continue
        const page = pages[i]
        const rotation = page.getRotation?.()
        const currentAngle = rotation && typeof rotation.angle === 'number' ? rotation.angle : 0
        const next = (currentAngle + angle) % 360
        page.setRotation(PDFLib.degrees(next))
        rotated += 1
      }

      const rotatedBytes: Uint8Array = await pdfDoc.save({ useObjectStreams: true })
      const blob = new Blob([u8ToArrayBuffer(rotatedBytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const base = (file?.name || 'rotated.pdf').toLowerCase().endsWith('.pdf')
        ? (file?.name || 'rotated.pdf').slice(0, -4)
        : file?.name || 'rotated'

      setDownloadUrl(url)
      setDownloadName(`${base}.rotated.pdf`)
      setProcessedCount(rotated)
      setStatus(`旋转完成，共处理 ${rotated} 页。可以点击“下载旋转后的 PDF”保存到本地。`)
    } catch {
      cleanupUrl()
      setProcessedCount(null)
      setStatus('旋转过程中出现错误，请检查文件是否损坏，或减少页数后重试。')
    } finally {
      setBusy(false)
    }
  }, [angle, cleanupUrl, file, fileBytes, libReady, pageCount, rangesText, scope])

  return (
    <>
      <PdfLibScript onReady={() => setLibReady(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤一：上传 PDF 文件</div>
          <p className="text-sm text-slate-600 leading-relaxed">
            选择需要旋转的 PDF 文件，文件会在浏览器本地读取，不会上传到服务器。
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
              const f = e.dataTransfer?.files?.[0] || null
              onDropFile(f)
            }}
          >
            <label
              htmlFor="pdf-rotate-input"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800">
                {file ? `已选择：${file.name}（点击重新选择）` : '选择要旋转的 PDF 文件'}
              </span>
              <span className="text-xs text-slate-500">支持拖拽 PDF 到此区域，文件仅在本地处理。</span>
            </label>
            <input
              id="pdf-rotate-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => onPickFile(e.currentTarget.files?.[0] || null)}
            />

            <div className="space-y-1 text-xs text-slate-600">
              <div>
                原始文件：<span className="font-medium text-slate-900">{fileNameLabel}</span>
              </div>
              <div>
                原始大小：<span className="font-medium text-slate-900">{originalSizeLabel}</span>
              </div>
              <div>
                原始页数：<span className="font-medium text-slate-900">{pageCount ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤二：选择旋转角度与范围</div>
          <p className="text-sm text-slate-600 leading-relaxed">先选择旋转角度，再选择作用范围。页码从 1 开始计数。</p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-4">
            <fieldset className="space-y-2">
              <legend className="text-xs font-medium text-slate-900">旋转角度</legend>
              <div className="space-y-1 text-xs text-slate-700">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="pdf-rotate-angle"
                    value="90"
                    checked={angle === 90}
                    onChange={() => setAngle(90)}
                    className="h-3 w-3"
                  />
                  <span>顺时针 90°</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="pdf-rotate-angle"
                    value="180"
                    checked={angle === 180}
                    onChange={() => setAngle(180)}
                    className="h-3 w-3"
                  />
                  <span>旋转 180°</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="pdf-rotate-angle"
                    value="270"
                    checked={angle === 270}
                    onChange={() => setAngle(270)}
                    className="h-3 w-3"
                  />
                  <span>顺时针 270°（等同逆时针 90°）</span>
                </label>
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-xs font-medium text-slate-900">作用范围</legend>
              <div className="space-y-1 text-xs text-slate-700">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="pdf-rotate-scope"
                    value="all"
                    checked={scope === 'all'}
                    onChange={() => setScope('all')}
                    className="h-3 w-3"
                  />
                  <span>全部页面</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="pdf-rotate-scope"
                    value="range"
                    checked={scope === 'range'}
                    onChange={() => setScope('range')}
                    className="h-3 w-3"
                  />
                  <span>指定页码范围</span>
                </label>
              </div>
            </fieldset>

            <div className="space-y-2">
              <label htmlFor="pdf-rotate-ranges" className="text-xs font-medium text-slate-900">
                指定页码范围（仅在选择“指定页码范围”时生效）
              </label>
              <input
                id="pdf-rotate-ranges"
                type="text"
                inputMode="numeric"
                placeholder="例如：1,3,5-8"
                value={rangesText}
                onChange={(e) => setRangesText(e.target.value)}
                disabled={scope !== 'range'}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60"
              />
              <div className="text-[11px] text-slate-500 leading-relaxed">
                使用规则：用逗号分隔多个片段，每个片段可以是单页（如 3）或范围（如 5-8）。
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤三：旋转并下载</div>
          <p className="text-sm text-slate-600 leading-relaxed">点击“开始旋转”，在浏览器本地完成处理并下载新的 PDF。</p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
            <div className="flex items-baseline justify-between text-xs text-slate-700">
              <span>处理页数</span>
              <span>{processedCount ?? '—'}</span>
            </div>
            <button
              type="button"
              onClick={onRotate}
              disabled={busy}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-60"
            >
              {busy ? '处理中…' : '开始旋转'}
            </button>

            <a
              href={downloadUrl || '#'}
              download={downloadName || undefined}
              className={[
                'inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white',
                downloadUrl ? '' : 'opacity-40 pointer-events-none',
              ].join(' ')}
            >
              下载旋转后的 PDF
            </a>

            <div className="text-xs text-slate-500">{status}</div>
          </div>
        </div>
      </div>
    </>
  )
}

