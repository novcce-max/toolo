// 文件路径: /components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white/70">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs text-slate-600">© {new Date().getFullYear()} toolo.cn</div>
            <p className="text-xs text-slate-500">
              聚焦图片 / GIF / 字幕文本等常用效率小工具，默认本地处理，尽量少收集数据。
            </p>
          </div>

          <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>默认本地处理：数据优先在浏览器内完成处理（一期无登录、无后端队列）</span>
            <Link
              href="/privacy"
              className="inline-flex items-center rounded-md px-1.5 py-0.5 text-xs text-slate-600 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              隐私
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}