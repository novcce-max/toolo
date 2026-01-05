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

/** 兼容旧导出命名（历史页面可能还在用） */
export const ToolIconImage = IconImage
export const ToolIconCompress = IconCompress
export const ToolIconConvert = IconConvert
export const IconVideo = IconVideoToGif