import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'
import ImagesToPdfClient from '@/components/pdf/ImagesToPdfClient'

export const metadata: Metadata = {
  title: '图片转 PDF 工具在线 - 多图合成 PDF（本地处理不上传）- toolo.cn',
  description:
    '在线 图片转 PDF 工具：在浏览器本地将多张 JPG/PNG/WebP 图片按顺序合成为一个 PDF 文件，支持拖拽排序和选择 A4 或原尺寸页面，不上传服务器，适合扫描件整理、作业提交与资料归档。',
  alternates: { canonical: 'https://toolo.cn/pdf/images-to-pdf' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/images-to-pdf',
    title: '图片转 PDF 工具在线 - 多图合成 PDF（本地处理不上传）- toolo.cn',
    description:
      '图片转 PDF 工具：在浏览器本地将多张图片按顺序合成为一个 PDF，支持拖拽排序与基础页面尺寸设置，不上传文件，适用于办公与学习场景。',
    siteName: 'toolo.cn',
  },
}

export default function ImagesToPdfPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: '图片转 PDF 工具',
        url: 'https://toolo.cn/pdf/images-to-pdf',
        operatingSystem: 'Web',
        applicationCategory: 'ProductivityApplication',
        description:
          '在线 图片转 PDF 工具：在浏览器本地将多张 JPG/PNG/WebP 图片按顺序合成为一个 PDF 文件，支持拖拽排序和 A4/原尺寸选择，不上传服务器，适合扫描件整理、作业提交与资料归档。',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        featureList: ['多图合成一个 PDF', '支持拖拽排序', 'A4 或原尺寸页面选项', '本地处理不上传'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '使用图片转 PDF 工具时，图片会上传到服务器吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不会。图片会在浏览器本地被读取并合成为 PDF 文件，不会上传到服务器或被云端保存，生成的 PDF 只会以你下载到本地的文件形式存在。',
            },
          },
          {
            '@type': 'Question',
            name: '支持哪些图片格式？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '当前支持常见的 JPG、JPEG、PNG 和 WebP 图片格式。你可以一次选择多张图片，工具会按排序结果依次生成 PDF 页面。',
            },
          },
          {
            '@type': 'Question',
            name: '如何调整图片在 PDF 中的顺序？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '选择图片后，在列表中可以通过“上移”和“下移”按钮调整图片顺序。PDF 会按照当前列表顺序依次生成页面，你可以在合成前反复微调顺序。',
            },
          },
          {
            '@type': 'Question',
            name: 'A4 和原尺寸页面有什么区别？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '选择 A4 时，每一页都会以 A4 比例创建，并将图片按最长边等比缩放适配页面，适合打印和标准文档尺寸；选择原尺寸时，会根据每张图片的像素尺寸创建对应大小的页面，更适合保留原始分辨率和比例。',
            },
          },
        ],
      },
    ],
  }

  return (
    <ToolLayout
      title="图片转 PDF"
      description="在浏览器本地将多张图片按顺序合成为一个 PDF 文件，不上传服务器，适合扫描件整理、作业提交与资料归档。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">常见用途</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>将手机拍摄的多张扫描件整理为一份 PDF，便于提交与归档。</li>
              <li>把多张票据、发票或证明材料合并成一个 PDF 文件统一报销。</li>
              <li>将课件截图、作业照片合成为一个 PDF，方便老师批阅。</li>
              <li>将产品图片或演示图片整理为 PDF 以便发送给客户或同事。</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理与隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              图片与生成的 PDF 均在浏览器本地处理，不上传服务器、不需登录，适合处理包含隐私内容的扫描件和材料。详情请查看{' '}
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
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">图片转 PDF 工具</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            在浏览器本地将多张图片按顺序合成为一个 PDF 文件，支持拖拽排序与基础页面尺寸选择，不上传服务器，适合扫描件整理、作业提交和资料归档等高频场景。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#images-to-pdf-tool"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            选择图片开始合成 PDF
          </a>
          <div className="text-xs sm:text-sm text-slate-600">
            支持多选与拖拽排序，所有处理在浏览器本地完成，不上传文件。
          </div>
        </div>
      </section>
      <section
        id="images-to-pdf-tool"
        className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-6 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">合成流程</h2>
        <ImagesToPdfClient />
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">
              使用图片转 PDF 工具时，图片会上传到服务器吗？
            </div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不会。图片会在浏览器本地被读取并合成为 PDF 文件，不会上传到服务器或被云端保存，生成的 PDF 只会以你下载到本地的文件形式存在。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">支持哪些图片格式？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              当前支持常见的 JPG、JPEG、PNG 和 WebP 图片格式。你可以一次选择多张图片，工具会按排序结果依次生成 PDF 页面。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">如何调整图片在 PDF 中的顺序？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              选择图片后，在“图片顺序”列表中可以通过“上移”和“下移”按钮调整顺序。PDF 会按照当前列表顺序依次生成页面，你可以在合成前反复微调。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">A4 和原尺寸页面有什么区别？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              选择 A4 时，每一页都会以 A4 比例创建，并将图片按最长边等比缩放适配页面，适合打印和标准文档尺寸；选择原尺寸时，会根据每张图片的像素尺寸创建对应大小的页面，更适合保留原始分辨率和比例。
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
            href="/pdf/pdf-to-images"
            title="PDF 转图片"
            description="将 PDF 页面导出为图片，便于分享、预览或在图片工具中继续标注。"
            badge="基础版"
            tone="slate"
          />
        </div>
      </section>
    </ToolLayout>
  )
}