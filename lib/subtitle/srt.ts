// 文件路径: /lib/subtitle/srt.ts
/**
 * SRT 解析/序列化/偏移/清洗（一期稳定优先）
 * - 支持 UTF-8 BOM
 * - 支持 Windows 换行（\r\n/\r -> \n）
 * - 时间行兼容 “,” 和 “.” 毫秒分隔
 * - 输出统一使用 “,”
 * - 解析失败提供尽量明确的块号/行号信息
 */

export type SrtCue = {
  /** 输入序号（可能不连续）；输出会重排为 1..n */
  index: number
  startMs: number
  endMs: number
  /** 正文（使用 \n 分隔多行） */
  text: string
  /** 时间行末尾附加信息（可选） */
  timeExtra?: string
}

export type SrtDocument = {
  cues: SrtCue[]
}

export type SrtParseError = Error & {
  name: 'SrtParseError'
  code:
    | 'EMPTY'
    | 'INVALID_BLOCK'
    | 'INVALID_INDEX'
    | 'INVALID_TIME_LINE'
    | 'INVALID_TIME_FORMAT'
    | 'INVALID_RANGE'
  blockIndex?: number
  lineIndex?: number
}

export type SrtCleanResult = {
  output: string
  cues: SrtCue[]
}

function makeParseError(
  message: string,
  code: SrtParseError['code'],
  blockIndex?: number,
  lineIndex?: number,
): SrtParseError {
  const err = new Error(message) as SrtParseError
  err.name = 'SrtParseError'
  err.code = code
  err.blockIndex = blockIndex
  err.lineIndex = lineIndex
  return err
}

