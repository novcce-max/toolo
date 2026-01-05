// 文件路径: /components/ToolLayout.tsx
import type { ReactNode } from 'react'
import Breadcrumbs, { type BreadcrumbItem, buildBreadcrumbListJsonLd } from '@/components/Breadcrumbs'

export type ToolLayoutProps = {
  title: string
  description?: string
  /**
   * 右侧信息栏（保持现有 side 布局能力不变）
   */
  side?: ReactNode
  /**
   * 可选面包屑：若传入则在 H1 上方渲染，并注入 BreadcrumbList JSON-LD
   */
  breadcrumbs?: Array<BreadcrumbItem>
  children: ReactNode
}

/**
 * 工具页统一布局
 * - 约束：H1 由 ToolLayout 输出（SEO）
 * - side 布局保持：桌面两栏，移动端单列
 * - 仅增强：可选 breadcrumbs + JSON-LD，不影响工具页现有 SoftwareApplication JSON-LD
 */
export default function ToolLayout({
  title,
  description,
  side,
  breadcrumbs,
  children,
}: ToolLayoutProps) {
  // 自动补齐“首页”面包屑（若未提供），避免各页重复写
  const normalizedBreadcrumbs: BreadcrumbItem[] | null = (() => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null
    const hasHome = breadcrumbs[0]?.href === '/' || breadcrumbs[0]?.href === 'https://toolo.cn/'
    if (hasHome) return breadcrumbs
    return [{ href: '/', label: '首页' }, ...breadcrumbs]
  })()

  const breadcrumbJsonLd = normalizedBreadcrumbs
    ? buildBreadcrumbListJsonLd(normalizedBreadcrumbs)
    : null

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-6">
          <header className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-3">
            {/* 面包屑（可选） */}
            {normalizedBreadcrumbs ? <Breadcrumbs items={normalizedBreadcrumbs} /> : null}

            {/* H1 必须由 ToolLayout 输出，确保每个工具页都有清晰 H1 */}
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>

            {description ? (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{description}</p>
            ) : null}
          </header>

          {/* BreadcrumbList JSON-LD：仅在传入 breadcrumbs 时注入 */}
          {breadcrumbJsonLd ? (
            <script
              type="application/ld+json"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
          ) : null}

          <div className="space-y-6">{children}</div>
        </div>

        {/* side 布局保持：有 side 才渲染右栏 */}
        {side ? <aside className="lg:col-span-4">{side}</aside> : null}
      </div>
    </div>
  )
}