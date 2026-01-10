// 文件路径: /components/pdf/PdfSplitClient.tsx
'use client'

import Script from 'next/script'
import { useEffect, useMemo, useRef, useState } from 'react'

declare global {
  interface Window {
    PDFLib?: any
  }
}

type SplitRange = { start: number; end: number }
type SplitResult = { key: string; label: string; size: number; url: string }

function formatSize(bytes?: number | null) {
  if (bytes === undefined || bytes === null) return '—'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

function normalizeU8ToBlobPart(u8: Uint8Array) {
  // 解决 TS 对 BlobPart / ArrayBufferLike 的兼容性报错（SharedArrayBuffer 场景）
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength)
}

function parseRanges(text: string, maxPage: number | null): SplitRange[] {
  const raw = (text || '').replace(/\s+/g, '')
  if (!raw) return []
  const parts = raw.split(',').filter(Boolean)

  const ranges: SplitRange[] = []
  for (const part of parts) {
    if (!part) continue
    if (part.includes('-')) {
      const seg = part.split('-')
      if (seg.length !== 2) continue
      let a = parseInt(seg[0], 10)
      let b = parseInt(seg[1], 10)
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue
      if (a < 1 || b < 1) continue
      if (a > b) {
        const t = a
        a = b
        b = t
      }
      if (maxPage && a > maxPage) continue
      if (maxPage && b > maxPage) b = maxPage
      ranges.push({ start: a, end: b })
    } else {
      const p = parseInt(part, 10)
      if (!Number.isFinite(p) || p < 1) continue
      if (maxPage && p > maxPage) continue
      ranges.push({ start: p, end: p })
    }
  }

  return ranges
}

