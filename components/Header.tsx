// 文件路径: /components/Header.tsx
import Link from 'next/link'
import TooloWordmark from '@/components/TooloWordmark'
import NavLink from '@/components/NavLink'

type NavItem = {
  href: string
  label: string
}

export default function Header() {
  const navItems: NavItem[] = [
    { href: '/image', label: '图片' },
    { href: '/gif', label: 'GIF' },
    { href: '/pdf', label: 'PDF 工具' },
    { href: '/text', label: '字幕文本' },
    { href: '/privacy', label: '隐私' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/30">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-slate-100/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 transition-colors"
            aria-label="toolo.cn 首页"
          >
            <TooloWordmark className="text-slate-900" sizePx={28} />
          </Link>

          {/* 移动端允许横向滚动，避免拥挤；不改整体风格 */}
          <nav
            className="max-w-[70%] sm:max-w-none overflow-x-auto [-webkit-overflow-scrolling:touch]"
            aria-label="主导航"
          >
            <ul className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap py-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} label={item.label} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}