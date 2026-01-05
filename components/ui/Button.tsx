// 文件路径: /components/ui/Button.tsx
import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'sm' | 'md'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

function cn(...v: Array<string | false | null | undefined>): string {
  return v.filter(Boolean).join(' ')
}

export function Button({ variant = 'secondary', size = 'md', className, type, ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-medium transition-colors ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-40 disabled:pointer-events-none'

  const sizeCls = size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-sm'

  const variantCls =
    variant === 'primary'
      ? 'bg-slate-900 text-white hover:bg-slate-800'
      : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50'

  return (
    <button
      type={type ?? 'button'}
      className={cn(base, sizeCls, variantCls, className)}
      {...props}
    />
  )
}