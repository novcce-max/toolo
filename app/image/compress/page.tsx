// 文件路径: /app/image/compress/page.tsx
import type { Metadata } from 'next'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'
import BatchImageCompress from '@/components/image/BatchImageCompress'

export const metadata: Metadata = {
  title: '图片压缩 - toolo.cn',
  description:
    '批量压缩 JPG/PNG/WebP，支持质量与最大宽度参数。纯浏览器本地处理，逐个串行压缩，提供下载与下载全部（逐个触发）。',
  alternates: { canonical: 'https://toolo.cn/image/compress' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/image/compress',
    title: '图片压缩 - toolo.cn',
    description:
      '批量压缩 JPG/PNG/WebP：质量/最大宽度参数，串行处理更稳定。纯浏览器本地处理。',
    siteName: 'toolo.cn',
  },
}

export default function ImageCompressPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '图片压缩',
    operatingSystem: 'Web',
    applicationCategory: 'MultimediaApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    url: 'https://toolo.cn/image/compress',
  }

  return (
    <ToolLayout
      title="图片压缩"
      description="批量压缩 JPG/PNG/WebP，支持质量与最大宽度。本地处理，逐个串行更稳定。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">输出策略</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>PNG 默认保持 PNG（可切换 WebP）</li>
              <li>JPG/WebP 默认输出 WebP（可切换 JPG）</li>
              <li>串行处理：一次仅压缩一个文件</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              图片仅在浏览器本地处理；下载使用 ObjectURL，并在合适时机 revoke。
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

      {/* 核心工具组件：严禁破坏 */}
      <BatchImageCompress />

      {/* 仅新增：相关工具区块（不改核心逻辑） */}
      <section className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关工具</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          继续浏览其他入口或查看隐私说明。图片压缩全程本地处理，不上传。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/image"
            title="返回图片分类"
            description="查看图片工具列表与其他入口。"
            badge="入口"
          />
          <ToolCard
            href="/privacy"
            title="隐私说明"
            description="本地处理、不上传、ObjectURL revoke 与剪贴板风险提示。"
            badge="说明"
          />
          <ToolCard
            href="/text/subtitle-format"
            title="SRT 清洗 / 格式整理"
            description="字幕格式问题也可本地快速修复：换行、编号、时间分隔符统一。"
            badge="字幕"
          />
        </div>
      </section>
    </ToolLayout>
  )
}