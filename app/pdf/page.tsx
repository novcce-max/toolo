import type { Metadata } from 'next'
import Link from 'next/link'
import ToolCard from '@/components/ToolCard'

export const metadata: Metadata = {
  title: 'PDF 工具在线 - 合并/拆分/压缩（本地处理不上传）- toolo.cn',
  description:
    'PDF 工具频道：PDF 合并、拆分、压缩、图片转 PDF、PDF 转图片与旋转页面等，均在浏览器本地完成，不上传文件、无需登录，适合办公提交、资料归档与隐私文件处理。',
  alternates: { canonical: 'https://toolo.cn/pdf' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf',
    title: 'PDF 工具在线 - 合并/拆分/压缩（本地处理不上传）- toolo.cn',
    description:
      'PDF 工具频道：合并、拆分、压缩与转换，默认纯浏览器本地处理不上传。',
    siteName: 'toolo.cn',
  },
}

type ToolItem = {
  title: string
  description: string
  href: string
  badge?: string
  category: 'ProductivityApplication'
}

export default function PdfHubPage() {
  /**
   * PDF 工具列表（第一波：频道先行，工具页后续逐一落地）
   */
  const tools: ToolItem[] = [
    {
      title: 'PDF 合并',
      description: '将多个 PDF 按顺序合并为一个文件，适合打包材料与统一提交。',
      href: '/pdf/merge',
      badge: '基础版',
      category: 'ProductivityApplication',
    },
    {
      title: 'PDF 拆分',
      description: '按页码范围拆分 PDF，适合同一文件按章节或按材料拆分提交。',
      href: '/pdf/split',
      badge: '基础版',
      category: 'ProductivityApplication',
    },
    {
      title: 'PDF 压缩',
      description: '在线压缩 PDF 体积，减小文件大小以满足平台上传和邮件限制。',
      href: '/pdf/compress',
      badge: '推荐',
      category: 'ProductivityApplication',
    },
    {
      title: '图片转 PDF',
      description: '将多张图片合并生成一个 PDF，适合整理作业、票据与扫描件。',
      href: '/pdf/images-to-pdf',
      badge: '基础版',
      category: 'ProductivityApplication',
    },
    {
      title: 'PDF 转图片',
      description: '将 PDF 每一页导出为图片，便于分享、预览和标注。',
      href: '/pdf/pdf-to-images',
      badge: '基础版',
      category: 'ProductivityApplication',
    },
    {
      title: 'PDF 旋转',
      description: '批量调整 PDF 页面方向，修正横竖颠倒的页面。',
      href: '/pdf/rotate',
      badge: '基础版',
      category: 'ProductivityApplication',
    },
  ]

  /**
   * 频道页 JSON-LD：CollectionPage + hasPart（列出工具 SoftwareApplication）
   * - 单对象根节点（不使用数组根）
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'PDF 工具 - toolo.cn',
    url: 'https://toolo.cn/pdf',
    description: 'PDF 工具频道：合并、拆分、压缩与转换。默认纯浏览器本地处理不上传、无需登录。',
    hasPart: tools.map((t) => ({
      '@type': 'SoftwareApplication',
      name: t.title,
      operatingSystem: 'Web',
      applicationCategory: t.category,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
      url: `https://toolo.cn${t.href}`,
    })),
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-8">
        {/* Hero 标签条 + CTA（与其他频道一致） */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-900">
              PDF 频道
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
              本地处理 · 不上传
            </span>
            <Link
              href="/privacy"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              隐私说明
            </Link>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">PDF 工具</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            默认纯浏览器本地处理，不上传。面向办公提交与隐私文件：把合并、拆分、压缩与转换做得更稳、更可控。
          </p>

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 space-y-3">
            <div className="text-sm font-semibold text-slate-900">快速开始（建议路径）</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 leading-relaxed">
              <li>要提交平台但大小受限：先压缩，不行再拆分。</li>
              <li>多份材料要打包：先合并成单份，便于归档与发送。</li>
              <li>需要截图/标注：从 PDF 导出图片页，再处理。</li>
            </ul>
          </div>
        </section>

        {/* 热门工具（与频道一致的区块） */}
        <section className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">热门工具</h2>
            <p className="text-sm text-slate-600">
              按使用频率与常见需求排序，优先展示当前最常用的 PDF 工具，其中「PDF 压缩」是推荐入口。
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.slice(0, 3).map((t) => (
              <ToolCard key={t.href} href={t.href} title={t.title} description={t.description} badge={t.badge} />
            ))}
          </div>
        </section>

        {/* 站内搜索（原生 DOM 过滤脚本） */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">站内搜索</h2>
            <p className="text-sm text-slate-600">按名称或描述筛选（仅本地过滤）。</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 space-y-4">
            <label htmlFor="site-search-pdf" className="sr-only">
              搜索 PDF 工具
            </label>
            <input
              id="site-search-pdf"
              type="search"
              inputMode="search"
              placeholder="搜索：合并 / 拆分 / 压缩 / 转图片 / 旋转…"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />

            <p id="site-search-empty-pdf" className="hidden text-sm text-slate-600">
              没有匹配的工具。你可以尝试换个关键词。
            </p>

            <div id="site-search-list-pdf" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((t) => (
                <div key={t.href} className="tool-item" data-title={t.title} data-description={t.description}>
                  <ToolCard href={t.href} title={t.title} description={t.description} badge={t.badge} />
                </div>
              ))}
            </div>
          </div>

          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
(function () {
  var input = document.getElementById('site-search-pdf');
  var list = document.getElementById('site-search-list-pdf');
  var empty = document.getElementById('site-search-empty-pdf');
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

        {/* FAQ（与频道一致的区块） */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">常见问题</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">PDF 会上传到服务器吗？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                频道目标是默认纯浏览器本地处理：不上传、无需登录、无后端队列。隐私敏感文件更适合在本地完成处理。
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">这个频道里有哪些常用的 PDF 工具？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                当前 PDF 频道提供合并、拆分、压缩、图片转 PDF、PDF 转图片与旋转等常见操作，其中 PDF 压缩已作为核心工具优先上线，适合解决上传与分享时的体积问题。
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}