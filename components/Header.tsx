// 文件路径: /components/Header.tsx
import Link from 'next/link'
import TooloWordmark from '@/components/TooloWordmark'

type NavItem = {
  href: string
  label: string
}

export default function Header() {
  const navItems: NavItem[] = [
    { href: '/image', label: '图片' },
    { href: '/gif', label: 'GIF' },
    { href: '/text', label: '字幕文本' },
    { href: '/privacy', label: '隐私' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-slate-100/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            aria-label="toolo.cn 首页"
          >
            <TooloWordmark className="text-slate-900" sizePx={28} dotPx={6} dotGapPx={2} />
          </Link>

          {/* 移动端允许横向滚动，避免拥挤；不改整体风格 */}
          <nav
            className="max-w-[70%] sm:max-w-none overflow-x-auto [-webkit-overflow-scrolling:touch]"
            aria-label="主导航"
          >
            <ul className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap py-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center rounded-full px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}