export function stripBom(text: string): string {
  if (!text) return text
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

/** 兼容旧名称（若有历史引用） */
export const stripUtf8Bom = stripBom

export function normalizeNewlines(text: string): string {
  return (text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

type ParsedTimeLine = { startMs: number; endMs: number; extra?: string }

/**
 * 时间行：
 * - 允许逗号或点：00:00:01,000 或 00:00:01.000
 * - 箭头允许 "-->"（兼容少量输入写法）
 * - 支持尾随 extra（例如定位参数）
 */
const TIME_RE =
  /^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})(.*)?$/

export function parseTimeLine(line: string, blockIndex?: number): ParsedTimeLine {
  const m = (line || '').match(TIME_RE)
  if (!m) {
    throw makeParseError(
      '时间行格式不正确（示例：00:00:01,000 --> 00:00:02,000）',
      'INVALID_TIME_LINE',
      blockIndex,
      2,
    )
  }

  const h1 = Number(m[1])
  const m1 = Number(m[2])
  const s1 = Number(m[3])
  const ms1 = Number(m[4])

  const h2 = Number(m[5])
  const m2 = Number(m[6])
  const s2 = Number(m[7])
  const ms2 = Number(m[8])

  if (
    [h1, m1, s1, ms1, h2, m2, s2, ms2].some((x) => !Number.isFinite(x)) ||
    m1 > 59 ||
    s1 > 59 ||
    ms1 > 999 ||
    m2 > 59 ||
    s2 > 59 ||
    ms2 > 999
  ) {
    throw makeParseError(
      '时间格式非法（小时/分钟/秒/毫秒范围错误）',
      'INVALID_TIME_FORMAT',
      blockIndex,
      2,
    )
  }

  const startMs = (((h1 * 60 + m1) * 60 + s1) * 1000 + ms1) | 0
  const endMs = (((h2 * 60 + m2) * 60 + s2) * 1000 + ms2) | 0

  if (endMs < startMs) {
    throw makeParseError('时间范围非法：结束时间小于开始时间', 'INVALID_RANGE', blockIndex, 2)
  }

  const extraRaw = (m[9] ?? '').trim()
  return { startMs, endMs, extra: extraRaw.length > 0 ? extraRaw : undefined }
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}
function pad3(n: number): string {
  return String(n).padStart(3, '0')
}

export function formatTime(ms: number): string {
  const safe = Math.max(0, Math.trunc(ms))
  const milli = safe % 1000
  const totalSec = Math.floor(safe / 1000)
  const sec = totalSec % 60
  const totalMin = Math.floor(totalSec / 60)
  const min = totalMin % 60
  const hour = Math.floor(totalMin / 60)
  // 输出统一使用 “,”
  return `${pad2(hour)}:${pad2(min)}:${pad2(sec)},${pad3(milli)}`
}

export function parseSrt(input: string): SrtDocument {
  const raw = normalizeNewlines(stripBom(input || ''))
  const text = raw.trim()

  if (!text) throw makeParseError('输入为空：请粘贴或上传 SRT 内容', 'EMPTY')

  // 块之间允许多个空行，按 2 个及以上 \n 切块
  const blocks = text
    .split(/\n{2,}/g)
    .map((b) => b.trim())
    .filter(Boolean)

  const cues: SrtCue[] = []

  for (let bi = 0; bi < blocks.length; bi++) {
    const block = blocks[bi]
    const lines = block.split('\n')

    if (lines.length < 2) {
      throw makeParseError('字幕块不完整：至少需要“序号 + 时间行”', 'INVALID_BLOCK', bi + 1)
    }

    const indexLine = (lines[0] ?? '').trim()
    const index = Number(indexLine)
    if (!Number.isFinite(index) || !/^\d+$/.test(indexLine)) {
      throw makeParseError('序号行不是有效数字', 'INVALID_INDEX', bi + 1, 1)
    }

    const timeLine = (lines[1] ?? '').trim()
    const parsedTime = parseTimeLine(timeLine, bi + 1)

    const bodyLines = lines.slice(2)

    // 正文：不强制删除内部空行，但需要保证行尾空白被清理（一期稳定优先）
    const body = bodyLines.map((l) => (l ?? '').replace(/\s+$/g, '')).join('\n')

    cues.push({
      index,
      startMs: parsedTime.startMs,
      endMs: parsedTime.endMs,
      text: body,
      timeExtra: parsedTime.extra,
    })
  }

  return { cues }
}

export function serializeSrt(cues: readonly SrtCue[]): string {
  const out: string[] = []

  for (let i = 0; i < cues.length; i++) {
    const c = cues[i]
    const idx = i + 1

    out.push(String(idx))
    const extra = c.timeExtra ? ` ${c.timeExtra}` : ''
    out.push(`${formatTime(c.startMs)} --> ${formatTime(c.endMs)}${extra}`)

    if (c.text && c.text.length > 0) {
      // 保持多行结构
      out.push(...normalizeNewlines(c.text).split('\n'))
    } else {
      out.push('')
    }

    // 块间空行
    out.push('')
  }

  // 关键：块之间单个空行；末尾保留换行更通用
  return out.join('\n').trimEnd() + '\n'
}

/**
 * 整体偏移字幕 cues（毫秒）
 * - 偏移后时间不得为负：按 0 处理
 */
export function shiftCues(cues: readonly SrtCue[], offsetMs: number): SrtCue[] {
  const delta = Number.isFinite(offsetMs) ? Math.trunc(offsetMs) : 0

  return cues.map((c) => {
    const start = Math.max(0, c.startMs + delta)
    const end = Math.max(0, c.endMs + delta)
    const safeEnd = Math.max(end, start)

    return { ...c, startMs: start, endMs: safeEnd }
  })
}

/**
 * 清洗 SRT（一期稳定优先）
 * - 去 BOM、统一换行
 * - 过滤多余空行：输出块之间单个空行（由 serializeSrt 保证）
 * - 重排编号为 1..n（由 serializeSrt 保证）
 * - 时间行兼容 “,”/“.”，输出统一 “,”（由 parseTimeLine + formatTime 保证）
 * - 正文行 trim 末尾空格；可选合并连续空白行（正文内部不强制删除，仅合并连续空白行）
 */
export function cleanSrt(input: string): SrtCleanResult {
  const doc = parseSrt(input)

  const cleanedCues: SrtCue[] = doc.cues.map((c) => {
    const lines = normalizeNewlines(c.text || '').split('\n')

    // 合并连续空白行（正文内部不强制删除，只是把多余连续空行压成 1 个）
    const merged: string[] = []
    let prevEmpty = false
    for (const rawLine of lines) {
      const line = (rawLine ?? '').replace(/\s+$/g, '')
      const isEmpty = line.trim().length === 0
      if (isEmpty) {
        if (prevEmpty) continue
        merged.push('')
        prevEmpty = true
        continue
      }
      merged.push(line)
      prevEmpty = false
    }

    // 保持整体结构但去掉正文尾部多余空行
    while (merged.length > 0 && merged[merged.length - 1] === '') merged.pop()

    return { ...c, text: merged.join('\n') }
  })

  const output = serializeSrt(cleanedCues)
  return { output, cues: cleanedCues }
}

/* =========================================================
 * 新增能力：SRT 合并 / 拆分（保持向后兼容，不破坏既有导出）
 * ========================================================= */

/**
 * 解析“粘贴多段 SRT 文本”的辅助函数
 * - 用分隔符行 “-----” 分隔不同片段
 * - 允许分隔符行前后存在空格
 * - 返回每段原始 SRT 文本（trim 后），供后续 mergeSrt 调用 parseSrt
 */
export function parseMultipleSrtText(input: string): string[] {
  const raw = normalizeNewlines(stripBom(input || ''))
  if (raw.trim().length === 0) return []

  const lines = raw.split('\n')
  const segments: string[] = []
  let buf: string[] = []

  const flush = () => {
    const txt = buf.join('\n').trim()
    if (txt.length > 0) segments.push(txt)
    buf = []
  }

  for (const line of lines) {
    if ((line ?? '').trim() === '-----') {
      flush()
      continue
    }
    buf.push(line)
  }
  flush()

  return segments
}

/**
 * 合并多个 SRT：
 * - 对每段调用 parseSrt，提取 cues 并拼接
 * - 最终 serializeSrt 输出（编号自动重排，块间空行稳定）
 * - 若某段解析失败，尽量保留原错误信息，并附加“第 X 段”前缀
 */
export function mergeSrt(segments: readonly string[]): string {
  const merged: SrtCue[] = []

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    try {
      const doc = parseSrt(seg)
      merged.push(...doc.cues)
    } catch (e) {
      const err = e as Partial<SrtParseError>
      const msg = typeof err?.message === 'string' ? err.message : 'SRT 解析失败：未知错误'

      // 关键：在不丢失块号/行号信息的前提下，提示段号，便于定位问题
      const wrapped = makeParseError(`第 ${i + 1} 段：${msg}`, (err.code as any) ?? 'INVALID_BLOCK', err.blockIndex, err.lineIndex)
      throw wrapped
    }
  }

  return serializeSrt(merged)
}

/**
 * 拆分 SRT（按每 N 条字幕）
 * - 输入为单个 SRT 文本
 * - 解析后按 N 分块，每块 serializeSrt 输出
 * - N 最小为 1
 */
export function splitSrt(input: string, everyN: number): string[] {
  const n = Math.max(1, Math.trunc(everyN || 0))
  const doc = parseSrt(input)
  const cues = doc.cues
  const parts: string[] = []

  for (let i = 0; i < cues.length; i += n) {
    const chunk = cues.slice(i, i + n)
    parts.push(serializeSrt(chunk))
  }

  // 若 cues 为空，也返回空数组（由上层决定如何提示）
  return parts
}