// 文件路径: /app/layout.tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://toolo.cn'),
  title: {
    template: '%s - toolo.cn',
    default: 'toolo.cn',
  },
  description:
    'toolo.cn 在线工具站：默认纯浏览器本地处理，无登录、无后端队列；聚焦图片、GIF、字幕文本等常用效率工具。',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn',
    siteName: 'toolo.cn',
    title: 'toolo.cn',
    description:
      'toolo.cn 在线工具站：默认纯浏览器本地处理，无登录、无后端队列；聚焦图片、GIF、字幕文本等常用效率工具。',
    images: [
      {
        url: '/og.svg',
        width: 1200,
        height: 630,
        alt: 'Toolo - 本地处理在线工具',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  /**
   * 全站结构化数据：只注入一次（稳定优先）
   * 关键修复：
   * - 不使用数组作为 JSON-LD 根节点（避免部分解析器直接 r["@context"] 取值时报 undefined）
   * - 用 @graph 承载多个实体，根节点始终有 @context
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'toolo.cn',
        url: 'https://toolo.cn',
      },
      {
        '@type': 'WebSite',
        name: 'toolo.cn',
        url: 'https://toolo.cn',
      },
    ],
  }

  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="min-h-screen flex flex-col">
          <Header />

          {/* 全站内容基线：统一横向边距与最大宽度，避免页面贴边 */}
          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          <Footer />
        </div>
      </body>
    </html>
  )
}