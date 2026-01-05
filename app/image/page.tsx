// 文件路径: /app/image/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import ToolCard from '@/components/ToolCard'

export const metadata: Metadata = {
  title: '在线图片压缩、图片格式转换（JPG/PNG/WebP）- toolo.cn（本地处理）',
  description:
    '在线图片压缩与图片格式转换工具合集：批量压缩 JPG/PNG/WebP、JPG/PNG/WebP 转 WebP/JPG/PNG。默认浏览器本地处理，不上传，无需登录，稳定优先（串行处理）。',
  alternates: { canonical: 'https://toolo.cn/image' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/image',
    title: '在线图片压缩、图片格式转换（JPG/PNG/WebP）- toolo.cn（本地处理）',
    description:
      '批量图片压缩与格式转换：JPG/PNG/WebP 压缩、转 WebP/JPG/PNG。默认本地处理不上传，无需登录，稳定优先。',
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

function IconCompress(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        d="M7 4.5h7.5l3 3V18.5A2.5 2.5 0 0 1 15 21H7A2.5 2.5 0 0 1 4.5 18.5V7A2.5 2.5 0 0 1 7 4.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M7 4.5h7.5l3 3V18.5A2.5 2.5 0 0 1 15 21H7A2.5 2.5 0 0 1 4.5 18.5V7A2.5 2.5 0 0 1 7 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 4.5v3h3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 12h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 9.5v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.25 14.75l-1.5 1.5M16.75 14.75l1.5 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconConvert(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        d="M6.5 7.5h11A2.5 2.5 0 0 1 20 10v8A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5V10A2.5 2.5 0 0 1 6.5 7.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M6.5 7.5h11A2.5 2.5 0 0 1 20 10v8A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5V10A2.5 2.5 0 0 1 6.5 7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 6.5c.9-1.2 2.3-2 4-2 2.8 0 5 2.2 5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 9.5l-1.6-1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.9 9.6l-1.9.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 20c-.9 1.2-2.3 2-4 2-2.8 0-5-2.2-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 17l1.6 1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7.1 17.1l1.9-.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function ImageIndexPage() {
  // 单对象 JSON-LD（根节点必须包含 @context，不能用数组根节点）
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '在线图片压缩、图片格式转换 - toolo.cn（本地处理）',
    url: 'https://toolo.cn/image',
    description:
      '在线图片压缩与格式转换工具合集：批量压缩 JPG/PNG/WebP、JPG/PNG/WebP 转 WebP/JPG/PNG。默认浏览器本地处理，不上传，无需登录，稳定优先（串行处理）。',
    isPartOf: {
      '@type': 'WebSite',
      name: 'toolo.cn',
      url: 'https://toolo.cn/',
    },
    about: [
      { '@type': 'Thing', name: '在线图片压缩' },
      { '@type': 'Thing', name: '图片压缩' },
      { '@type': 'Thing', name: '图片格式转换' },
      { '@type': 'Thing', name: 'JPG' },
      { '@type': 'Thing', name: 'PNG' },
      { '@type': 'Thing', name: 'WebP' },
    ],
    hasPart: [
      {
        '@type': 'SoftwareApplication',
        name: '在线图片压缩（本地处理）',
        operatingSystem: 'Web',
        applicationCategory: 'MultimediaApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        url: 'https://toolo.cn/image/compress',
      },
      {
        '@type': 'SoftwareApplication',
        name: '在线图片格式转换（本地处理）',
        operatingSystem: 'Web',
        applicationCategory: 'MultimediaApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        url: 'https://toolo.cn/image/convert',
      },
    ],
  }

  const tools: ToolItem[] = [
    {
      title: '图片压缩',
      description: '批量压缩 JPG/PNG/WebP，支持质量与最大宽度；串行处理更稳定。',
      href: '/image/compress',
      badge: '可用',
      tone: 'emerald',
      icon: <IconCompress />,
    },
    {
      title: '图片格式转换',
      description: '批量将 JPG/PNG/WebP 转换为 WebP/JPG/PNG；支持质量与最大宽度（可选）。',
      href: '/image/convert',
      badge: '可用',
      tone: 'emerald',
      icon: <IconConvert />,
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
        {/* Hero：说明区用“标签条”而不是卡片，降低“误以为是功能入口”的概率 */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-10 space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              图片工具
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              在线图片压缩与图片格式转换工具合集。默认浏览器本地处理，不上传，无需登录；适合快速减小体积、转换
              JPG/PNG/WebP，便于上传平台与分享。
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-700">本地处理（默认不上传）</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-700">批量处理（稳定优先）</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-700">JPG / PNG / WebP</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/image/compress"
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
          </div>
        </section>

        {/* 热门工具直达（提升导流 + 内链） */}
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
            <label htmlFor="site-search-image" className="sr-only">
              搜索图片工具
            </label>
            <input
              id="site-search-image"
              type="search"
              inputMode="search"
              placeholder="搜索：压缩 / 转换 / WebP / JPG / PNG / 宽度…"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />

            <p id="site-search-empty-image" className="hidden text-sm text-slate-600">
              没有匹配的工具。你可以尝试换个关键词。
            </p>

            <div id="site-search-list-image" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
(function () {
  var input = document.getElementById('site-search-image');
  var list = document.getElementById('site-search-list-image');
  var empty = document.getElementById('site-search-empty-image');
  if (!input || !list || !empty) return;

  function norm(s) { return (s || '').toLowerCase(); }

  function apply() {
    var q = norm(input.value).trim();
    var items = list.querySelectorAll('.tool-item');
    var visible = 0;

    items.forEach(function (el) {
      var t = norm(el.getAttribute('data-title'));
      var d = norm(el.getAttribute('data-description'));
      var hit = !q || t.indexOf(q) !== -1 || d.indexOf(q) !== -1;
      if (hit) { el.classList.remove('hidden'); visible++; }
      else { el.classList.add('hidden'); }
    });

    if (visible === 0) empty.classList.remove('hidden');
    else empty.classList.add('hidden');
  }

  input.addEventListener('input', apply);
})();
              `.trim(),
            }}
          />
        </section>

        {/* FAQ（补充语义密度 + 用户疑问） */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">常见问题（FAQ）</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">压缩最有效的手段是什么？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                通常先降低分辨率（maxWidth），再调整质量（quality）。先缩放再微调质量，更容易获得稳定收益。
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">为什么优先推荐 WebP？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                WebP 往往在同等观感下体积更小，适合网页与移动端分享；如需兼容性更强，可选择 JPG/PNG。
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}