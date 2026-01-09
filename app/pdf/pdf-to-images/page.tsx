import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'

export const metadata: Metadata = {
  title: 'PDF 转图片工具在线 - PDF转PNG/JPG（本地处理）- toolo.cn',
  description:
    '在线 PDF 转图片：将 PDF 页面导出为 PNG/JPG，适合预览分享、平台上传与图片标注流程。默认浏览器本地处理，不上传、无需登录，稳定优先。',
  alternates: { canonical: 'https://toolo.cn/pdf/pdf-to-images' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/pdf-to-images',
    title: 'PDF 转图片工具在线 - PDF转PNG/JPG（本地处理）- toolo.cn',
    description:
      '在线 PDF 转图片：导出 PDF 页面为 PNG/JPG。默认浏览器本地处理，不上传、无需登录。',
    siteName: 'toolo.cn',
  },
}

export default function PdfToImagesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PDF 转图片',
    operatingSystem: 'Web',
    applicationCategory: 'ProductivityApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    url: 'https://toolo.cn/pdf/pdf-to-images',
  }

  return (
    <ToolLayout
      title="PDF 转图片"
      description="将 PDF 页面导出为 PNG/JPG，便于分享与标注。默认本地处理，不上传（一期占位：先上线说明与入口）。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">说明</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              PDF 转图片需要渲染页面并导出位图，浏览器端实现需考虑字体渲染与性能。一期先提供稳定入口与说明，后续补齐本地渲染与批量导出。
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              默认本地处理，不上传、无需登录。查看{' '}
              <Link
                href="/privacy"
                className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                /privacy
              </Link>
              。
            </p>
          </div>
        </div>
      }
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-5">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-700">本地处理</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-700">不上传</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-700">稳定优先</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#tool-action"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            立即开始
          </a>
          <Link
            href="/privacy"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            隐私说明
          </Link>
          <Link
            href="/pdf"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            返回 PDF 分类
          </Link>
        </div>
      </section>

      <section
        id="tool-action"
        className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-10 py-8 space-y-4 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">操作步骤（一期占位）</h2>
        <ol className="space-y-2 text-sm text-slate-600 leading-relaxed list-decimal pl-5">
          <li>上传 PDF 文件。</li>
          <li>选择导出格式（PNG/JPG）与导出范围（全部/指定页）。</li>
          <li>生成并下载图片（支持逐个下载/下载全部）。</li>
        </ol>

        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-4">
          <div className="text-sm font-medium text-slate-900">限制说明</div>
          <div className="mt-1 text-sm text-slate-600 leading-relaxed">
            PDF 渲染到位图会消耗显著内存与 CPU。一期先保持说明稳定与内链完整，二期将采用串行渲染、上限提示与失败可重试策略，避免浏览器卡死。
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题（FAQ）</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">导出的图片清晰度能调吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              规划支持：分辨率倍率（1x/2x/自定义）与最大宽度限制。默认会优先稳定，避免高倍导出导致崩溃。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">PNG 和 JPG 选哪个？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              文字与线稿更适合 PNG，照片更适合 JPG。后续会提供“体积优先/清晰优先”预设与估算提示。
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/pdf/images-to-pdf"
            title="图片转 PDF"
            description="多张图片合成一个 PDF，适合扫描件归档（一期占位）。"
            badge="占位"
            tone="slate"
          />
          <ToolCard
            href="/pdf/merge"
            title="PDF 合并"
            description="将多份 PDF 合并成一份文件（一期占位）。"
            badge="占位"
            tone="slate"
          />
          <ToolCard href="/privacy" title="隐私说明" description="默认本地处理、不上传与风险提示。" tone="slate" />
        </div>
      </section>
    </ToolLayout>
  )
}