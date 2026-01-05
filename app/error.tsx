// 文件路径: /app/error.tsx
'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 关键：仅做控制台记录，避免影响用户体验；不上传、不请求外网
    // eslint-disable-next-line no-console
    console.error('[toolo] route error:', error)
  }, [error])

  const digest = typeof error?.digest === 'string' ? error.digest : null

  const onGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
      return
    }
    // 若没有历史记录，退回首页更稳
    window.location.href = '/'
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-10 space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            页面遇到一点问题
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            这通常是一次性的小故障。你可以先尝试刷新或重试。如果问题持续，建议回到首页从分类入口重新进入。
          </p>
          {digest ? (
            <p className="text-xs text-slate-500">
              参考标识：<span className="font-mono">{digest}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            重试
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            刷新页面
          </button>

          <button
            type="button"
            onClick={onGoBack}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            返回上一级
          </button>

          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            返回首页
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5">
            <div className="text-sm font-semibold text-slate-900">你可以尝试</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>点击“重试”重新渲染当前页面。</li>
              <li>点击“刷新页面”重新加载资源。</li>
              <li>返回上一级或回到首页，从分类入口重新进入工具页。</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5">
            <div className="text-sm font-semibold text-slate-900">隐私说明</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              toolo.cn 默认仅在浏览器本地处理文件与文本；本错误页不会上传你的内容。
            </p>
            <div className="mt-3">
              <Link
                href="/privacy"
                className="text-sm text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                查看隐私说明
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}