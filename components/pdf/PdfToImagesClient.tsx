'use client'

import { useState, useRef, useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    pdfjsLib?: {
      getDocument: (data: { data: Uint8Array }) => {
        promise: Promise<{
          numPages: number
          getPage: (pageNumber: number) => Promise<{
            render: (options: {
              canvasContext: CanvasRenderingContext2D
              viewport: any
            }) => { promise: Promise<void> }
            getViewport: (options: { scale: number }) => any
          }>
        }>
      }
      GlobalWorkerOptions: {
        workerSrc: string
      }
    }
  }
}

export default function PdfToImagesClient() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [scale, setScale] = useState<number>(1.5)
  const [pageRange, setPageRange] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [imageUrls, setImageUrls] = useState<Array<{ url: string; pageNum: number; size: number }>>([])
  const [status, setStatus] = useState<string>('请选择 PDF 文件')
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropzoneRef = useRef<HTMLDivElement>(null)

  // 确保 input 元素在组件挂载时正确初始化（解决客户端路由切换后文件上传失效的问题）
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // Check if PDF.js is already loaded (e.g., from previous page navigation)
  useEffect(() => {
    const checkPdfjs = () => {
      if (typeof window !== 'undefined' && window.pdfjsLib) {
        // Ensure worker is configured
        if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        }
        setPdfjsLoaded(true)
        setStatus('PDF.js 库已加载，可以开始使用。')
        return true
      }
      return false
    }

    // Check immediately (for client-side navigation where script might already be loaded)
    if (checkPdfjs()) {
      return
    }

    // If not loaded, set up periodic checks (for client-side navigation)
    let retries = 0
    const maxRetries = 20 // Check for up to 2 seconds
    const checkInterval = setInterval(() => {
      retries++
      if (checkPdfjs()) {
        clearInterval(checkInterval)
      } else if (retries >= maxRetries) {
        clearInterval(checkInterval)
        // Script will load via Script component's onLoad/onReady
      }
    }, 100)

    return () => clearInterval(checkInterval)
  }, [])

  useEffect(() => {
    // Cleanup URLs on unmount
    return () => {
      imageUrls.forEach((item) => {
        URL.revokeObjectURL(item.url)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatSize = (bytes: number): string => {
    if (!bytes && bytes !== 0) return '—'
    if (bytes < 1024) return bytes + ' B'
    const kb = bytes / 1024
    if (kb < 1024) return kb.toFixed(1) + ' KB'
    const mb = kb / 1024
    return mb.toFixed(2) + ' MB'
  }

  const parsePageRange = (text: string, maxPage: number): number[] => {
    const raw = (text || '').replace(/\s+/g, '')
    if (!raw) return []
    const parts = raw.split(',')
    const indices = new Set<number>()
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (!part) continue
      if (part.includes('-')) {
        const seg = part.split('-')
        if (seg.length !== 2) continue
        let start = parseInt(seg[0], 10)
        let end = parseInt(seg[1], 10)
        if (!start || !end || start < 1 || end < 1) continue
        if (start > end) {
          const tmp = start
          start = end
          end = tmp
        }
        if (start > maxPage) continue
        if (end > maxPage) end = maxPage
        for (let p = start; p <= end; p++) {
          indices.add(p - 1) // Convert to 0-based index
        }
      } else {
        const num = parseInt(part, 10)
        if (!num || num < 1) continue
        if (num > maxPage) continue
        indices.add(num - 1) // Convert to 0-based index
      }
    }
    return Array.from(indices).sort((a, b) => a - b)
  }

  const handleFileSelect = async (selectedFile: File | null) => {
    // Cleanup previous images
    imageUrls.forEach((item) => {
      URL.revokeObjectURL(item.url)
    })
    setImageUrls([])
    setFile(selectedFile)
    setPageCount(null)
    setProgress(null)

    if (!selectedFile) {
      setStatus('请选择 PDF 文件')
      return
    }

    if (selectedFile.type !== 'application/pdf') {
      setStatus('文件格式错误，请选择 PDF 文件。')
      return
    }

    // Check PDF.js availability with retry
    if (!window.pdfjsLib) {
      // Try to wait a bit for script to load (client-side navigation case)
      let retries = 0
      const maxRetries = 10
      const checkInterval = setInterval(() => {
        retries++
        if (window.pdfjsLib) {
          clearInterval(checkInterval)
          if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
          }
          setPdfjsLoaded(true)
          // Retry file selection
          handleFileSelect(selectedFile)
        } else if (retries >= maxRetries) {
          clearInterval(checkInterval)
          setStatus('PDF.js 库加载失败，请刷新页面重试。')
        }
      }, 100)
      setStatus('PDF.js 库加载中，请稍候…')
      return
    }

    // Ensure worker is configured
    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    }

    setPdfjsLoaded(true)
    setStatus('正在读取 PDF 文件…')

    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const loadingTask = window.pdfjsLib!.getDocument({ data: uint8Array })
      const pdf = await loadingTask.promise
      const numPages = pdf.numPages
      setPageCount(numPages)
      setStatus(`已读取 PDF，共 ${numPages} 页。请选择导出范围和渲染质量。`)
    } catch (error) {
      setStatus('解析 PDF 文件失败，请检查文件是否损坏。')
      console.error('PDF parsing error:', error)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    handleFileSelect(selectedFile)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('ring-2', 'ring-slate-300')
    }
    const droppedFile = e.dataTransfer.files?.[0] || null
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleFileSelect(droppedFile)
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(droppedFile)
        fileInputRef.current.files = dataTransfer.files
      }
    } else {
      setStatus('请拖拽 PDF 文件到此区域。')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.add('ring-2', 'ring-slate-300')
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('ring-2', 'ring-slate-300')
    }
  }

  const handleGenerate = async () => {
    if (!file || !pageCount) {
      setStatus('请先选择 PDF 文件。')
      return
    }

    // Ensure PDF.js is available
    if (!window.pdfjsLib) {
      setStatus('PDF.js 库未加载，请刷新页面重试。')
      return
    }

    // Ensure worker is configured
    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    }

    // Parse page range
    const targetPages = pageRange.trim()
      ? parsePageRange(pageRange, pageCount)
      : Array.from({ length: pageCount }, (_, i) => i)

    if (targetPages.length === 0) {
      setStatus('页码范围无效，请检查格式，例如：1-3,5,8-10，并确认不超过总页数。')
      return
    }

    setIsProcessing(true)
    setProgress({ current: 0, total: targetPages.length })
    setStatus(`正在渲染第 1/${targetPages.length} 页…`)

    // Cleanup previous images
    imageUrls.forEach((item) => {
      URL.revokeObjectURL(item.url)
    })
    setImageUrls([])

    try {
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const loadingTask = window.pdfjsLib!.getDocument({ data: uint8Array })
      const pdf = await loadingTask.promise

      const newImageUrls: Array<{ url: string; pageNum: number; size: number }> = []

      for (let i = 0; i < targetPages.length; i++) {
        const pageIndex = targetPages[i]
        const pageNum = pageIndex + 1 // 1-based for display

        setProgress({ current: i + 1, total: targetPages.length })
        setStatus(`正在渲染第 ${i + 1}/${targetPages.length} 页…`)

        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale })

        // Create canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) {
          throw new Error('无法创建 Canvas 上下文')
        }

        canvas.height = viewport.height
        canvas.width = viewport.width

        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Canvas 转 Blob 失败'))
              }
            },
            'image/png',
            1.0
          )
        })

        const url = URL.createObjectURL(blob)
        newImageUrls.push({
          url,
          pageNum,
          size: blob.size,
        })
      }

      setImageUrls(newImageUrls)
      setStatus(`渲染完成，共生成 ${newImageUrls.length} 张图片。可以逐个下载。`)
    } catch (error) {
      setStatus('渲染过程中出现错误，请检查文件是否损坏，或减少页数后重试。')
      console.error('Rendering error:', error)
    } finally {
      setIsProcessing(false)
      setProgress(null)
    }
  }

  const handleDownload = (url: string, pageNum: number) => {
    const link = document.createElement('a')
    link.href = url
    link.download = file
      ? `${file.name.replace(/\.pdf$/i, '')}-page-${pageNum}.png`
      : `pdf-page-${pageNum}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
            setPdfjsLoaded(true)
            setStatus('PDF.js 库已加载，可以开始使用。')
          }
        }}
        onReady={() => {
          // Additional check for onReady (handles client-side navigation)
          if (window.pdfjsLib) {
            if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
            }
            setPdfjsLoaded(true)
            setStatus('PDF.js 库已加载，可以开始使用。')
          }
        }}
      />

      <section
        id="tool-action"
        className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-10 py-8 space-y-6 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">PDF 转图片</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Step 1: File Upload */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤一：上传 PDF 文件</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              选择需要转换的 PDF 文件，文件会在浏览器中本地读取，不会上传到服务器。
            </p>
            <div
              ref={dropzoneRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 space-y-3"
            >
              <label
                htmlFor="pdf-to-images-input"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"
              >
                <span className="text-sm font-medium text-slate-900">点击选择或拖拽 PDF 文件</span>
                <span className="text-xs text-slate-500">支持单个 PDF 文件，推荐小于 50MB</span>
              </label>
              <input
                ref={fileInputRef}
                id="pdf-to-images-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <div className="space-y-1 text-xs text-slate-600">
                <div>
                  文件名：
                  <span className="font-medium text-slate-900">{file?.name || '—'}</span>
                </div>
                <div>
                  文件大小：
                  <span className="font-medium text-slate-900">
                    {file ? formatSize(file.size) : '—'}
                  </span>
                </div>
                <div>
                  总页数：
                  <span className="font-medium text-slate-900">{pageCount ?? '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Options */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤二：设置选项</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              选择渲染质量（分辨率倍率）和导出范围（留空则导出全部页面）。
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-900">渲染质量（Scale）</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pdf-to-images-scale"
                      value="1.0"
                      checked={scale === 1.0}
                      onChange={() => setScale(1.0)}
                      className="h-3 w-3"
                    />
                    <span className="text-xs text-slate-700">1.0x · 标准（适合预览）</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pdf-to-images-scale"
                      value="1.5"
                      checked={scale === 1.5}
                      onChange={() => setScale(1.5)}
                      className="h-3 w-3"
                    />
                    <span className="text-xs text-slate-700">1.5x · 推荐（平衡清晰度与体积）</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pdf-to-images-scale"
                      value="2.0"
                      checked={scale === 2.0}
                      onChange={() => setScale(2.0)}
                      className="h-3 w-3"
                    />
                    <span className="text-xs text-slate-700">2.0x · 高清（适合打印）</span>
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="pdf-to-images-range" className="text-xs font-medium text-slate-900">
                  导出范围（可选）
                </label>
                <input
                  id="pdf-to-images-range"
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="例如：1-3,5,8-10（留空则导出全部）"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  支持格式：单页（5）、范围（1-3）、混合（1-3,5,8-10）
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isProcessing || !file || !pageCount || !pdfjsLoaded}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? '渲染中…' : '开始转换'}
              </button>
              {progress && (
                <div className="text-xs text-slate-600">
                  进度：{progress.current}/{progress.total} 页
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Results */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤三：下载图片</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              转换完成后，可以逐个下载 PNG 图片。所有图片均为 PNG 格式。
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
              <div className="text-xs text-slate-700">
                已生成：<span className="font-medium text-slate-900">{imageUrls.length}</span> 张图片
              </div>
              <div id="pdf-to-images-status" className="text-xs text-slate-500 min-h-[2.5rem]">
                {status}
              </div>
              {imageUrls.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {imageUrls.map((item) => (
                    <div
                      key={item.pageNum}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-xs font-medium text-slate-900">
                          第 {item.pageNum} 页
                        </div>
                        <div className="text-[11px] text-slate-500">{formatSize(item.size)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload(item.url, item.pageNum)}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                      >
                        下载
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-4">
          <div className="text-sm font-medium text-slate-900">使用说明</div>
          <div className="mt-1 text-sm text-slate-600 leading-relaxed">
            本工具使用 PDF.js 在浏览器本地渲染 PDF 页面到 Canvas，然后导出为 PNG 图片。所有处理都在本地完成，不会上传文件。对于大文件或高分辨率，渲染可能需要一些时间，请耐心等待。
          </div>
        </div>
      </section>
    </>
  )
}
