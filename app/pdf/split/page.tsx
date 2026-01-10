// 文件路径: /app/pdf/split/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'
import PdfSplitClient from '@/components/pdf/PdfSplitClient'

export const metadata: Metadata = {
  title: '在线 PDF 拆分工具 - 按页拆分/提取页面（本地处理不上传）- toolo.cn',
  description:
    '在线 PDF 拆分工具：在浏览器本地按页码范围拆分 PDF，支持输入 1-3,5,8-10 这样的范围，split pdf pages without upload，适合按章节提交、拆分附件与资料分发，保护隐私。',
  alternates: { canonical: 'https://toolo.cn/pdf/split' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/split',
    title: '在线 PDF 拆分工具 - 按页拆分/提取页面（本地处理不上传）- toolo.cn',
    description:
      'PDF 拆分工具：在浏览器本地根据页码范围拆分单个 PDF 为多个文件，支持多段范围输入和逐个下载拆分结果，不上传文件，适合办公与学习场景。',
    siteName: 'toolo.cn',
  },
}

export default function PdfSplitPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: '在线 PDF 拆分工具',
        url: 'https://toolo.cn/pdf/split',
        operatingSystem: 'Web',
        applicationCategory: 'ProductivityApplication',
        description:
          '在线 PDF 拆分工具：在浏览器本地根据页码范围拆分单个 PDF 文件，支持输入 1-3,5,8-10 等多段范围，生成多个子 PDF 文件并逐个下载，不上传服务器，适合按章节提交与资料分发。',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        featureList: ['本地拆分单个 PDF 文件', '支持输入多段页码范围', '生成多个拆分后的 PDF 文件', '显示原始页数与拆分结果数量'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '使用这个 PDF 拆分工具时，文件会上传到服务器吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不会。PDF 文件会在浏览器本地读取和拆分，不会上传到服务器或被云端保存，拆分完成后只会生成多个你可以下载的子 PDF 文件。',
            },
          },
          {
            '@type': 'Question',
            name: '如何正确填写 PDF 拆分的页码范围？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '页码范围支持用逗号分隔的多段规则，例如“1-3,5,8-10”。其中 1-3 表示第 1 到第 3 页，5 表示单独第 5 页，8-10 表示第 8 到第 10 页。页码从 1 开始计数，不要输入小数或 0。',
            },
          },
          {
            '@type': 'Question',
            name: '拆分后的 PDF 会影响原文件清晰度或内容吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '拆分操作以“按页拆出子文档”为主，不对页面内容做压缩或重采样，一般不会改变页面清晰度和内容。原始 PDF 文件不会被修改，只是根据你选择的范围生成新的子 PDF 文件。',
            },
          },
          {
            '@type': 'Question',
            name: '一次可以拆分多少个页码范围？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '理论上可以输入多段页码范围，工具本身不额外限制，实际受限于浏览器和设备性能。若拆分范围过多或原文件过大，可能会变慢，建议按章节或需求合理拆分。',
            },
          },
        ],
      },
    ],
  }

  return (
    <ToolLayout
      title="PDF 拆分"
      description="在浏览器本地按页码范围拆分单个 PDF 文件，不上传服务器，适合同一文档分章节提交或提取部分页面。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理与隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              本工具在浏览器本地拆分 PDF，不上传服务器、不需登录，适合处理合同、证明、报告等隐私文档。详情请查看{' '}
              <Link href="/privacy" className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500">
                /privacy
              </Link>
              。
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">适用场景</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>将一份长文档按章节拆分成多份 PDF，分别提交或分发。</li>
              <li>从报告或合同中只提取部分页面，用于补充材料或说明。</li>
              <li>对包含多个子文档的扫描 PDF，按页码拆出独立文件保存。</li>
              <li>教学或培训资料按章节拆分，方便按课次分享给学员。</li>
            </ul>
          </div>
        </div>
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">在线 PDF 拆分工具</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            在浏览器本地根据页码范围拆分单个 PDF 文件，不上传服务器，适合同一文档分章节提交、提取部分页面或按需求拆分材料，兼顾隐私安全与使用灵活性。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#pdf-split-tool"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            上传 PDF 开始拆分
          </a>
          <div className="text-xs sm:text-sm text-slate-600">仅支持单个 PDF 文件拆分，所有处理在浏览器本地完成，不上传文件。</div>
        </div>
      </section>

      <section
        id="pdf-split-tool"
        className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-6 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">拆分流程</h2>
        <PdfSplitClient />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">使用这个 PDF 拆分工具时，文件会上传到服务器吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不会。PDF 文件会在浏览器本地读取和拆分，不会上传到服务器或被云端保存，拆分完成后只会生成多个你可以下载的子 PDF 文件。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">如何正确填写 PDF 拆分的页码范围？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              页码范围支持用逗号分隔的多段规则，例如“1-3,5,8-10”。其中 1-3 表示第 1 到第 3 页，5 表示单独第 5 页，8-10 表示第 8 到第 10 页。页码从 1
              开始计数，不要输入 0、负数或非数字字符。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">拆分后的 PDF 会影响原文件清晰度或内容吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              拆分操作以“按页拆出子文档”为主，不对页面内容做压缩或重采样，一般不会改变页面清晰度和内容。原始 PDF 文件不会被修改，只是根据你选择的范围生成新的子
              PDF 文件。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">一次可以输入多少个页码范围？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              工具本身不额外限制范围数量，实际受限于浏览器和设备性能。若范围过多或原文件页数很大，拆分时间会明显增加，建议按章节或需求分批拆分，以获得更稳定的体验。
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关 PDF 工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/pdf/merge"
            title="PDF 合并"
            description="在浏览器本地将多个 PDF 按顺序合并为一个文件，适合资料整理与统一提交。"
            badge="基础版"
            tone="slate"
          />
          <ToolCard
            href="/pdf/compress"
            title="PDF 压缩"
            description="本地压缩 PDF 文件体积，适合邮件发送与平台上传大小受限场景。"
            badge="推荐"
            tone="slate"
          />
          <ToolCard
            href="/pdf/images-to-pdf"
            title="图片转 PDF"
            description="将多张图片合并为一个 PDF 文件，适合作业、票据与扫描件整理。"
            badge="基础版"
            tone="slate"
          />
        </div>
      </section>
    </ToolLayout>
  )
}