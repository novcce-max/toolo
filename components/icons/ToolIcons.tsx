// 文件路径: /components/icons/ToolIcons.tsx
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ')
}

/**
 * 统一图标库（稳定导出 + 兼容旧命名）
 * - 全部使用 currentColor，颜色交给父级（ToolCard/tone）控制
 * - 默认尺寸 h-6 w-6（可被 className 覆盖）
 * - 同时导出旧命名 ToolIcon*，避免历史 import 报错
 */

/** 图片 */
export function IconImage({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M6 5.5h12A2.5 2.5 0 0 1 20.5 8v8A2.5 2.5 0 0 1 18 18.5H6A2.5 2.5 0 0 1 3.5 16V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M6 5.5h12A2.5 2.5 0 0 1 20.5 8v8A2.5 2.5 0 0 1 18 18.5H6A2.5 2.5 0 0 1 3.5 16V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8.25 10a1.25 1.25 0 1 0 0.001 0Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M5.75 16l4.2-4.2a1.5 1.5 0 0 1 2.1 0l2.2 2.2 1.1-1.1a1.5 1.5 0 0 1 2.1 0L20.5 14.95"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 压缩（压缩箭头 + 框） */
export function IconCompress({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M7 6.5h10A2.5 2.5 0 0 1 19.5 9v6A2.5 2.5 0 0 1 17 17.5H7A2.5 2.5 0 0 1 4.5 15V9A2.5 2.5 0 0 1 7 6.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M7 6.5h10A2.5 2.5 0 0 1 19.5 9v6A2.5 2.5 0 0 1 17 17.5H7A2.5 2.5 0 0 1 4.5 15V9A2.5 2.5 0 0 1 7 6.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 10.25l3 3 3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13.25v-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 19.5h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  )
}

/** 转换（双向箭头 + 方框） */
export function IconConvert({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M7 7.5h10A2.5 2.5 0 0 1 19.5 10v4A2.5 2.5 0 0 1 17 16.5H7A2.5 2.5 0 0 1 4.5 14v-4A2.5 2.5 0 0 1 7 7.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M7 7.5h10A2.5 2.5 0 0 1 19.5 10v4A2.5 2.5 0 0 1 17 16.5H7A2.5 2.5 0 0 1 4.5 14v-4A2.5 2.5 0 0 1 7 7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 11h7.5l-1.6-1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 13h-7.5l1.6 1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** GIF（文件 + G 弧） */
export function IconGif({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M7 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 15 21H7A2.5 2.5 0 0 1 4.5 18.5V8A2.5 2.5 0 0 1 7 5.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M7 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 15 21H7A2.5 2.5 0 0 1 4.5 18.5V8A2.5 2.5 0 0 1 7 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 5.5v3h3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 12.25h7M8 15.25h5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.25 12.25c.9.7 1.25 1.7 1.25 2.75 0 2.15-1.6 3.75-3.75 3.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 视频转 GIF（视频框 + 播放 + 侧镜头） */
export function IconVideoToGif({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M5.5 7.5h9.5a2.5 2.5 0 0 1 2.5 2.5v6A2.5 2.5 0 0 1 15 18.5H5.5A2.5 2.5 0 0 1 3 16V10A2.5 2.5 0 0 1 5.5 7.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M5.5 7.5h9.5a2.5 2.5 0 0 1 2.5 2.5v6A2.5 2.5 0 0 1 15 18.5H5.5A2.5 2.5 0 0 1 3 16V10A2.5 2.5 0 0 1 5.5 7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M11 11.2l3 1.8-3 1.8v-3.6Z" fill="currentColor" opacity="0.9" />
      <path
        d="M19.25 9.5l1.75-1v9l-1.75-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M7.25 6.25c.9-.9 2.15-1.25 3.75-1.25 2.9 0 4.6 1.25 5.35 3.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 字幕（对话条 + 时间线点） */
export function IconSubtitle({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M6 7.5h12A2.5 2.5 0 0 1 20.5 10v5A2.5 2.5 0 0 1 18 17.5H10.5L7 20v-2.5H6A2.5 2.5 0 0 1 3.5 15v-5A2.5 2.5 0 0 1 6 7.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M6 7.5h12A2.5 2.5 0 0 1 20.5 10v5A2.5 2.5 0 0 1 18 17.5H10.5L7 20v-2.5H6A2.5 2.5 0 0 1 3.5 15v-5A2.5 2.5 0 0 1 6 7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 11.2h9M7.5 14.1h6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M16.8 14.1h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** 文本（行文本） */
export function IconText({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M7 6.5h10A2.5 2.5 0 0 1 19.5 9v6A2.5 2.5 0 0 1 17 17.5H7A2.5 2.5 0 0 1 4.5 15V9A2.5 2.5 0 0 1 7 6.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M7 6.5h10A2.5 2.5 0 0 1 19.5 9v6A2.5 2.5 0 0 1 17 17.5H7A2.5 2.5 0 0 1 4.5 15V9A2.5 2.5 0 0 1 7 6.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 10.5h8.5M7.75 13.25h6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** PDF 主图标（分类入口）- 彩色 */
export function IconPdf({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M6 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 14 21H6A2.5 2.5 0 0 1 3.5 18.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="#DC2626"
        opacity="0.15"
      />
      <path
        d="M6 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 14 21H6A2.5 2.5 0 0 1 3.5 18.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5.5v3h3"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10h5M7.5 13h4M7.5 16h5.5"
        fill="none"
        stroke="#DC2626"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** PDF 压缩 - 彩色（压缩箭头 + PDF文档） */
export function IconPdfCompress({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M6 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 14 21H6A2.5 2.5 0 0 1 3.5 18.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="#DC2626"
        opacity="0.12"
      />
      <path
        d="M6 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 14 21H6A2.5 2.5 0 0 1 3.5 18.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5.5v3h3"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 10.5l2.5 2.5 2.5-2.5"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13V9"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7.5 11h5M7.5 14h4"
        fill="none"
        stroke="#DC2626"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}

/** PDF 合并 - 彩色（多个文档合并） */
export function IconPdfMerge({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M4 6.5h7.5l3 3V18.5A2.5 2.5 0 0 1 12 21H4A2.5 2.5 0 0 1 1.5 18.5V9A2.5 2.5 0 0 1 4 6.5Z"
        fill="#10B981"
        opacity="0.15"
      />
      <path
        d="M4 6.5h7.5l3 3V18.5A2.5 2.5 0 0 1 12 21H4A2.5 2.5 0 0 1 1.5 18.5V9A2.5 2.5 0 0 1 4 6.5Z"
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 6.5v3h3"
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10h4M6.5 13h3.5"
        fill="none"
        stroke="#10B981"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M8 4.5h7.5l3 3V16.5A2.5 2.5 0 0 1 16 19H8A2.5 2.5 0 0 1 5.5 16.5V7A2.5 2.5 0 0 1 8 4.5Z"
        fill="#3B82F6"
        opacity="0.15"
      />
      <path
        d="M8 4.5h7.5l3 3V16.5A2.5 2.5 0 0 1 16 19H8A2.5 2.5 0 0 1 5.5 16.5V7A2.5 2.5 0 0 1 8 4.5Z"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 4.5v3h3"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 8h4M10.5 11h3.5"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M12 12.5l2.5-2.5 2.5 2.5"
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** PDF 拆分 - 彩色（文档拆分） */
export function IconPdfSplit({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M6 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 14 21H6A2.5 2.5 0 0 1 3.5 18.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="#DC2626"
        opacity="0.12"
      />
      <path
        d="M6 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 14 21H6A2.5 2.5 0 0 1 3.5 18.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5.5v3h3"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10h5M7.5 13h4M7.5 16h5.5"
        fill="none"
        stroke="#DC2626"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M12 12.5v-4"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 10.5l2-2 2 2"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14.5l2 2 2-2"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** 图片转 PDF - 彩色（图片 + PDF） */
export function IconPdfImagesToPdf({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M5 7.5C5 6.119 6.119 5 7.5 5h6C14.881 5 16 6.119 16 7.5v6c0 1.381-1.119 2.5-2.5 2.5h-6C6.119 16 5 14.881 5 13.5v-6z"
        fill="#0EA5E9"
        opacity="0.15"
      />
      <path
        d="M5 7.5C5 6.119 6.119 5 7.5 5h6C14.881 5 16 6.119 16 7.5v6c0 1.381-1.119 2.5-2.5 2.5h-6C6.119 16 5 14.881 5 13.5v-6z"
        fill="none"
        stroke="#0EA5E9"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7.25 9.5a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5z"
        fill="#0EA5E9"
        opacity="0.6"
      />
      <path
        d="M5.5 14.5l3-3c.4-.4 1.05-.4 1.45 0l1.25 1.25c.4.4 1.05.4 1.45 0l1.55-1.55c.4-.4 1.05-.4 1.45 0L16.5 12"
        fill="none"
        stroke="#0EA5E9"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M8 18.5h7.5l3 3V18.5A2.5 2.5 0 0 0 16 16H8A2.5 2.5 0 0 0 5.5 18.5v3A2.5 2.5 0 0 0 8 24h8A2.5 2.5 0 0 0 18.5 21.5V18.5"
        fill="#DC2626"
        opacity="0.12"
      />
      <path
        d="M8 18.5h7.5l3 3V18.5A2.5 2.5 0 0 0 16 16H8A2.5 2.5 0 0 0 5.5 18.5v3A2.5 2.5 0 0 0 8 24h8A2.5 2.5 0 0 0 18.5 21.5V18.5"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 18.5v3h3"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 22h5M9.5 19.5h4"
        fill="none"
        stroke="#DC2626"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M14 16.5l2 2 2-2"
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** PDF 转图片 - 彩色（PDF + 图片） */
export function IconPdfToImages({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M6 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 14 21H6A2.5 2.5 0 0 1 3.5 18.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="#DC2626"
        opacity="0.12"
      />
      <path
        d="M6 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 14 21H6A2.5 2.5 0 0 1 3.5 18.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5.5v3h3"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10h5M7.5 13h4M7.5 16h5.5"
        fill="none"
        stroke="#DC2626"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M16 8.5l2-2 2 2"
        fill="none"
        stroke="#0EA5E9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 6.5v4"
        fill="none"
        stroke="#0EA5E9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 12.5C17 11.67 17.67 11 18.5 11s1.5.67 1.5 1.5"
        fill="#0EA5E9"
        opacity="0.3"
      />
      <path
        d="M17 12.5C17 11.67 17.67 11 18.5 11s1.5.67 1.5 1.5"
        fill="none"
        stroke="#0EA5E9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15.5 15.5l3-3c.4-.4 1.05-.4 1.45 0l1.25 1.25c.4.4 1.05.4 1.45 0L22.5 13"
        fill="none"
        stroke="#0EA5E9"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** PDF 旋转 - 彩色（PDF + 旋转箭头） */
export function IconPdfRotate({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('h-6 w-6', className)} {...props}>
      <path
        d="M6 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 14 21H6A2.5 2.5 0 0 1 3.5 18.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="#DC2626"
        opacity="0.12"
      />
      <path
        d="M6 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 14 21H6A2.5 2.5 0 0 1 3.5 18.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5.5v3h3"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10h5M7.5 13h4M7.5 16h5.5"
        fill="none"
        stroke="#DC2626"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M18.5 8.5c1.1 0 2 .9 2 2s-.9 2-2 2"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 6.5l2-2 2 2"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 12.5l2 2 2-2"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** 兼容旧导出命名（历史页面可能还在用） */
export const ToolIconImage = IconImage
export const ToolIconCompress = IconCompress
export const ToolIconConvert = IconConvert
export const IconVideo = IconVideoToGif