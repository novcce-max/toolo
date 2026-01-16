import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'
import PdfRotateClient from '@/components/pdf/PdfRotateClient'

export const metadata: Metadata = {
  title: 'PDF 旋转工具在线 - 页面方向旋转90/180（本地处理不上传）- toolo.cn',
  description:
    '在线 PDF 旋转工具：在浏览器本地将 PDF 页面旋转 90/180/270 度，支持全部页面或指定页码范围旋转，不上传服务器，适合修正扫描件方向与统一阅读体验。',
  alternates: { canonical: 'https://toolo.cn/pdf/rotate' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/rotate',
    title: 'PDF 旋转工具在线 - 页面方向旋转90/180（本地处理不上传）- toolo.cn',
    description:
      'PDF 页面旋转工具：本地处理、不上传，支持 90/180/270 度旋转和指定页码范围，适合修正扫描件和提交前统一页面方向。',
    siteName: 'toolo.cn',
  },
}

export default function PdfRotatePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'PDF 旋转工具',
        url: 'https://toolo.cn/pdf/rotate',
        operatingSystem: 'Web',
        applicationCategory: 'ProductivityApplication',
        description:
          '在线 PDF 旋转工具：在浏览器本地将 PDF 页面旋转 90/180/270 度，支持全部页面或指定页码范围旋转，不上传服务器，适合修正扫描件方向与统一阅读体验。',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        featureList: [
          '本地旋转单个 PDF 文件',
          '支持 90/180/270 度旋转',
          '支持全部页面或按页码范围旋转',
          '显示处理页数并生成可下载 PDF',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '使用 PDF 旋转工具时，文件会上传到服务器吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不会。PDF 文件会在浏览器本地被读取和旋转，不会上传到服务器或被云端保存，旋转完成后只会以你下载到本地的新 PDF 文件形式存在。',
            },
          },
          {
            '@type': 'Question',
            name: '如何只旋转 PDF 中的部分页面？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '你可以在“指定页码范围”中输入类似“1,3,5-8”的规则，其中 1 表示第 1 页，3 表示第 3 页，5-8 表示第 5 到第 8 页。工具会只对这些页应用所选角度，其他页面保持不变。',
            },
          },
        ],
      },
    ],
  }

  return (
    <ToolLayout
      title="PDF 旋转"
      description="在浏览器本地旋转 PDF 页面方向，支持全部页面或指定页码范围，默认不上传服务器。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">适用场景</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>扫描件方向不对，需要整体或部分页面旋转后再阅读或打印。</li>
              <li>只想旋转某几页（例如签字页），避免影响整份文档结构。</li>
              <li>提交前统一 PDF 页面方向，提高阅读体验与专业度。</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理与隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              本工具在浏览器本地旋转 PDF 页面，不上传服务器、不需登录，适合处理包含隐私内容的合同、报告和证明材料。详情请查看{' '}
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
            <span className="text-sm text-slate-700">免费使用</span>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">PDF 旋转工具</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            在浏览器本地将 PDF 页面旋转 90/180/270 度，支持对全部页面或指定页码范围进行旋转，不上传服务器，适合修正扫描件方向与提交前统一版式。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#pdf-rotate-tool"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            上传 PDF 开始旋转
          </a>
          <div className="text-xs sm:text-sm text-slate-600">
            所有旋转操作在浏览器本地完成，不上传文件，适合处理敏感文档。
          </div>
        </div>
      </section>
      <section
        id="pdf-rotate-tool"
        className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-6 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">旋转流程</h2>
        <PdfRotateClient />
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">
              使用 PDF 旋转工具时，文件会上传到服务器吗？
            </div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不会。PDF 文件会在浏览器本地被读取和旋转，不会上传到服务器或被云端保存，旋转后的结果只会以你下载到本地的新 PDF 文件形式存在。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">如何只旋转其中几页？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              选择“指定页码范围”，再在输入框中填入类似“1,3,5-8”的范围即可。页码从 1 开始计数，你可以组合多个单页和区间，工具会只对这些页面应用旋转角度。
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/pdf/compress"
            title="PDF 压缩"
            description="在浏览器本地压缩 PDF 体积，适合邮件发送与平台上传大小受限场景。"
            badge="推荐"
            tone="slate"
          />
          <ToolCard
            href="/pdf/merge"
            title="PDF 合并"
            description="将多个 PDF 在浏览器本地按顺序合并为一个文件，适合资料整理与归档。"
            badge="基础版"
            tone="slate"
          />
          <ToolCard
            href="/pdf/split"
            title="PDF 拆分"
            description="按页码范围拆分 PDF，在浏览器本地处理不上传，适合同一文档按章节或材料拆分提交。"
            badge="基础版"
            tone="slate"
          />
        </div>
      </section>
    </ToolLayout>
  )
}