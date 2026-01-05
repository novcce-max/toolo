// 文件路径: /components/ui/Input.tsx
import * as React from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean
}

function cn(...v: Array<string | false | null | undefined>): string {
  return v.filter(Boolean).join(' ')
}

/**
 * Input（最小 UI 组件）
 * - 统一高度/圆角/边框/focus ring
 * - 支持 error 状态
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error = false, disabled, ...props },
  ref,
) {
  const base =
    'h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 ' +
    'placeholder:text-slate-400 transition-colors ' +
    'focus:outline-none focus-visible:ring-2 ' +
    'disabled:opacity-40 disabled:pointer-events-none'

  const normal = 'border-slate-200 focus-visible:ring-slate-300'
  const err = 'border-red-300 focus-visible:ring-red-200'

  return (
    <input
      ref={ref}
      disabled={disabled}
      className={cn(base, error ? err : normal, className)}
      {...props}
    />
  )
})