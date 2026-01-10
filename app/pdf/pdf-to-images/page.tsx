import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'
import PdfToImagesClient from '@/components/pdf/PdfToImagesClient'

export const metadata: Metadata = {
  title: 'PDF 转图片工具在线 - PDF转PNG（本地处理不上传）- toolo.cn',
  description:
    '在线 PDF 转图片：将 PDF 页面导出为 PNG 图片，适合预览分享、平台上传与图片标注流程。默认浏览器本地处理，不上传、无需登录，稳定优先。',
  alternates: { canonical: 'https://toolo.cn/pdf/pdf-to-images' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/pdf-to-images',
    title: 'PDF 转图片工具在线 - PDF转PNG（本地处理不上传）- toolo.cn',
    description:
      '在线 PDF 转图片：导出 PDF 页面为 PNG 图片。默认浏览器本地处理，不上传、无需登录。',
    siteName: 'toolo.cn',
  },
}

export default function PdfToImagesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'PDF 转图片',
        operatingSystem: 'Web',
        applicationCategory: 'ProductivityApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        url: 'https://toolo.cn/pdf/pdf-to-images',
        description:
          '在线 PDF 转图片工具：将 PDF 页面导出为 PNG 图片，适合预览分享、平台上传与图片标注流程。默认浏览器本地处理，不上传、无需登录。',
        featureList: [
          'PDF 转 PNG',
          '本地处理不上传',
          '支持页码范围选择',
          '可调节渲染质量',
          '逐页下载',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'PDF 转图片时文件会上传到服务器吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不会。本工具使用 PDF.js 在浏览器本地渲染 PDF 页面到 Canvas，然后导出为 PNG 图片。所有处理都在本地完成，不会上传文件到服务器。',
            },
          },
          {
            '@type': 'Question',
            name: '导出的图片清晰度能调吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '可以。本工具提供三种渲染质量选项：1.0x（标准，适合预览）、1.5x（推荐，平衡清晰度与体积）、2.0x（高清，适合打印）。质量越高，图片体积越大，渲染时间也越长。',
            },
          },
          {
            '@type': 'Question',
            name: '可以只导出部分页面吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '可以。支持页码范围选择，格式如：1-3（第1到第3页）、5（第5页）、1-3,5,8-10（混合格式）。如果留空，则导出全部页面。',
            },
          },
          {
            '@type': 'Question',
            name: '导出的图片是什么格式？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '固定为 PNG 格式。PNG 是无损压缩格式，适合文字、线稿和需要保持清晰度的内容。所有页面都会导出为 PNG 图片，可以逐个下载。',
            },
          },
          {
            '@type': 'Question',
            name: '这个工具适合哪些场景？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '适合需要将 PDF 页面转为图片的场景，如：预览分享、平台上传（某些平台只支持图片）、图片标注、社交媒体发布、文档截图等。尤其适合不方便把文档上传到第三方服务器的隐私文档处理。',
            },
          },
        ],
      },
    ],
  }

  return (
    <ToolLayout
      title="PDF 转图片"
      description="将 PDF 页面导出为 PNG 图片，便于分享与标注。默认本地处理，不上传，支持页码范围选择与质量调节。"
      breadcrumbs={[
        { href: '/', label: '首页' },
        { href: '/pdf', label: 'PDF 工具' },
        { href: '/pdf/pdf-to-images', label: 'PDF 转图片' },
      ]}
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">使用场景</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              PDF 转图片适合需要将 PDF 页面转为图片的场景：预览分享、平台上传（某些平台只支持图片）、图片标注、社交媒体发布、文档截图等。尤其适合不方便把文档上传到第三方服务器的隐私文档处理。
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              默认本地处理，不上传、无需登录。使用 PDF.js 在浏览器本地渲染 PDF 页面到 Canvas，然后导出为 PNG 图片。查看{' '}
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

      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-5">
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
            <span className="text-sm text-slate-700">PNG 格式</span>
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

      <PdfToImagesClient />

      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题（FAQ）</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">PDF 转图片时文件会上传到服务器吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不会。本工具使用 PDF.js 在浏览器本地渲染 PDF 页面到 Canvas，然后导出为 PNG 图片。所有处理都在本地完成，不会上传文件到服务器。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">导出的图片清晰度能调吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              可以。本工具提供三种渲染质量选项：1.0x（标准，适合预览）、1.5x（推荐，平衡清晰度与体积）、2.0x（高清，适合打印）。质量越高，图片体积越大，渲染时间也越长。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">可以只导出部分页面吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              可以。支持页码范围选择，格式如：1-3（第1到第3页）、5（第5页）、1-3,5,8-10（混合格式）。如果留空，则导出全部页面。非法格式会自动忽略，导出全部页面。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">导出的图片是什么格式？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              固定为 PNG 格式。PNG 是无损压缩格式，适合文字、线稿和需要保持清晰度的内容。所有页面都会导出为 PNG 图片，可以逐个下载。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">这个工具适合哪些场景？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              适合需要将 PDF 页面转为图片的场景，如：预览分享、平台上传（某些平台只支持图片）、图片标注、社交媒体发布、文档截图等。尤其适合不方便把文档上传到第三方服务器的隐私文档处理。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">渲染大文件会很慢吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              PDF 渲染到位图会消耗显著内存与 CPU。对于大文件或高分辨率，渲染可能需要一些时间。建议选择合适的分辨率倍率，避免过高的 scale 值导致浏览器卡顿。如果遇到问题，可以尝试减少页码范围或降低渲染质量。
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
            description="将多张图片合并生成一个 PDF，适合整理作业、票据与扫描件。"
          />
          <ToolCard
            href="/pdf/compress"
            title="PDF 压缩"
            description="在线压缩 PDF 体积，减小文件大小以满足平台上传和邮件限制。"
            badge="推荐"
          />
          <ToolCard
            href="/pdf/merge"
            title="PDF 合并"
            description="将多个 PDF 按顺序合并为一个文件，适合打包材料与统一提交。"
          />
        </div>
      </section>
    </ToolLayout>
  )
}
