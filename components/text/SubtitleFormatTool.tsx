// 文件路径: /components/text/SubtitleFormatTool.tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cleanSrt, type SrtCleanResult, type SrtParseError } from '@/lib/subtitle/srt'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

function fileNameToOut(name: string): string {
  const base = name.replace(/\.[^.]+$/, '') || 'subtitle'
  return `${base}.cleaned.srt`
}

export default function SubtitleFormatTool() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const outputUrlRef = useRef<string | null>(null)

  const [inputText, setInputText] = useState<string>('')
  const [inputFileName, setInputFileName] = useState<string>('')

  const [result, setResult] = useState<SrtCleanResult | null>(null)
  const [error, setError] = useState<string>('')
  const [info, setInfo] = useState<string>('')

  const outputText = useMemo(() => result?.output ?? '', [result])

  const revokeOutputUrl = useCallback(() => {
    const url = outputUrlRef.current
    if (url) {
      try {
        URL.revokeObjectURL(url)
      } catch {
        // ignore
      }
      outputUrlRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => revokeOutputUrl()
  }, [revokeOutputUrl])

  // 确保 input 元素在组件挂载时正确初始化（解决客户端路由切换后文件上传失效的问题）
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const resetAll = useCallback(() => {
    setInputText('')
    setInputFileName('')
    setResult(null)
    setError('')
    setInfo('')
    revokeOutputUrl()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [revokeOutputUrl])

  const onPickFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setInfo('')
    const file = e.target.files?.[0]
    if (!file) return

    const name = file.name || ''
    if (!name.toLowerCase().endsWith('.srt')) {
      setError('仅支持上传 .srt 文件')
      e.currentTarget.value = ''
      return
    }

    try {
      // 关键：本地读取 file.text()，不上传
      const text = await file.text()
      setInputText(text)
      setInputFileName(name)
      setResult(null)
      revokeOutputUrl()
      setInfo('已读取文件，可点击“清洗并生成结果”')
    } catch (err) {
      const msg = err instanceof Error ? err.message : '读取文件失败'
      setError(`读取文件失败：${msg}`)
    } finally {
      e.currentTarget.value = ''
    }
  }, [revokeOutputUrl])

  const runClean = useCallback(() => {
    setError('')
    setInfo('')
    revokeOutputUrl()

    if (!inputText || inputText.trim().length === 0) {
      setError('请输入或上传 SRT 内容后再清洗')
      setResult(null)
      return
    }

    try {
      const cleaned = cleanSrt(inputText)
      setResult(cleaned)
      setInfo(`清洗完成：共 ${cleaned.cues.length} 条字幕，已规范编号、时间行与空行结构`)
    } catch (err) {
      const e = err as Partial<SrtParseError>
      const message = typeof e?.message === 'string' ? e.message : 'SRT 解析失败：未知错误'
      setError(message)
      setResult(null)
    }
  }, [inputText, revokeOutputUrl])

  const copyOutput = useCallback(async () => {
    setError('')
    setInfo('')
    if (!outputText) {
      setError('暂无结果可复制，请先清洗生成结果')
      return
    }
    try {
      await navigator.clipboard.writeText(outputText)
      setInfo('已复制到剪贴板')
    } catch {
      setError('复制失败：浏览器不支持剪贴板权限')
    }
  }, [outputText])

  const downloadOutput = useCallback(() => {
    setError('')
    setInfo('')
    if (!outputText) {
      setError('暂无结果可下载，请先清洗生成结果')
      return
    }

    revokeOutputUrl()

    // 关键：使用 ObjectURL 并在合适时机 revoke，避免内存泄漏
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    outputUrlRef.current = url

    const a = document.createElement('a')
    a.href = url
    a.download = inputFileName ? fileNameToOut(inputFileName) : 'subtitle.cleaned.srt'
    a.click()

    window.setTimeout(() => revokeOutputUrl(), 1500)
  }, [inputFileName, outputText, revokeOutputUrl])

  return (
    <div className="space-y-4">
      <Card variant="glass" className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">输入 SRT</div>
              <div className="mt-1 text-xs text-slate-600">
                支持粘贴文本或上传 .srt（本地读取）。解析失败会给出尽量明确的块号/行号提示。
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input ref={fileInputRef} type="file" accept=".srt" onChange={onFileChange} className="hidden" />
              <Button variant="secondary" onClick={onPickFile}>
                上传 .srt
              </Button>
              <Button variant="primary" onClick={runClean}>
                清洗并生成结果
              </Button>
            </div>
          </div>

          {inputFileName ? (
            <div className="mt-3 text-xs text-slate-600">
              已加载文件：<span className="font-medium text-slate-900">{inputFileName}</span>
            </div>
          ) : null}
        </div>

        <div className="px-6 py-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="在此粘贴 SRT 内容..."
            className="min-h-[220px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          />
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <Button variant="primary" onClick={runClean}>
              清洗并生成结果
            </Button>
            <Button variant="secondary" onClick={resetAll}>
              重置
            </Button>
          </div>
        </div>
      </Card>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {info ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
          {info}
        </div>
      ) : null}

      <Card variant="solid" className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">清洗结果预览</div>
              <div className="mt-1 text-xs text-slate-600">可复制或下载清洗后的 .srt（本地）。</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" onClick={copyOutput}>
                一键复制
              </Button>
              <Button variant="secondary" onClick={downloadOutput}>
                下载 .srt
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <textarea
            value={outputText}
            readOnly
            placeholder="清洗结果会显示在这里..."
            className="min-h-[220px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </Card>
    </div>
  )
}