// 文件路径: /components/text/SubtitleShiftTool.tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { parseSrt, serializeSrt, shiftCues, type SrtCue, type SrtParseError } from '@/lib/subtitle/srt'

type Unit = 'ms' | 's'

function toOffsetMs(value: number, unit: Unit): number {
  if (!Number.isFinite(value)) return 0
  return unit === 'ms' ? Math.trunc(value) : Math.trunc(value * 1000)
}

function fileNameToOut(name: string): string {
  const base = name.replace(/\.[^.]+$/, '') || 'subtitle'
  return `${base}.shifted.srt`
}

export default function SubtitleShiftTool() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const outputUrlRef = useRef<string | null>(null)

  const [inputText, setInputText] = useState<string>('')
  const [inputFileName, setInputFileName] = useState<string>('')

  const [unit, setUnit] = useState<Unit>('ms')
  const [offsetValue, setOffsetValue] = useState<string>('0')

  const [resultText, setResultText] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [info, setInfo] = useState<string>('')

  const offsetMs = useMemo(() => {
    const n = Number(offsetValue)
    if (!Number.isFinite(n)) return 0
    return toOffsetMs(n, unit)
  }, [offsetValue, unit])

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

  // 确保 input 元素在组件挂载时正确初始化（解决客户端路由切换后文件上传失效的问题）
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // 关键：组件卸载时清理下载 URL，避免内存泄漏
  useEffect(() => {
    return () => {
      revokeOutputUrl()
    }
  }, [revokeOutputUrl])

  const resetAll = useCallback(() => {
    setInputText('')
    setInputFileName('')
    setUnit('ms')
    setOffsetValue('0')
    setResultText('')
    setError('')
    setInfo('')
    revokeOutputUrl()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [revokeOutputUrl])

  const clearOutputOnly = useCallback(() => {
    setResultText('')
    setError('')
    setInfo('')
    revokeOutputUrl()
  }, [revokeOutputUrl])

  const onPickFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setInfo('')
    const file = e.target.files?.[0]
    if (!file) return

    // 仅接受 .srt 文件（仍会在解析阶段做严格校验）
    const name = file.name || ''
    if (!name.toLowerCase().endsWith('.srt')) {
      setError('仅支持上传 .srt 文件')
      return
    }

    try {
      // 关键：本地读取，不上传；BOM/换行在解析函数中处理
      const text = await file.text()
      setInputText(text)
      setInputFileName(name)
      setResultText('')
      revokeOutputUrl()
    } catch (err) {
      const msg = err instanceof Error ? err.message : '读取文件失败'
      setError(`读取文件失败：${msg}`)
    } finally {
      // 允许重复选择同一文件
      e.currentTarget.value = ''
    }
  }, [revokeOutputUrl])

  const applyPreset = useCallback((preset: 'm500' | 'p500' | 'm1s' | 'p1s') => {
    setError('')
    setInfo('')
    // 预设按钮：-500ms、+500ms、-1s、+1s
    if (preset === 'm500') {
      setUnit('ms')
      setOffsetValue('-500')
      return
    }
    if (preset === 'p500') {
      setUnit('ms')
      setOffsetValue('500')
      return
    }
    if (preset === 'm1s') {
      setUnit('s')
      setOffsetValue('-1')
      return
    }
    setUnit('s')
    setOffsetValue('1')
  }, [])

  const generate = useCallback(() => {
    setError('')
    setInfo('')
    revokeOutputUrl()

    const raw = inputText
    if (!raw || raw.trim().length === 0) {
      setError('请输入或上传 SRT 内容后再生成结果')
      setResultText('')
      return
    }

    try {
      const parsed = parseSrt(raw)
      const shifted: SrtCue[] = shiftCues(parsed.cues, offsetMs)
      const out = serializeSrt(shifted)

      setResultText(out)

      const human = `${offsetMs >= 0 ? '+' : ''}${offsetMs}ms`
      setInfo(`已生成：共 ${shifted.length} 条字幕，整体偏移 ${human}（负数时间已按 0 处理）`)
    } catch (err) {
      const e = err as Partial<SrtParseError>
      const message = typeof e?.message === 'string' ? e.message : 'SRT 解析失败：未知错误'
      setError(message)
      setResultText('')
    }
  }, [inputText, offsetMs, revokeOutputUrl])

  const copyResult = useCallback(async () => {
    setError('')
    setInfo('')
    if (!resultText) {
      setError('暂无结果可复制，请先生成结果')
      return
    }

    try {
      await navigator.clipboard.writeText(resultText)
      setInfo('已复制到剪贴板')
    } catch {
      // 降级：使用 selection + execCommand
      try {
        const ta = document.createElement('textarea')
        ta.value = resultText
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        ta.style.top = '-9999px'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        setInfo('已复制到剪贴板')
      } catch {
        setError('复制失败：浏览器不支持剪贴板权限')
      }
    }
  }, [resultText])

  const downloadResult = useCallback(() => {
    setError('')
    setInfo('')
    if (!resultText) {
      setError('暂无结果可下载，请先生成结果')
      return
    }

    // 关键：每次下载前释放旧 URL，避免泄漏
    revokeOutputUrl()

    const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    outputUrlRef.current = url

    const a = document.createElement('a')
    a.href = url
    a.download = inputFileName ? fileNameToOut(inputFileName) : 'subtitle.shifted.srt'
    a.click()

    // 关键：延迟 revoke，避免部分浏览器下载中断
    window.setTimeout(() => revokeOutputUrl(), 1500)
  }, [inputFileName, resultText, revokeOutputUrl])

  return (
    <div className="space-y-4">
      {/* 参数区（可折叠，默认折叠） */}
      <details className="rounded-2xl border border-slate-200 bg-white" open={false}>
        <summary className="cursor-pointer select-none px-5 py-4 text-sm font-semibold text-slate-900">
          偏移参数
          <span className="ml-2 text-xs font-medium text-slate-500">（可正可负 · 单位可切换）</span>
        </summary>

        <div className="px-5 pb-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-medium text-slate-700">偏移量</div>
              <div className="mt-2 flex items-center gap-3">
                <input
                  value={offsetValue}
                  onChange={(e) => setOffsetValue(e.target.value)}
                  placeholder="例如：-500 或 1200"
                  inputMode="decimal"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as Unit)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="ms">ms</option>
                  <option value="s">s</option>
                </select>
              </div>
              <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                负数表示整体前移，正数表示整体后移。偏移后若出现负时间，将按 0 处理。
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-medium text-slate-700">快捷预设</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('m500')}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  -500ms
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('p500')}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  +500ms
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('m1s')}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  -1s
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('p1s')}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  +1s
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                预设会自动切换单位（ms/s），便于直观调整。
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={generate}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              生成结果
            </button>

            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              重置（清空输入/输出/参数）
            </button>

            <button
              type="button"
              onClick={clearOutputOnly}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              仅清空输出
            </button>
          </div>
        </div>
      </details>

      {/* 输入区：粘贴 + 上传 */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">输入 SRT</div>
              <div className="mt-1 text-xs text-slate-600">
                支持粘贴文本或上传 .srt 文件（仅本地处理，不上传）。
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".srt"
                onChange={onFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={onPickFile}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                上传 .srt
              </button>
              <button
                type="button"
                onClick={generate}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                生成结果
              </button>
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
            placeholder="在此粘贴 SRT 内容（包含序号、时间行与正文）..."
            className="min-h-[220px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
      </div>

      {/* 状态提示 */}
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

      {/* 输出区 */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">结果预览</div>
              <div className="mt-1 text-xs text-slate-600">
                生成的 SRT 将保持标准格式：序号、时间行、正文、空行分隔。
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={copyResult}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                一键复制
              </button>
              <button
                type="button"
                onClick={downloadResult}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                下载 .srt
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <textarea
            value={resultText}
            readOnly
            placeholder="生成结果会显示在这里..."
            className="min-h-[220px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="text-xs text-slate-600 leading-relaxed">
        提示：本工具完全在浏览器本地处理。偏移后若时间变为负数，会自动按 0 处理；你可修改参数后重复生成。
      </div>
    </div>
  )
}