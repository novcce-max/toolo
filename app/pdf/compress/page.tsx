import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'
import PdfCompressClient from '@/components/pdf/PdfCompressClient'

export const metadata: Metadata = {
  title: '在线 PDF 压缩工具 - Compress PDF Online（本地处理不上传）- toolo.cn',
  description:
    '在线 PDF 压缩工具：compress pdf online，free pdf compressor，在浏览器本地完成 local pdf processing，不上传文件，适合邮件附件、在线表单提交和日常文档分享，在减小体积的同时保持可读性。',
  alternates: { canonical: 'https://toolo.cn/pdf/compress' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/compress',
    title: '在线 PDF 压缩工具 - Compress PDF Online（本地处理不上传）- toolo.cn',
    description:
      '在线压缩 PDF 文件大小，采用浏览器本地处理 local pdf processing，不上传服务器的 no upload pdf compression，适合邮件发送、在线表单提交与日常文档分享。',
    siteName: 'toolo.cn',
  },
}

export default function PdfCompressPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: '在线 PDF 压缩工具（Online PDF Compressor）',
        url: 'https://toolo.cn/pdf/compress',
        operatingSystem: 'Web',
        applicationCategory: 'ProductivityApplication',
        description:
          '在线 PDF 压缩工具：compress pdf online，free pdf compressor，在浏览器本地完成 local pdf processing，不上传文件 no upload pdf compression，适合邮件附件、在线表单提交与日常文档分享。',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        featureList: [
          'compress pdf online',
          'free pdf compressor',
          'no upload pdf compression',
          'local pdf processing in browser',
          'download compressed pdf file',
        ],
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://toolo.cn/pdf/compress?q={search_term}',
          'query-input': 'required name=search_term',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '压缩 PDF 时文件会上传到服务器吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不会。本工具在浏览器中进行本地 PDF 压缩，不上传到服务器。所有处理都在你的设备内存中完成，压缩结束后由你手动下载压缩后的 PDF 文件。',
            },
          },
          {
            '@type': 'Question',
            name: '这个 PDF 压缩工具适合哪些场景？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '适合在邮件发送、在线表单提交、平台上传大小受限、远程协作前减小 PDF 文件体积等场景中使用，尤其适合不方便把文档上传到第三方服务器的办公、学习和隐私文档处理。',
            },
          },
          {
            '@type': 'Question',
            name: '压缩后的 PDF 清晰度会不会变差？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '压缩 PDF 时会在文件体积和可读性之间做平衡。对包含大量图片的 PDF，体积下降越多，画质变化越明显。你可以根据不同压缩等级多次尝试，在“更小文件”和“更清晰内容”之间选择合适方案，并建议保留原始文件作为备份。',
            },
          },
          {
            '@type': 'Question',
            name: '是否需要登录，历史文件会不会被保存？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不需要登录，本工具也不会保存任何文件历史。压缩过程只在你的浏览器中进行，页面关闭或刷新后状态会被清空，压缩结果只以下载到本地的文件形式存在。',
            },
          },
        ],
      },
    ],
  }

  return (
    <ToolLayout
      title="PDF 压缩"
      description="在线压缩 PDF 文件大小，便于上传与邮件发送。默认本地处理，不上传，兼顾体积与可读性。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">压缩是什么</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              PDF 体积通常由图片分辨率和压缩方式、嵌入字体、重复资源等因素决定。通过在浏览器中进行本地 PDF 压缩，可以在可读性与文件大小之间做平衡，让文件更容易上传和分享。
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">隐私与本地处理</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              默认采用本地 PDF 处理，不上传、无需登录，属于 no upload pdf compression。具体细节请查看{' '}
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
            <span className="text-sm text-slate-700">稳定优先</span>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">在线 PDF 压缩工具</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            在浏览器中本地压缩 PDF 文件大小，不上传服务器，适合邮件附件、在线表单提交和平台上传大小受限的场景，在减小体积的同时尽量保持文档可读性。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#tool-action"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            上传 PDF 文件
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
        className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-6 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">如何在线压缩 PDF</h2>
        <PdfCompressClient />
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-4">
          <div className="text-sm font-medium text-slate-900">使用路径总结</div>
          <div className="mt-1 text-sm text-slate-600 leading-relaxed">
            Step 1 Upload：选择需要压缩的 PDF 文件。Step 2 Choose compression：选择 Low / Medium / High 压缩等级。
            Step 3 Download：等待本地处理完成后下载压缩后的 PDF 文件，全程在浏览器中完成。
          </div>
        </div>
        {/* 交互逻辑已迁移为 React Client Component：避免客户端路由切换时脚本不执行导致的“需刷新才可用” */}
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题（FAQ）</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">压缩 PDF 时文件会上传到服务器吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不会。本工具在浏览器中进行本地 PDF 压缩，不上传到服务器。所有处理都发生在你的设备内存中，压缩结束后由你手动下载压缩后的 PDF 文件。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">这个 PDF 压缩工具适合哪些场景？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              适合在邮件发送、在线表单提交、平台上传大小受限、远程协作前减小 PDF 文件体积等场景中使用，尤其适合不方便把文档上传到第三方服务器的办公、学习与隐私文档处理。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">压缩后的 PDF 清晰度会不会变差？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              压缩 PDF 时会在文件体积和可读性之间做平衡。对包含大量图片的 PDF，体积下降越多，画质变化越明显。你可以根据不同压缩等级多次尝试，在“更小文件”和“更清晰内容”之间选择合适方案，并建议保留原始文件作为备份。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">是否需要登录，历史文件会不会被保存？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不需要登录，本工具也不会保存任何文件历史。压缩过程只在你的浏览器中进行，关闭页面或刷新后状态会被清空，压缩结果只以下载到本地的文件形式存在。
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/pdf/merge"
            title="PDF 合并"
            description="将多个 PDF 合并为一个文件，便于归档与提交（占位，将与压缩工具形成常见组合路径）。"
            badge="占位"
            tone="slate"
          />
          <ToolCard
            href="/pdf/split"
            title="PDF 拆分"
            description="按范围或页数拆分 PDF，适合按章节或按材料拆分提交（占位）。"
            badge="占位"
            tone="slate"
          />
          <ToolCard
            href="/privacy"
            title="隐私说明"
            description="了解本地 PDF 处理、不上传与数据安全的更多信息。"
            tone="slate"
          />
        </div>
      </section>
    </ToolLayout>
  )
}