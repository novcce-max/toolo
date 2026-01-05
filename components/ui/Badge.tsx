// 文件路径: /components/ui/Badge.tsx
import * as React from 'react'

type BadgeVariant = 'muted' | 'accent' | 'success' | 'warning'

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

function cn(...v: Array<string | false | null | undefined>): string {
  return v.filter(Boolean).join(' ')
}

/**
 * Badge（最小 UI 组件）
 * - 小而清晰
 * - 仅浅色系
 */
export function Badge({ className, variant = 'muted', ...props }: BadgeProps) {
  const base = 'inline-flex items-center rounded-xl border px-2.5 py-1 text-xs font-medium'

  const variants: Record<BadgeVariant, string> = {
    muted: 'border-slate-200 bg-slate-50 text-slate-700',
    accent: 'border-slate-200 bg-white text-slate-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
  }

  return <span className={cn(base, variants[variant], className)} {...props} />
}