export default function PdfSplitClient() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [libReady, setLibReady] = useState(false)
  const [busy, setBusy] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)

  const [rangesText, setRangesText] = useState<string>('1-3')
  const [status, setStatus] = useState<string>('上传 PDF 并填写正确的页码范围后，点击“按范围拆分 PDF”即可在本地生成多个子文档。')

  const [results, setResults] = useState<SplitResult[]>([])

  const canSplit = useMemo(() => libReady && !busy && !!fileBytes && !!pageCount, [libReady, busy, fileBytes, pageCount])

  useEffect(() => {
    // 组件卸载时清理 URL
    return () => {
      results.forEach((r) => {
        try {
          URL.revokeObjectURL(r.url)
        } catch {}
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function cleanupResults(nextStatus?: string) {
    setResults((prev) => {
      prev.forEach((r) => {
        try {
          URL.revokeObjectURL(r.url)
        } catch {}
      })
      return []
    })
    if (nextStatus) setStatus(nextStatus)
  }

  async function onPickFile(f: File | null) {
    cleanupResults()
    setFileBytes(null)
    setPageCount(null)

    if (!f) {
      setFile(null)
      setStatus('请选择需要拆分的 PDF 文件。')
      return
    }

    setFile(f)
    setStatus('正在本地读取 PDF 页面信息，请稍候…')

    try {
      const ab = await f.arrayBuffer()
      const u8 = new Uint8Array(ab)
      setFileBytes(u8)

      if (!window.PDFLib) {
        setStatus('PDF 处理库加载中，请稍后重试。')
        return
      }

      const PDFLib = window.PDFLib
      const pdfDoc = await PDFLib.PDFDocument.load(u8, { ignoreEncryption: true })
      const pc = pdfDoc.getPageCount()
      setPageCount(pc)
      setStatus(`已读取 PDF，共 ${pc} 页。请输入要拆分的页码范围。`)
    } catch {
      setFile(null)
      setFileBytes(null)
      setPageCount(null)
      setStatus('解析 PDF 文件失败，请检查文件是否损坏或加密。')
    }
  }

  function triggerPick() {
    inputRef.current?.click()
  }

  async function doSplit() {
    if (!window.PDFLib || !libReady) {
      setStatus('PDF 处理库加载中，请稍后重试。')
      return
    }
    if (!fileBytes || !pageCount) {
      setStatus('请先上传需要拆分的 PDF 文件。')
      return
    }
    if (busy) return

    const ranges = parseRanges(rangesText, pageCount)
    if (!ranges.length) {
      setStatus('页码范围无效，请检查格式，例如：1-3,5,8-10。')
      return
    }

    setBusy(true)
    cleanupResults('正在本地按页码范围拆分 PDF，请稍候…')

    try {
      const PDFLib = window.PDFLib
      const srcDoc = await PDFLib.PDFDocument.load(fileBytes, { ignoreEncryption: true })

      const nextResults: SplitResult[] = []

      for (const r of ranges) {
        const startIndex = Math.max(0, r.start - 1)
        const endIndex = Math.min(pageCount - 1, r.end - 1)
        if (startIndex > endIndex) continue

        const newDoc = await PDFLib.PDFDocument.create()
        const indices: number[] = []
        for (let p = startIndex; p <= endIndex; p++) indices.push(p)

        const copied = await newDoc.copyPages(srcDoc, indices)
        copied.forEach((page: any) => newDoc.addPage(page))

        const bytes: Uint8Array = await newDoc.save({ useObjectStreams: true })
        const blob = new Blob([normalizeU8ToBlobPart(bytes)], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)

        const label = `页码范围：${r.start}${r.start === r.end ? '' : `-${r.end}`}`
        const key = `${r.start}-${r.end}`

        nextResults.push({
          key,
          label,
          size: bytes.length,
          url,
        })
      }

      setResults(nextResults)

      if (nextResults.length === 0) {
        setStatus('未能根据当前页码范围拆分出有效子文档，请检查范围设置。')
      } else {
        setStatus(`拆分完成，共生成 ${nextResults.length} 个子 PDF 文件，可以逐个下载。`)
      }
    } catch {
      cleanupResults('拆分过程中出现错误，可以尝试缩小范围或重新上传文件。')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Script
        src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"
        strategy="afterInteractive"
        onLoad={() => setLibReady(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤一：上传单个 PDF 文件</div>
          <p className="text-sm text-slate-600 leading-relaxed">
            选择需要拆分的 PDF 文件，文件会在浏览器本地读取，不会上传到服务器。建议文件页数和大小适中，以保证拆分过程顺畅。
          </p>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 space-y-3">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <button
                type="button"
                onClick={triggerPick}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                点击选择要拆分的 PDF 文件
              </button>
              <span className="text-xs text-slate-500">一次仅支持一个 PDF 文件，用于按页拆分。</span>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0] || null
                onPickFile(f)
                e.target.value = ''
              }}
            />

            <div className="space-y-1 text-xs text-slate-600">
              <div>
                原始文件：<span className="font-medium text-slate-900">{file ? file.name : '—'}</span>
              </div>
              <div>
                原始大小：<span className="font-medium text-slate-900">{file ? formatSize(file.size) : '—'}</span>
              </div>
              <div>
                原始页数：<span className="font-medium text-slate-900">{pageCount === null ? '—' : String(pageCount)}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed">
              {libReady ? 'PDF 处理库已就绪。' : 'PDF 处理库加载中（首次进入可能需要 1-3 秒）。'}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤二：输入拆分页码范围</div>
          <p className="text-sm text-slate-600 leading-relaxed">
            通过页码范围指定要拆分出的部分，支持多个范围组合，例如：1-3,5,8-10。页码从 1 开始计数。
          </p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
            <label htmlFor="pdf-split-ranges-react" className="text-xs font-medium text-slate-900">
              页码范围
            </label>
            <input
              id="pdf-split-ranges-react"
              type="text"
              inputMode="text"
              placeholder="例如：1-3,5,8-10"
              value={rangesText}
              onChange={(e) => setRangesText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />

            <div className="text-[11px] text-slate-500 leading-relaxed">
              使用规则：用逗号分隔多个片段，每个片段可以是单页（如 5）或范围（如 2-6）。页码必须是大于等于 1 的整数，不要包含 0 或负数。
            </div>

            <button
              type="button"
              onClick={doSplit}
              disabled={!canSplit}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {busy ? '拆分中…' : '按范围拆分 PDF'}
            </button>

            <div className="text-xs text-slate-500">{status}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤三：下载拆分结果</div>
          <p className="text-sm text-slate-600 leading-relaxed">
            拆分完成后，会生成多个子 PDF 文件，文件名会带上对应的页码范围。你可以逐个点击下载，也可以按需要选择其中的一部分保存。
          </p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3 max-h-64 overflow-auto">
            <div className="flex items-baseline justify-between text-xs text-slate-700">
              <span>拆分结果数量</span>
              <span>{results.length}</span>
            </div>

            {results.length === 0 ? (
              <div className="text-xs text-slate-500">尚未生成拆分结果。</div>
            ) : (
              <ul className="space-y-2 text-xs text-slate-700">
                {results.map((r) => (
                  <li
                    key={r.key}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-slate-900">{r.label}</div>
                      <div className="text-[11px] text-slate-500">大小：{formatSize(r.size)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={r.url}
                        download={`split-${r.key}.pdf`}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                      >
                        下载
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}