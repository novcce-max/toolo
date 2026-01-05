// 文件路径: /components/ui/SectionHeader.tsx
import * as React from 'react'

export type SectionHeaderProps = {
  title: React.ReactNode
  description?: React.ReactNode
  right?: React.ReactNode
  className?: string
}

function cn(...v: Array<string | false | null | undefined>): string {
  return v.filter(Boolean).join(' ')
}

/**
 * SectionHeader（最小 UI 组件）
 * - 用于区块标题：左侧 title/description，右侧说明或动作
 * - 不强制 H1/H2，外部控制语义结构
 */
export function SectionHeader({ title, description, right, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        <div className="text-lg font-semibold text-slate-900">{title}</div>
        {description ? (
          <div className="mt-1 text-sm text-slate-600 leading-relaxed max-w-3xl">{description}</div>
        ) : null}
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}