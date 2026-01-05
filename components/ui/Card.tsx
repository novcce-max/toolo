// 文件路径: /components/ui/Card.tsx
import * as React from 'react'

type CardVariant = 'solid' | 'glass'

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
}

function cn(...v: Array<string | false | null | undefined>): string {
  return v.filter(Boolean).join(' ')
}

/**
 * Card（最小 UI 组件）
 * - variants: solid / glass
 * - 提供 Header / Body / Footer 子组件，便于统一布局
 */
export function Card({ className, variant = 'solid', ...props }: CardProps) {
  const base = 'rounded-3xl border border-slate-200'
  const variants: Record<CardVariant, string> = {
    solid: 'bg-white',
    glass: 'bg-white/75 backdrop-blur-sm',
  }

  return <div className={cn(base, variants[variant], className)} {...props} />
}

export type CardSectionProps = React.HTMLAttributes<HTMLDivElement>

export function CardHeader({ className, ...props }: CardSectionProps) {
  return <div className={cn('px-6 sm:px-10 py-6', className)} {...props} />
}

export function CardBody({ className, ...props }: CardSectionProps) {
  return <div className={cn('px-6 sm:px-10 py-6', className)} {...props} />
}

export function CardFooter({ className, ...props }: CardSectionProps) {
  return <div className={cn('px-6 sm:px-10 py-6', className)} {...props} />
}