// 文件路径: /components/ui/Select.tsx
import * as React from 'react'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean
}

function cn(...v: Array<string | false | null | undefined>): string {
  return v.filter(Boolean).join(' ')
}

/**
 * Select（最小 UI 组件）
 * - 统一高度/圆角/边框/focus ring
 * - 支持 error 状态
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, error = false, disabled, children, ...props },
  ref,
) {
  const base =
    'h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 ' +
    'transition-colors focus:outline-none focus-visible:ring-2 ' +
    'disabled:opacity-40 disabled:pointer-events-none'

  const normal = 'border-slate-200 focus-visible:ring-slate-300'
  const err = 'border-red-300 focus-visible:ring-red-200'

  return (
    <select
      ref={ref}
      disabled={disabled}
      className={cn(base, error ? err : normal, className)}
      {...props}
    >
      {children}
    </select>
  )
})