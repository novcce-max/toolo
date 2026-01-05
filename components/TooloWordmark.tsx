// 文件路径: /components/TooloWordmark.tsx
import type { SVGProps } from 'react'

type Props = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  /**
   * 整体高度（px）
   * - Header(h-14) 推荐 22~28
   */
  sizePx?: number
  /**
   * 彩色点尺寸（px）
   * - 不传则按 sizePx 自适应
   */
  dotPx?: number
  /**
   * 彩色点间距（px）
   * - 不传则按 sizePx 自适应
   */
  dotGapPx?: number
}

/**
 * Toolo 品牌字标（点阵 + Wordmark）
 * 关键修复：
 * - dotPx / dotGapPx 从 props 中解构出来，不透传到 <svg>，避免 React DOM 警告与 hydration mismatch
 */
export default function TooloWordmark({
  sizePx = 24,
  dotPx,
  dotGapPx,
  ...svgProps
}: Props) {
  const h = Number.isFinite(sizePx) && sizePx > 0 ? sizePx : 24

  // 点阵：可控（不传则自适应）
  const d =
    Number.isFinite(dotPx as number) && (dotPx as number) > 0
      ? (dotPx as number)
      : Math.max(3, Math.round(h * 0.26))

  const g =
    Number.isFinite(dotGapPx as number) && (dotGapPx as number) >= 0
      ? (dotGapPx as number)
      : Math.max(2, Math.round(h * 0.10))

  const gridW = d * 2 + g
  const gridH = d * 2 + g

  const gridX = 0
  const gridY = Math.round((h - gridH) / 2) - 1 // 光学上移 1px

  // 点阵到字标间距（更紧凑）
  const gap = Math.round(h * 0.30)
  const x = gridW + gap

  // 字标：更轻、更协调（避免“发黑”）
  const fontSize = Math.round(h * 0.96)
  const baseline = Math.round(h * 0.76)

  // 估算宽度：纯数学、确定性，保证 SSR/CSR 一致
  const wordW = Math.round(fontSize * 3.7)
  const viewW = x + wordW + 2
  const viewH = h

  return (
    <svg
      width={Math.round(viewW)}
      height={Math.round(viewH)}
      viewBox={`0 0 ${Math.round(viewW)} ${Math.round(viewH)}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Toolo"
      {...svgProps}
    >
      <title>Toolo</title>

      {/* 4 色点阵（保留） */}
      <rect x={gridX} y={gridY} width={d} height={d} rx={Math.round(d * 0.5)} fill="#0EA5E9" />
      <rect
        x={gridX + d + g}
        y={gridY}
        width={d}
        height={d}
        rx={Math.round(d * 0.5)}
        fill="#10B981"
      />
      <rect
        x={gridX}
        y={gridY + d + g}
        width={d}
        height={d}
        rx={Math.round(d * 0.5)}
        fill="#F59E0B"
      />
      <rect
        x={gridX + d + g}
        y={gridY + d + g}
        width={d}
        height={d}
        rx={Math.round(d * 0.5)}
        fill="#F43F5E"
      />

      {/* Wordmark：Toolo（T 大写，其它小写） */}
      <text
        x={x}
        y={baseline}
        fill="currentColor"
        fontSize={fontSize}
        fontFamily={`Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, "Segoe UI", Roboto, Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`}
        letterSpacing="-0.02em"
        textRendering="geometricPrecision"
        style={{ userSelect: 'none' }}
      >
        <tspan fontWeight={600}>T</tspan>
        <tspan fontWeight={500}>oolo</tspan>
      </text>
    </svg>
  )
}