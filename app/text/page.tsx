import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import ToolCard from '@/components/ToolCard'

export const metadata: Metadata = {
  title: '在线 SRT 字幕工具：清洗格式化、时间轴偏移、合并拆分（本地处理不上传）- toolo.cn',
  description:
    '在线字幕文本工具合集：SRT 清洗/格式化、字幕时间轴整体偏移（提前/延后毫秒）、字幕合并/拆分。默认浏览器本地处理不上传、无需登录；适合剪辑前快速修字幕与对齐时间轴。',
  alternates: { canonical: 'https://toolo.cn/text' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/text',
    title: '在线 SRT 字幕工具：清洗格式化、时间轴偏移、合并拆分（本地处理不上传）- toolo.cn',
    description:
      'SRT 字幕清洗/格式化、时间轴偏移、合并拆分等在线工具合集：默认本地处理不上传、无需登录，适合剪辑前快速修字幕与对齐。',
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

function IconSubtitle(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        d="M6.5 5.5h11A2.5 2.5 0 0 1 20 8v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5V8A2.5 2.5 0 0 1 6.5 5.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M6.5 5.5h11A2.5 2.5 0 0 1 20 8v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5V8A2.5 2.5 0 0 1 6.5 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 10.25h8.5M7.75 13.25h6.5M7.75 16.25h7.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.5 5.5l1.3-1.6M17.5 5.5l-1.3-1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconShift(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        d="M12 4.5a7.5 7.5 0 1 1-7.5 7.5A7.5 7.5 0 0 1 12 4.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M12 4.5a7.5 7.5 0 1 1-7.5 7.5A7.5 7.5 0 0 1 12 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 8v4.2l3 1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 7.5v3h-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 10.5c-1.5-3-4.3-4.5-7.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconMergeSplit(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        d="M7.5 6.5h9A2.5 2.5 0 0 1 19 9v9A2.5 2.5 0 0 1 16.5 20h-9A2.5 2.5 0 0 1 5 17.5V9A2.5 2.5 0 0 1 7.5 6.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M7.5 6.5h9A2.5 2.5 0 0 1 19 9v9A2.5 2.5 0 0 1 16.5 20h-9A2.5 2.5 0 0 1 5 17.5V9A2.5 2.5 0 0 1 7.5 6.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 10h8M8 13.5h5.5M8 17h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13.5 12l2-2M15.5 10h-2M13.5 12v-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function TextIndexPage() {
  // 单对象 JSON-LD（根节点必须包含 @context，不能用数组根节点）
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '在线 SRT 字幕工具 - toolo.cn（清洗/偏移/合并拆分，本地处理不上传）',
    url: 'https://toolo.cn/text',
    description:
      '在线字幕文本工具合集：SRT 清洗/格式化、字幕时间轴整体偏移（提前/延后毫秒）、字幕合并/拆分。默认浏览器本地处理不上传、无需登录；适合剪辑前快速修字幕与对齐时间轴。',
    isPartOf: {
      '@type': 'WebSite',
      name: 'toolo.cn',
      url: 'https://toolo.cn/',
    },
    about: [
      { '@type': 'Thing', name: 'SRT 字幕' },
      { '@type': 'Thing', name: '字幕清洗' },
      { '@type': 'Thing', name: '字幕格式化' },
      { '@type': 'Thing', name: '字幕时间轴偏移' },
      { '@type': 'Thing', name: '字幕合并' },
      { '@type': 'Thing', name: '字幕拆分' },
      { '@type': 'Thing', name: '毫秒偏移' },
    ],
    hasPart: [
      {
        '@type': 'SoftwareApplication',
        name: 'SRT 字幕清洗/格式化（本地处理）',
        operatingSystem: 'Web',
        applicationCategory: 'UtilitiesApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        url: 'https://toolo.cn/text/subtitle-format',
      },
      {
        '@type': 'SoftwareApplication',
        name: '字幕时间轴整体偏移（提前/延后，毫秒级，本地处理）',
        operatingSystem: 'Web',
        applicationCategory: 'UtilitiesApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        url: 'https://toolo.cn/text/subtitle-shift',
      },
      {
        '@type': 'SoftwareApplication',
        name: '字幕合并/拆分（多段处理，本地处理）',
        operatingSystem: 'Web',
        applicationCategory: 'UtilitiesApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        url: 'https://toolo.cn/text/subtitle-merge-split',
      },
    ],
  }

  const tools: ToolItem[] = [
    {
      title: 'SRT 清洗/格式化',
      description: '修复编号/空行/时间戳格式，统一结构，适合导入剪辑软件前快速清理。',
      href: '/text/subtitle-format',
      badge: '可用',
      tone: 'blue',
      icon: <IconSubtitle />,
    },
    {
      title: '字幕时间轴整体偏移',
      description: '整段字幕统一提前/延后（毫秒级），快速对齐音画与口型。',
      href: '/text/subtitle-shift',
      badge: '常用',
      tone: 'blue',
      icon: <IconShift />,
    },
    {
      title: '字幕合并/拆分',
      description: '按段合并多个 SRT，或按规则拆分；适合多段导出与分集处理。',
      href: '/text/subtitle-merge-split',
      badge: '可用',
      tone: 'blue',
      icon: <IconMergeSplit />,
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
        {/* Hero：说明区与工具区明显区分，降低误认 */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-10 space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              字幕文本工具
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              在线修字幕与对齐时间轴：SRT 清洗/格式化、时间轴整体偏移（提前/延后毫秒）、合并/拆分字幕文件。默认纯浏览器本地处理不上传、无需登录。
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-700">本地处理（避免字幕泄露）</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-700">剪辑友好（快速可控）</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-700">毫秒偏移（对齐更精准）</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/text/subtitle-shift"
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
            <label htmlFor="site-search-text" className="sr-only">
              搜索字幕文本工具
            </label>
            <input
              id="site-search-text"
              type="search"
              inputMode="search"
              placeholder="搜索：SRT 清洗 / 时间轴偏移 / 合并 / 拆分 / 毫秒…"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />

            <p id="site-search-empty-text" className="hidden text-sm text-slate-600">
              没有匹配的工具。你可以尝试换个关键词。
            </p>

            <div id="site-search-list-text" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
  var input = document.getElementById('site-search-text');
  var list = document.getElementById('site-search-list-text');
  var empty = document.getElementById('site-search-empty-text');
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

        {/* FAQ */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">常见问题（FAQ）</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">偏移用秒还是毫秒更靠谱？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                实务上建议用毫秒（ms）更精确。先粗调到秒级，再用毫秒微调，更容易对齐口型与节奏点。
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">为什么清洗后更容易导入？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                常见问题是编号断序、空行异常或时间戳格式不规范。清洗后结构更稳定，剪辑软件解析失败概率更低。
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}