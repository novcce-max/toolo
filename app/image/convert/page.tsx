// 文件路径: /app/image/convert/page.tsx
import type { Metadata } from 'next'
import ToolLayout from '@/components/ToolLayout'
import BatchImageConvert from '@/components/image/BatchImageConvert'

export const metadata: Metadata = {
  title: '图片格式转换 - toolo.cn',
  description:
    '批量将 JPG/PNG/WebP 转换为 WebP/JPG/PNG，默认纯浏览器本地处理；支持质量与最大宽度（可选），并提供逐个下载与下载全部。',
  alternates: {
    canonical: 'https://toolo.cn/image/convert',
  },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/image/convert',
    title: '图片格式转换 - toolo.cn',
    description:
      '批量将 JPG/PNG/WebP 转换为 WebP/JPG/PNG，默认纯浏览器本地处理；支持质量与最大宽度（可选），并提供逐个下载与下载全部。',
    siteName: 'toolo.cn',
  },
}

export default function ImageConvertPage() {
  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '图片格式转换（批量）',
    operatingSystem: 'Web',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'CNY',
    },
    url: 'https://toolo.cn/image/convert',
  }

  return (
    <ToolLayout
      title="图片格式转换"
      description="批量将 JPG/PNG/WebP 转换为 WebP/JPG/PNG。默认纯浏览器本地处理，不上传。"
      breadcrumbs={[
        { href: '/', label: '首页' },
        { href: '/image', label: '图片工具' },
        { href: '/image/convert', label: '图片格式转换' },
      ]}
      side={
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 py-5 space-y-2">
            <div className="text-sm font-semibold text-slate-900">隐私与本地处理</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              所有处理在浏览器内完成。下载使用 ObjectURL，工具会在合适时机 revoke 释放资源。
            </p>
            <a
              href="/privacy"
              className="text-sm text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
            >
              查看隐私说明
            </a>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 space-y-2">
            <div className="text-sm font-semibold text-slate-900">输出规则</div>
            <ul className="text-sm text-slate-600 leading-relaxed list-disc pl-5 space-y-1">
              <li>JPG/WebP：可设置质量（0-100）。</li>
              <li>PNG：不使用质量参数；可选最大宽度缩放（0 表示不缩放）。</li>
              <li>PNG 转 JPG：自动白底填充透明区域，避免黑底。</li>
            </ul>
          </div>
        </div>
      }
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-6">
        <BatchImageConvert />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">使用说明</h2>
        <ol className="text-sm text-slate-600 leading-relaxed list-decimal pl-5 space-y-1">
          <li>选择或拖拽导入图片（JPG/PNG/WebP）。</li>
          <li>选择输出格式：WebP/JPG/PNG，并按需设置质量或最大宽度。</li>
          <li>点击“开始转换”，工具会串行处理，避免浏览器卡顿。</li>
          <li>完成后可逐个下载，或“下载全部（逐个触发）”。</li>
        </ol>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">FAQ</h2>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <div>
            <div className="font-semibold text-slate-900">为什么不提供 ZIP 一键打包？</div>
            <div>一期以稳定与兼容为优先，不引入额外依赖；“下载全部”采用逐个触发方式。</div>
          </div>
          <div>
            <div className="font-semibold text-slate-900">PNG 转 JPG 背景为什么会变黑？</div>
            <div>JPG 不支持透明通道。工具会对白底填充透明区域，保证背景不发黑。</div>
          </div>
          <div>
            <div className="font-semibold text-slate-900">转换后体积更大怎么办？</div>
            <div>不同格式/质量组合会影响体积。可尝试降低质量或输出为 WebP。</div>
          </div>
          <div>
            <div className="font-semibold text-slate-900">会上传到服务器吗？</div>
            <div>不会。处理与下载均在浏览器本地完成。</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}