// 文件路径: /app/not-found.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '页面未找到 - toolo.cn',
  description: '该页面不存在或已被移动。你可以返回首页或从分类入口继续使用工具。',
  alternates: {
    canonical: '/404',
  },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/404',
    title: '页面未找到 - toolo.cn',
    description: '该页面不存在或已被移动。返回首页或从分类入口继续使用工具。',
    siteName: 'toolo.cn',
  },
}

export default function NotFound() {
  return (
    <div className="py-10 sm:py-14">
      <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-10">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            页面未找到
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            你访问的链接可能已失效、被移动，或地址拼写有误。你可以从下面的入口继续。
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            回到首页
          </Link>
          <Link
            href="/image"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            图片工具
          </Link>
          <Link
            href="/text"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            字幕文本
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            隐私说明
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-6 py-5">
            <div className="text-sm font-semibold text-slate-900">可能原因</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>链接地址拼写错误或缺少路径段。</li>
              <li>页面已调整到新路径（后续会逐步补齐重定向）。</li>
              <li>浏览器缓存了旧链接。</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-6 py-5">
            <div className="text-sm font-semibold text-slate-900">建议</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>从首页或分类页进入，确保路径最新。</li>
              <li>若是工具页，先确认分类入口是否有更新。</li>
              <li>需要了解本地处理与隐私机制，查看隐私说明。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}