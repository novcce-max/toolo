'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    PDFLib?: any
  }
}

type FileItem = {
  id: string
  file: File
}

function formatSize(bytes?: number) {
  if (bytes === undefined || bytes === null) return '—'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

function isPdfFile(f: File) {
  const name = f.name || ''
  const type = f.type || ''
  return type === 'application/pdf' || /\.pdf$/i.test(name)
}

export default function PdfMergeClient() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [libReady, setLibReady] = useState(false)
  const [files, setFiles] = useState<FileItem[]>([])
  const [status, setStatus] = useState<string>('选择多个 PDF 文件后，可调整顺序并点击“合并并生成 PDF”。所有处理在本地完成，不上传文件。')
  const [busy, setBusy] = useState(false)

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [mergedSize, setMergedSize] = useState<number | null>(null)

  const fileCount = files.length

  useEffect(() => {
    let alive = true
    const timer = window.setInterval(() => {
      if (window.PDFLib && alive) {
        setLibReady(true)
        window.clearInterval(timer)
      }
    }, 120)
    return () => {
      alive = false
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        try {
          URL.revokeObjectURL(downloadUrl)
        } catch {}
      }
    }
  }, [downloadUrl])

  const canMerge = useMemo(() => libReady && fileCount > 0 && !busy, [libReady, fileCount, busy])

  function resetResult() {
    setMergedSize(null)
    if (downloadUrl) {
      try {
        URL.revokeObjectURL(downloadUrl)
      } catch {}
    }
    setDownloadUrl(null)
  }

  function addFileList(fileList: FileList | File[]) {
    const arr = Array.from(fileList || [])
      .filter(Boolean)
      .filter((f) => isPdfFile(f))

    if (arr.length === 0) {
      setFiles([])
      resetResult()
      setStatus('未检测到 PDF 文件，请选择 .pdf 文件后重试。')
      return
    }

    const next: FileItem[] = arr.map((f, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(16).slice(2)}`,
      file: f,
    }))

    setFiles(next)
    resetResult()
    setStatus(`已选择 ${next.length} 个 PDF 文件，可以调整顺序后开始合并。`)
  }

  function onPickClick() {
    inputRef.current?.click()
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files
    if (!list || list.length === 0) {
      setStatus('未选择文件，请重新选择。')
      return
    }
    addFileList(list)
    e.target.value = ''
  }

  function move(index: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = prev.slice()
      const j = index + dir
      if (j < 0 || j >= next.length) return prev
      const tmp = next[index]
      next[index] = next[j]
      next[j] = tmp
      return next
    })
    resetResult()
  }

  function removeAt(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    resetResult()
  }

  async function mergeNow() {
    if (!libReady || !window.PDFLib) {
      setStatus('PDF 处理库加载中，请稍后重试。')
      return
    }
    if (files.length === 0) {
      setStatus('请先选择至少一个 PDF 文件。')
      return
    }
    if (busy) return

    resetResult()
    setBusy(true)
    setStatus('正在本地合并 PDF，请稍候…')

    try {
      const PDFLib = window.PDFLib
      const mergedPdf = await PDFLib.PDFDocument.create()

      for (let i = 0; i < files.length; i++) {
        const f = files[i].file
        const ab = await f.arrayBuffer()
        const srcDoc = await PDFLib.PDFDocument.load(ab, { ignoreEncryption: true })
        const indices = srcDoc.getPageIndices()
        const copiedPages = await mergedPdf.copyPages(srcDoc, indices)
        copiedPages.forEach((p: any) => mergedPdf.addPage(p))
      }

      const mergedBytes = (await mergedPdf.save({ useObjectStreams: true })) as Uint8Array

      const arrayBuffer = new ArrayBuffer(mergedBytes.byteLength)
      new Uint8Array(arrayBuffer).set(mergedBytes)

      const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      setDownloadUrl(url)
      setMergedSize(mergedBytes.byteLength)
      setStatus('合并完成，已在本地生成新的 PDF 文件，可以点击“下载合并后 PDF”。')
    } catch {
      setStatus('合并过程中出现错误，可以尝试减少文件数量、缩小文件体积或换一个 PDF 文件重试。')
      resetResult()
    } finally {
      setBusy(false)
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    const list = e.dataTransfer?.files
    if (!list || list.length === 0) {
      setStatus('未检测到拖拽文件，请重新拖拽 PDF 文件到此区域。')
      return
    }
    addFileList(list)
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  return (
    <>
      <Script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js" strategy="afterInteractive" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤一：选择多个 PDF 文件</div>
          <p className="text-sm text-slate-600 leading-relaxed">点击选择或将多个 PDF 文件一次性拖入。文件仅在浏览器本地读取，不会上传服务器。</p>

          <div onDrop={onDrop} onDragOver={onDragOver} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 space-y-3">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <button
                type="button"
                onClick={onPickClick}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                选择或拖拽 PDF 文件
              </button>
              <div className="text-xs text-slate-500">支持多选，建议单个文件大小适中，以保证浏览器稳定性。</div>
            </div>

            <input ref={inputRef} type="file" multiple accept="application/pdf" className="sr-only" onChange={onInputChange} />

            <div className="space-y-1 text-xs text-slate-600">
              <div>
                已选择文件数：<span className="font-medium text-slate-900">{fileCount}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed">提示：若页面通过站内 Link 跳转进入，本工具依然可用；不依赖“刷新页面”触发脚本。</div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤二：调整合并顺序</div>
          <p className="text-sm text-slate-600 leading-relaxed">按照最终阅读顺序调整文件位置，支持上移/下移，也可以删除不需要合并的文件。</p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3 max-h-64 overflow-auto">
            <div className="text-xs font-medium text-slate-900">合并顺序</div>

            {files.length === 0 ? (
              <div className="text-xs text-slate-500">尚未选择文件。</div>
            ) : (
              <ul className="space-y-2 text-xs text-slate-700">
                {files.map((item, index) => (
                  <li key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-slate-900">{item.file.name}</div>
                      <div className="text-[11px] text-slate-500">{formatSize(item.file.size)}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        上移
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === files.length - 1}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
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
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-900">步骤三：合并并下载</div>
          <p className="text-sm text-slate-600 leading-relaxed">点击合并后在本地生成一个新的 PDF 文件，你可以直接下载，并查看合并后文件大小。</p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
            <div className="flex items-baseline justify-between text-xs text-slate-700">
              <span>合并前文件数</span>
              <span>{fileCount}</span>
            </div>
            <div className="flex items-baseline justify-between text-xs text-slate-700">
              <span>合并后文件大小</span>
              <span>{mergedSize === null ? '—' : formatSize(mergedSize)}</span>
            </div>

            <button
              type="button"
              onClick={mergeNow}
              disabled={!canMerge}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {busy ? '合并中…' : '合并并生成 PDF'}
            </button>

            <a
              href={downloadUrl || '#'}
              download="merged.pdf"
              className={[
                'mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300',
                downloadUrl ? 'hover:bg-slate-800' : 'opacity-40 pointer-events-none',
              ].join(' ')}
            >
              下载合并后 PDF
            </a>

            <div className="text-xs text-slate-500">{status}</div>

            <div className="text-[11px] text-slate-500 leading-relaxed">{libReady ? 'PDF 处理库已就绪。' : 'PDF 处理库加载中（首次进入可能需要 1-3 秒）。'}</div>
          </div>
        </div>
      </div>
    </>
  )
}