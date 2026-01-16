import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import ToolCard from '@/components/ToolCard'
import DomToolFilter from '@/components/site/DomToolFilter'

export const metadata: Metadata = {
  title: '在线 GIF 压缩、视频转 GIF（本地处理不上传）- toolo.cn',
  description:
    '在线 GIF 工具合集：GIF 压缩（缩放/抽帧/降色）与视频转 GIF（截取时间/FPS/宽度）。默认浏览器本地处理不上传、无需登录；短时长与帧数限制确保稳定导出。',
  alternates: { canonical: 'https://toolo.cn/gif' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/gif',
    title: '在线 GIF 压缩、视频转 GIF（本地处理不上传）- toolo.cn',
    description:
      'GIF 压缩与视频转 GIF：缩放/抽帧/降色、截取时间/FPS/宽度。默认本地处理不上传、无需登录；稳定优先。',
    siteName: 'toolo.cn',
  },
}

type Tone = 'emerald' | 'violet' | 'blue' | 'slate' | 'amber' | 'rose'
type ToolItem = {
  title: string
  description: string
  href: string
  badge?: string
  tone?: Tone
  icon?: ReactElement
}

function IconGif(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        d="M7 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 15 21H7A2.5 2.5 0 0 1 4.5 18.5V8A2.5 2.5 0 0 1 7 5.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M7 5.5h7.5l3 3V18.5A2.5 2.5 0 0 1 15 21H7A2.5 2.5 0 0 1 4.5 18.5V8A2.5 2.5 0 0 1 7 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 5.5v3h3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 12.25h7M8 15.25h5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.25 12.25c.9.7 1.25 1.7 1.25 2.75 0 2.15-1.6 3.75-3.75 3.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconVideoToGif(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        d="M5.5 7.5h9.5a2.5 2.5 0 0 1 2.5 2.5v6A2.5 2.5 0 0 1 15 18.5H5.5A2.5 2.5 0 0 1 3 16V10A2.5 2.5 0 0 1 5.5 7.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M5.5 7.5h9.5a2.5 2.5 0 0 1 2.5 2.5v6A2.5 2.5 0 0 1 15 18.5H5.5A2.5 2.5 0 0 1 3 16V10A2.5 2.5 0 0 1 5.5 7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M11 11.2l3 1.8-3 1.8v-3.6Z" fill="currentColor" opacity="0.9" />
      <path
        d="M19.25 9.5l1.75-1v9l-1.75-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M7.25 6.25c.9-.9 2.15-1.25 3.75-1.25 2.9 0 4.6 1.25 5.35 3.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function GifHubPage() {
  // 单对象 JSON-LD（根节点必须包含 @context，不能用数组根节点）
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '在线 GIF 压缩、视频转 GIF - toolo.cn（本地处理不上传）',
    url: 'https://toolo.cn/gif',
    description:
      '在线 GIF 工具合集：GIF 压缩（缩放/抽帧/降色）与视频转 GIF（截取时间/FPS/宽度）。默认浏览器本地处理不上传、无需登录；短时长与帧数限制确保稳定导出。',
    isPartOf: {
      '@type': 'WebSite',
      name: 'toolo.cn',
      url: 'https://toolo.cn/',
    },
    about: [
      { '@type': 'Thing', name: '在线 GIF 压缩' },
      { '@type': 'Thing', name: 'GIF 压缩' },
      { '@type': 'Thing', name: '视频转 GIF' },
      { '@type': 'Thing', name: '抽帧' },
      { '@type': 'Thing', name: '降色' },
      { '@type': 'Thing', name: 'FPS' },
    ],
    hasPart: [
      {
        '@type': 'SoftwareApplication',
        name: '在线 GIF 压缩（本地处理）',
        operatingSystem: 'Web',
        applicationCategory: 'MultimediaApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        url: 'https://toolo.cn/gif/compress',
      },
      {
        '@type': 'SoftwareApplication',
        name: '在线视频转 GIF（本地处理）',
        operatingSystem: 'Web',
        applicationCategory: 'MultimediaApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        url: 'https://toolo.cn/gif/video-to-gif',
      },
    ],
  }

  const tools: ToolItem[] = [
    {
      title: 'GIF 压缩',
      description: '缩放 / 抽帧 / 降色三旋钮，本地处理；适合快速减小体积并下载。',
      href: '/gif/compress',
      badge: '可用',
      tone: 'violet',
      icon: <IconGif />,
    },
    {
      title: '视频转 GIF',
      description: '截取时间范围 + FPS + 最大宽度，本地生成 GIF（一期：短时长/帧数上限，稳定优先）。',
      href: '/gif/video-to-gif',
      badge: '可用',
      tone: 'violet',
      icon: <IconVideoToGif />,
    },
  ]

  return (
    <div className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-8">
        {/* Hero：尽量“像介绍”，不要长得像功能卡，避免误认 */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-10 space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              GIF 工具
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              在线 GIF 压缩与视频转 GIF。默认纯浏览器本地处理不上传、无需登录；适合社交平台动图与教程 GIF：先压缩体积，再按需截取与导出。
            </p>
          </div>

          {/* 特性用“标签条”呈现：更像说明，不像工具入口 */}
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-sm text-slate-700">本地处理（默认不上传）</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-sm text-slate-700">缩放 / 抽帧 / 降色</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-sm text-slate-700">稳定优先（短时长限制）</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/gif/compress"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              立即开始
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              了解隐私
            </Link>
            <p className="text-xs text-slate-500">
              提示：视频转 GIF 会根据设备性能做时长/帧数限制，以保证大多数设备稳定可用。
            </p>
          </div>
        </section>

        {/* 热门工具直达 */}
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">热门工具</h2>
            <div className="text-sm text-slate-600">一键直达</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t) => (
              <ToolCard
                key={t.href}
                href={t.href}
                title={t.title}
                description={t.description}
                badge={t.badge}
                tone={t.tone}
                icon={t.icon}
              />
            ))}
          </div>
        </section>

        {/* 站内搜索（本地过滤） */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">站内搜索</h2>
            <p className="text-sm text-slate-600">按名称或描述筛选（仅本地过滤）。</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 space-y-4">
            <label htmlFor="site-search-gif" className="sr-only">
              搜索 GIF 工具
            </label>
            <input
              id="site-search-gif"
              type="search"
              inputMode="search"
              placeholder="搜索：GIF 压缩 / 视频转 GIF / FPS / 抽帧 / 降色…"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />

            <p id="site-search-empty-gif" className="hidden text-sm text-slate-600">
              没有匹配的工具。你可以尝试换个关键词。
            </p>

            <div id="site-search-list-gif" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((t) => (
                <div
                  key={`search-${t.href}`}
                  className="tool-item"
                  data-title={t.title}
                  data-description={t.description}
                >
                  <ToolCard
                    href={t.href}
                    title={t.title}
                    description={t.description}
                    badge={t.badge}
                    tone={t.tone}
                    icon={t.icon}
                  />
                </div>
              ))}
            </div>
          </div>

          <DomToolFilter
            inputId="site-search-gif"
            listId="site-search-list-gif"
            emptyId="site-search-empty-gif"
          />
        </section>

        {/* FAQ */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">常见问题（FAQ）</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">为什么 GIF 很容易变大？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                GIF 的压缩机制较老，帧数、分辨率与颜色数都会显著影响体积。一般先缩放，再抽帧与降色，收益更稳定。
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">体积怎么压得更明显？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                优先降低 maxWidth（分辨率），其次降低 FPS（帧率），最后再考虑降色。三者叠加通常比单一调参更有效。
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}