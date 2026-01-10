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

/**
 * 将 Uint8Array 或 Uint8ClampedArray 转换为 ArrayBuffer（处理 byteOffset 和 byteLength）
 * - 解决 TS 对 BlobPart / ArrayBufferLike 的兼容性报错（SharedArrayBuffer 场景）
 * - 显式创建新的 ArrayBuffer 并复制数据，确保类型与运行时都稳定
 * - 统一用于 PDF、GIF 等工具组件的 Blob 创建
 */
export function u8ToArrayBuffer(u8: Uint8Array | Uint8ClampedArray): ArrayBuffer {
  const ab = new ArrayBuffer(u8.byteLength)
  new Uint8Array(ab).set(new Uint8Array(u8.buffer, u8.byteOffset, u8.byteLength))
  return ab
}