// 文件路径: /components/text/SubtitleMergeSplitTool.tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  mergeSrt,
  parseMultipleSrtText,
  splitSrt,
  type SrtParseError,
} from '@/lib/subtitle/srt'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'

type Mode = 'merge' | 'split'
type MergeSource = 'files' | 'paste'

function sleep(ms: number): Promise<void> {
  return new Promise((r) => window.setTimeout(r, ms))
}

function safeFileBaseName(name: string): string {
  const base = (name || '').replace(/\.[^.]+$/, '')
  return base || 'subtitle'
}

function buildSplitFileName(base: string, partIndex: number): string {
  return `${base}.part-${partIndex}.srt`
}

function humanError(e: unknown): string {
  const err = e as Partial<SrtParseError>
  if (typeof err?.message === 'string') return err.message
  return '处理失败：未知错误'
}

const SAMPLE_SRT = `1
00:00:01,000 --> 00:00:02,200
Hello toolo.

2
00:00:03,000 --> 00:00:04,500
这是第二条字幕。

3
00:00:05,000 --> 00:00:06,200
第三条字幕（示例）。
`

export default function SubtitleMergeSplitTool() {
  const mergeFilesRef = useRef<HTMLInputElement | null>(null)
  const splitFileRef = useRef<HTMLInputElement | null>(null)

  // 统一管理所有 ObjectURL，组件卸载时全部 revoke，避免内存泄漏
  const objectUrlsRef = useRef<Set<string>>(new Set())

  const [mode, setMode] = useState<Mode>('merge')

  // Merge
  const [mergeSource, setMergeSource] = useState<MergeSource>('files')
  const [mergeFiles, setMergeFiles] = useState<File[]>([])
  const [mergePaste, setMergePaste] = useState<string>('')

  const [mergeOutput, setMergeOutput] = useState<string>('')

  // Split
  const [splitInputText, setSplitInputText] = useState<string>('')
  const [splitFileName, setSplitFileName] = useState<string>('')
  const [splitEveryN, setSplitEveryN] = useState<string>('200')
  const [splitParts, setSplitParts] = useState<string[]>([])

  // Shared status
  const [error, setError] = useState<string>('')
  const [info, setInfo] = useState<string>('')

  const splitN = useMemo(() => {
    const n = Number(splitEveryN)
    if (!Number.isFinite(n)) return NaN
    return Math.trunc(n)
  }, [splitEveryN])

  const addObjectUrl = useCallback((url: string) => {
    objectUrlsRef.current.add(url)
  }, [])

  const revokeObjectUrl = useCallback((url: string) => {
    if (!url) return
    try {
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
    objectUrlsRef.current.delete(url)
  }, [])

  const revokeAllObjectUrls = useCallback(() => {
    for (const url of objectUrlsRef.current) {
      try {
        URL.revokeObjectURL(url)
      } catch {
        // ignore
      }
    }
    objectUrlsRef.current.clear()
  }, [])

  useEffect(() => {
    return () => {
      revokeAllObjectUrls()
    }
  }, [revokeAllObjectUrls])

  // 确保 input 元素在组件挂载时正确初始化（解决客户端路由切换后文件上传失效的问题）
  useEffect(() => {
    if (mergeFilesRef.current) {
      mergeFilesRef.current.value = ''
    }
    if (splitFileRef.current) {
      splitFileRef.current.value = ''
    }
  }, [])

  const resetAll = useCallback(() => {
    setError('')
    setInfo('')

    setMergeFiles([])
    setMergePaste('')
    setMergeOutput('')

    setSplitInputText('')
    setSplitFileName('')
    setSplitEveryN('200')
    setSplitParts([])

    revokeAllObjectUrls()

    if (mergeFilesRef.current) mergeFilesRef.current.value = ''
    if (splitFileRef.current) splitFileRef.current.value = ''
  }, [revokeAllObjectUrls])

  const fillSample = useCallback(() => {
    setError('')
    setInfo('已填充示例 SRT，可直接试运行合并/拆分')
    if (mode === 'merge') {
      setMergeSource('paste')
      setMergePaste(SAMPLE_SRT)
      setMergeOutput('')
      setMergeFiles([])
      if (mergeFilesRef.current) mergeFilesRef.current.value = ''
    } else {
      setSplitInputText(SAMPLE_SRT)
      setSplitFileName('')
      setSplitParts([])
      if (splitFileRef.current) splitFileRef.current.value = ''
    }
  }, [mode])

  // ================
  // Merge: 选择文件
  // ================
  const onPickMergeFiles = useCallback(() => {
    mergeFilesRef.current?.click()
  }, [])

  const onMergeFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setInfo('')
    const list = e.target.files
    if (!list || list.length === 0) return

    // 关键：按用户选择顺序合并（FileList 的顺序即选择顺序）
    const files = Array.from(list)

    // 简单校验扩展名
    const bad = files.find((f) => !f.name.toLowerCase().endsWith('.srt'))
    if (bad) {
      setError(`文件格式不支持：${bad.name}（仅支持 .srt）`)
      e.currentTarget.value = ''
      return
    }

    setMergeSource('files')
    setMergeFiles(files)
    setMergeOutput('')
    setInfo(`已选择 ${files.length} 个文件，可点击“开始合并”`)
    e.currentTarget.value = ''
  }, [])

  // =====================
  // Split: 上传单个文件
  // =====================
  const onPickSplitFile = useCallback(() => {
    splitFileRef.current?.click()
  }, [])

  const onSplitFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setInfo('')
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.srt')) {
      setError(`文件格式不支持：${file.name}（仅支持 .srt）`)
      e.currentTarget.value = ''
      return
    }

    try {
      // 关键：本地读取，不上传
      const text = await file.text()
      setSplitInputText(text)
      setSplitFileName(file.name)
      setSplitParts([])
      setInfo('已读取文件，可设置 N 后点击“开始拆分”')
    } catch (err) {
      setError(`读取文件失败：${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      e.currentTarget.value = ''
    }
  }, [])

  // =====================
  // 合并：执行 & 输出
  // =====================
  const runMerge = useCallback(async () => {
    setError('')
    setInfo('')
    setMergeOutput('')
    revokeAllObjectUrls()

    try {
      if (mergeSource === 'files') {
        if (mergeFiles.length === 0) {
          setError('请先选择多个 .srt 文件（可多选）')
          return
        }

        // 逐个读取，避免占用过多内存峰值（虽然文件通常不大，但仍保持克制）
        const texts: string[] = []
        for (let i = 0; i < mergeFiles.length; i++) {
          const f = mergeFiles[i]
          const t = await f.text()
          texts.push(t)
        }

        const out = mergeSrt(texts)
        setMergeOutput(out)
        setInfo(`合并完成：已合并 ${mergeFiles.length} 个文件`)
        return
      }

      // mergeSource === 'paste'
      const raw = mergePaste || ''
      if (raw.trim().length === 0) {
        setError('请粘贴 SRT 内容后再合并（多段请用一行 “-----” 分隔）')
        return
      }

      const segments = parseMultipleSrtText(raw)
      if (segments.length === 0) {
        setError('未识别到有效的 SRT 段落：请检查分隔符 “-----” 或内容格式')
        return
      }

      const out = mergeSrt(segments)
      setMergeOutput(out)
      setInfo(`合并完成：已合并 ${segments.length} 段`)
    } catch (e) {
      setError(humanError(e))
    }
  }, [mergeFiles, mergePaste, mergeSource, revokeAllObjectUrls])

  const copyMerge = useCallback(async () => {
    setError('')
    setInfo('')
    if (!mergeOutput) {
      setError('暂无合并结果可复制，请先合并生成结果')
      return
    }
    try {
      await navigator.clipboard.writeText(mergeOutput)
      setInfo('已复制到剪贴板')
    } catch {
      setError('复制失败：浏览器不支持剪贴板权限')
    }
  }, [mergeOutput])

  const downloadMerge = useCallback(() => {
    setError('')
    setInfo('')
    if (!mergeOutput) {
      setError('暂无合并结果可下载，请先合并生成结果')
      return
    }

    // 关键：使用 ObjectURL 下载，并在合适时机 revoke；同时记录到集合，卸载时兜底清理
    const blob = new Blob([mergeOutput], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    addObjectUrl(url)

    const a = document.createElement('a')
    a.href = url
    a.download = 'merged.srt'
    a.click()

    // 给浏览器一点时间完成下载，再释放 URL
    window.setTimeout(() => revokeObjectUrl(url), 1500)
  }, [addObjectUrl, mergeOutput, revokeObjectUrl])

  // =====================
  // 拆分：执行 & 下载
  // =====================
  const runSplit = useCallback(() => {
    setError('')
    setInfo('')
    setSplitParts([])
    revokeAllObjectUrls()

    const raw = splitInputText || ''
    if (raw.trim().length === 0) {
      setError('请输入或上传 SRT 内容后再拆分')
      return
    }
    if (!Number.isFinite(splitN) || splitN < 1) {
      setError('拆分参数 N 必须为整数且 >= 1')
      return
    }

    try {
      const parts = splitSrt(raw, splitN)
      setSplitParts(parts)
      setInfo(`拆分完成：共 ${parts.length} 个分段（每段最多 ${splitN} 条字幕）`)
    } catch (e) {
      setError(humanError(e))
    }
  }, [revokeAllObjectUrls, splitInputText, splitN])

  const downloadSplitPart = useCallback(
    (partText: string, partIndex: number) => {
      setError('')
      setInfo('')

      const base = splitFileName ? safeFileBaseName(splitFileName) : 'subtitle'
      const blob = new Blob([partText], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      addObjectUrl(url)

      const a = document.createElement('a')
      a.href = url
      a.download = buildSplitFileName(base, partIndex)
      a.click()

      window.setTimeout(() => revokeObjectUrl(url), 1500)
    },
    [addObjectUrl, revokeObjectUrl, splitFileName],
  )

  const downloadAllSplit = useCallback(async () => {
    setError('')
    setInfo('')

    if (splitParts.length === 0) {
      setError('暂无拆分结果可下载，请先拆分生成结果')
      return
    }

    // 关键：逐个触发下载，并做短延迟节流，减少浏览器拦截概率
    for (let i = 0; i < splitParts.length; i++) {
      downloadSplitPart(splitParts[i], i + 1)
      await sleep(220)
    }

    setInfo(`已触发下载：${splitParts.length} 个分段（逐个触发）`)
  }, [downloadSplitPart, splitParts])

  // =============
  // UI 渲染
  // =============
  return (
    <div className="space-y-4">
      <Card variant="glass" className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">工具模式</div>
              <div className="mt-1 text-xs text-slate-600">合并多个 SRT，或按每 N 条字幕拆分下载（全程本地处理）。</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-44">
                <Select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                  <option value="merge">合并（Merge）</option>
                  <option value="split">拆分（Split）</option>
                </Select>
              </div>

              <Button variant="secondary" onClick={fillSample}>
                填充示例
              </Button>
              <Button variant="secondary" onClick={resetAll}>
                重置
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          {mode === 'merge' ? (
            <div className="space-y-4">
              <details className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm" open={false}>
                <summary className="cursor-pointer select-none px-6 py-4 text-sm font-semibold text-slate-900">
                  合并参数与输入方式
                  <span className="ml-2 text-xs font-medium text-slate-500">（默认收起）</span>
                </summary>

                <div className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-xs font-medium text-slate-700">输入方式</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={mergeSource === 'files' ? 'primary' : 'secondary'}
                          onClick={() => setMergeSource('files')}
                        >
                          上传多个文件
                        </Button>
                        <Button
                          size="sm"
                          variant={mergeSource === 'paste' ? 'primary' : 'secondary'}
                          onClick={() => setMergeSource('paste')}
                        >
                          粘贴多段（----- 分隔）
                        </Button>
                      </div>

                      <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                        多段粘贴：用一行 “-----” 分隔不同片段（每段必须是完整 SRT）。
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-xs font-medium text-slate-700">操作</div>
                      <div className="mt-2 flex flex-col sm:flex-row gap-2">
                        <Button variant="primary" onClick={runMerge}>
                          开始合并
                        </Button>
                        <Button variant="secondary" onClick={copyMerge}>
                          一键复制
                        </Button>
                        <Button variant="secondary" onClick={downloadMerge}>
                          下载 merged.srt
                        </Button>
                      </div>
                    </div>
                  </div>

                  {mergeSource === 'files' ? (
                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">选择多个 .srt 文件</div>
                          <div className="mt-1 text-xs text-slate-600">按选择顺序合并（多选）。</div>
                        </div>
                        <div className="flex gap-3">
                          <input
                            ref={mergeFilesRef}
                            type="file"
                            accept=".srt"
                            multiple
                            onChange={onMergeFilesChange}
                            className="hidden"
                          />
                          <Button variant="secondary" onClick={onPickMergeFiles}>
                            选择文件
                          </Button>
                          <Button variant="primary" onClick={runMerge}>
                            开始合并
                          </Button>
                        </div>
                      </div>

                      {mergeFiles.length > 0 ? (
                        <div className="mt-4 text-sm text-slate-600">
                          已选择 {mergeFiles.length} 个文件：
                          <ul className="mt-2 space-y-1 text-xs">
                            {mergeFiles.map((f, idx) => (
                              <li key={`${f.name}-${idx}`} className="truncate">
                                {idx + 1}. {f.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 space-y-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">粘贴多段 SRT</div>
                        <div className="mt-1 text-xs text-slate-600">
                          用一行 “-----” 分隔不同片段（每段为完整 SRT 块）。
                        </div>
                      </div>

                      <textarea
                        value={mergePaste}
                        onChange={(e) => setMergePaste(e.target.value)}
                        placeholder={`示例：\n(第一段 SRT)\n-----\n(第二段 SRT)\n`}
                        className="min-h-[220px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                      />

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="primary" onClick={runMerge}>
                          开始合并
                        </Button>
                        <Button variant="secondary" onClick={copyMerge}>
                          一键复制
                        </Button>
                        <Button variant="secondary" onClick={downloadMerge}>
                          下载 merged.srt
                        </Button>
                      </div>

                      <div className="text-xs text-slate-600">
                        已识别段数：{parseMultipleSrtText(mergePaste || '').length}
                      </div>
                    </div>
                  )}
                </div>
              </details>

              <Card variant="solid" className="overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">合并结果预览</div>
                      <div className="mt-1 text-xs text-slate-600">合并后可复制或下载（本地）。</div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="secondary" onClick={copyMerge}>
                        一键复制
                      </Button>
                      <Button variant="secondary" onClick={downloadMerge}>
                        下载 merged.srt
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <textarea
                    value={mergeOutput}
                    readOnly
                    placeholder="合并结果会显示在这里..."
                    className="min-h-[220px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <details className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm" open={false}>
                <summary className="cursor-pointer select-none px-6 py-4 text-sm font-semibold text-slate-900">
                  拆分参数
                  <span className="ml-2 text-xs font-medium text-slate-500">（默认收起）</span>
                </summary>

                <div className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-xs font-medium text-slate-700">每 N 条字幕拆分</div>
                      <div className="mt-2 flex items-center gap-3">
                        <Input
                          value={splitEveryN}
                          onChange={(e) => setSplitEveryN(e.target.value)}
                          inputMode="numeric"
                          placeholder="默认 200"
                        />
                        <div className="text-xs text-slate-600 shrink-0">最小 1</div>
                      </div>
                      <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                        例如 N=200：每 200 条字幕输出一个 Part（最后一段可能不足 N 条）。
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-xs font-medium text-slate-700">操作</div>
                      <div className="mt-2 flex flex-col sm:flex-row gap-2">
                        <Button variant="primary" onClick={runSplit}>
                          开始拆分
                        </Button>
                        <Button variant="secondary" onClick={downloadAllSplit}>
                          下载全部（逐个触发）
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </details>

              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">输入 SRT（用于拆分）</div>
                      <div className="mt-1 text-xs text-slate-600">支持粘贴文本或上传单个 .srt（本地读取）。</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        ref={splitFileRef}
                        type="file"
                        accept=".srt"
                        onChange={onSplitFileChange}
                        className="hidden"
                      />
                      <Button variant="secondary" onClick={onPickSplitFile}>
                        上传 .srt
                      </Button>
                      <Button variant="primary" onClick={runSplit}>
                        开始拆分
                      </Button>
                    </div>
                  </div>

                  {splitFileName ? (
                    <div className="mt-3 text-xs text-slate-600">
                      已加载文件：<span className="font-medium text-slate-900">{splitFileName}</span>
                    </div>
                  ) : null}
                </div>

                <div className="px-6 py-4">
                  <textarea
                    value={splitInputText}
                    onChange={(e) => setSplitInputText(e.target.value)}
                    placeholder="在此粘贴 SRT 内容..."
                    className="min-h-[220px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  />
                </div>
              </div>

              <Card variant="solid" className="overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">拆分结果</div>
                      <div className="mt-1 text-xs text-slate-600">
                        生成后会出现多个下载按钮；也可“下载全部（逐个触发）”。
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="secondary" onClick={downloadAllSplit}>
                        下载全部（逐个触发）
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  {splitParts.length === 0 ? (
                    <div className="text-sm text-slate-600">暂无拆分结果</div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-xs text-slate-600">
                        共 {splitParts.length} 个分段（每段最多 {Number.isFinite(splitN) ? splitN : '?'} 条）
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {splitParts.map((txt, idx) => (
                          <Button
                            key={idx}
                            variant="secondary"
                            onClick={() => downloadSplitPart(txt, idx + 1)}
                          >
                            下载 Part {idx + 1}
                          </Button>
                        ))}
                      </div>

                      {/* 轻量预览：仅展示第一段前若干行，避免页面过长 */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-medium text-slate-700">预览（Part 1 片段）</div>
                        <pre className="mt-2 max-h-[200px] overflow-auto text-xs text-slate-700 whitespace-pre-wrap">
                          {splitParts[0]}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
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
    </div>
  )
}