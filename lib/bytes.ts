// 文件路径: /lib/bytes.ts
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const
  const k = 1024
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), units.length - 1)
  const val = bytes / Math.pow(k, i)
  const fixed = val >= 100 ? 0 : val >= 10 ? 1 : 2
  return `${val.toFixed(fixed)} ${units[i]}`
}

/**
 * 将比例格式化为百分比字符串
 * - ratio = 0.62 => "62%"
 * - ratio = 1.0  => "100%"
 */
export function formatPercent(ratio: number): string {
  if (!Number.isFinite(ratio)) return '-'
  return `${Math.round(ratio * 100)}%`
}