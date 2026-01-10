import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'
import PdfMergeClient from '@/components/pdf/PdfMergeClient'

export const metadata: Metadata = {
  title: '在线 PDF 合并工具 - 合并多个 PDF 文件（本地处理不上传）- toolo.cn',
  description:
    '在线 PDF 合并工具：在浏览器本地将多个 PDF 按顺序合并为一个文件，不上传服务器，适合资料整理、合同归档、作业与报告统一提交；支持 merge pdf online / combine pdf files（本地处理更安全）。',
  alternates: { canonical: 'https://toolo.cn/pdf/merge' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/merge',
    title: '在线 PDF 合并工具 - 合并多个 PDF 文件（本地处理不上传）- toolo.cn',
    description: 'PDF 合并工具：浏览器本地合并多个 PDF 为一个文件，可调整顺序并下载，不上传文件，适合办公与学习。',
    siteName: 'toolo.cn',
  },
}

export default function PdfMergePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: '在线 PDF 合并工具',
        url: 'https://toolo.cn/pdf/merge',
        operatingSystem: 'Web',
        applicationCategory: 'ProductivityApplication',
        description:
          '在线 PDF 合并工具：在浏览器本地按顺序合并多个 PDF 文件为一个，不上传服务器，适合资料整理、合同归档与统一提交报告；是一款更安全的 merge pdf online / combine pdf files 工具。',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        featureList: ['本地合并多个 PDF 文件', '支持调整合并顺序', '生成并下载合并后的 PDF', '显示合并前文件数量与合并后大小'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '使用这个 PDF 合并工具时，文件会上传到服务器吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不会。PDF 文件在浏览器本地读取和合并，不会上传到服务器或被云端保存；合并完成后仅生成一个可下载的合并后 PDF 文件。',
            },
          },
          {
            '@type': 'Question',
            name: '这个 PDF 合并工具适合哪些使用场景？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '适合整理多份扫描件、票据或证明材料统一提交；合同正文与附件归档；多篇作业/报告打包发送；以及将分散课件按顺序合并便于阅读与打印。',
            },
          },
          {
            '@type': 'Question',
            name: '合并后的 PDF 会改变原来的内容或清晰度吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '合并操作以“拼接页面”为主，不对单页内容做压缩或重采样，一般不会改变页面清晰度与内容；原始文件也不会被修改。',
            },
          },
          {
            '@type': 'Question',
            name: '合并多个 PDF 时有数量或大小限制吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '工具不做硬性数量限制，但合并在浏览器本地完成，主要受设备内存与浏览器性能影响。若文件过多或总大小过大，可能会变慢或失败，建议分批合并。',
            },
          },
        ],
      },
    ],
  }

  return (
    <ToolLayout
      title="PDF 合并"
      description="在浏览器本地将多个 PDF 按顺序合并为一个文件，不上传服务器，适合资料整理与统一提交。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理与隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              本工具在浏览器中本地合并多个 PDF，不上传服务器、不需登录，适合处理合同、证明、报告等隐私文档。详情请查看{' '}
              <Link href="/privacy" className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500">
                /privacy
              </Link>
              。
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">适用场景</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>多份扫描件、票据或证明材料打包成一个 PDF 统一提交。</li>
              <li>合同正文与补充协议、附件等多份文件整理到同一个文件中归档。</li>
              <li>多份作业、报告或课件按顺序合并，方便老师或同事查阅。</li>
              <li>将零散的项目文档合并，便于长期存档与备份。</li>
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
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">在线 PDF 合并工具</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            在浏览器本地按顺序合并多个 PDF 文件为一个，不上传服务器。支持拖拽添加、调整顺序与下载合并结果，适合资料整理、合同归档、作业与报告统一提交等场景。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#pdf-merge-tool"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            选择 PDF 文件开始合并
          </a>
          <div className="text-xs sm:text-sm text-slate-600">支持多选与拖拽排序，所有合并在浏览器本地完成，不上传文件。</div>
        </div>
      </section>

      <section
        id="pdf-merge-tool"
        className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-6 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">合并流程</h2>
        <PdfMergeClient />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">使用这个 PDF 合并工具时，文件会上传到服务器吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不会。PDF 文件在浏览器本地读取和合并，不会上传到服务器或被云端保存，合并完成后只会生成一个你可以下载的合并后 PDF 文件。
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">这个 PDF 合并工具适合哪些使用场景？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              适合整理多份扫描件、票据或证明材料统一提交，合同与补充协议的归档保存，多篇作业、报告或课件按顺序合并，便于老师、同事或客户一次性查看。
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">合并后的 PDF 会改变原来的内容或清晰度吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              合并操作以“拼接页面”为主，不对单页内容做压缩或重采样，一般不会改变页面清晰度。只有在你后续对合并后的文件再进行压缩时，才可能影响图片质量。
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">一次可以合并多少个 PDF 文件？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              工具本身不人为限制数量，实际受限于浏览器和设备内存。若一次选择的文件过多或总大小过大，可能会出现变慢或失败的情况，建议按项目和场景分批合并。
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关 PDF 工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/pdf/compress"
            title="PDF 压缩"
            description="在浏览器本地压缩 PDF 体积，适合邮件发送和平台上传大小受限场景。"
            badge="推荐"
            tone="slate"
          />
          <ToolCard
            href="/pdf/split"
            title="PDF 拆分"
            description="按页码范围拆分 PDF 文件，适合同一文档按章节或材料拆分提交。"
            badge="基础版"
            tone="slate"
          />
          <ToolCard
            href="/pdf/images-to-pdf"
            title="图片转 PDF"
            description="将多张图片合并为一个 PDF 文件，适合作业、票据和扫描件整理。"
            badge="基础版"
            tone="slate"
          />
        </div>
      </section>
    </ToolLayout>
  )
}