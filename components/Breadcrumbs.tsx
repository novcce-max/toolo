// 文件路径: /components/Breadcrumbs.tsx
import Link from 'next/link'

export type BreadcrumbItem = {
  href: string
  label: string
}

export type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

/**
 * 将相对路径转换为绝对 URL（用于 JSON-LD）
 * - 仅依赖常量域名，避免引入配置依赖
 */
export function toAbsoluteUrl(href: string): string {
  const base = 'https://toolo.cn'
  if (!href) return base
  if (href.startsWith('http://') || href.startsWith('https://')) return href
  if (href.startsWith('/')) return `${base}${href}`
  return `${base}/${href}`
}

/**
 * 生成 BreadcrumbList JSON-LD（schema.org）
 */
export function buildBreadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.label,
      item: toAbsoluteUrl(it.href),
    })),
  }
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-600">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={`${it.href}-${idx}`} className="flex items-center gap-1.5">
              {idx !== 0 ? <span className="text-slate-300">/</span> : null}
              {isLast ? (
                <span className="text-slate-700">{it.label}</span>
              ) : (
                <Link
                  href={it.href}
                  className="rounded-md px-1 py-0.5 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  {it.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}