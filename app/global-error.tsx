// 文件路径: /app/global-error.tsx
'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 全局兜底：仅控制台记录，避免干扰用户；不上传、不请求外网
    // eslint-disable-next-line no-console
    console.error('[toolo] global error:', error)
  }, [error])

  const digest = typeof error?.digest === 'string' ? error.digest : null

  const onGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
      return
    }
    window.location.href = '/'
  }

  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-10 space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                系统暂时不可用
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                我们遇到一个全局级别的问题。你可以先刷新或重试。通常这类问题是暂时性的。
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

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5">
              <div className="text-sm font-semibold text-slate-900">说明</div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                toolo.cn 默认本地处理你的文件与文本；此页面不上传内容。若你希望了解隐私与本地处理机制，请查看隐私说明。
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
      </body>
    </html>
  )
}