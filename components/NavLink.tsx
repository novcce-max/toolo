// 文件路径: /components/NavLink.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavLinkProps = {
  href: string
  label: string
}

/**
 * 顶部导航链接（仅用于高亮当前分类）
 * - 交互属于“轻交互”，因此单独作为 Client Component，避免 Header 全量客户端化
 */
export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname()

  // 关键：分类页需要对子路由高亮（例如 /image/compress 仍高亮 /image）
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={[
        'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-slate-300',
        isActive
          ? 'bg-slate-100/80 text-slate-900'
          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50',
      ].join(' ')}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}