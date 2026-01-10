// 文件路径: /app/text/subtitle-shift/page.tsx
import type { Metadata } from 'next'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'
import SubtitleShiftTool from '@/components/text/SubtitleShiftTool'

export const metadata: Metadata = {
  title: '字幕时间轴整体偏移 - toolo.cn',
  description:
    '将 SRT 字幕时间整体前移/后移，支持正负偏移与 ms/s 单位。纯浏览器本地处理，不上传。',
  alternates: { canonical: 'https://toolo.cn/text/subtitle-shift' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/text/subtitle-shift',
    title: '字幕时间轴整体偏移 - toolo.cn',
    description:
      '将 SRT 字幕时间整体前移/后移，支持正负偏移与 ms/s 单位。纯浏览器本地处理。',
    siteName: 'toolo.cn',
  },
}

export default function SubtitleShiftPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '字幕时间轴整体偏移',
    operatingSystem: 'Web',
    applicationCategory: 'MultimediaApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    url: 'https://toolo.cn/text/subtitle-shift',
  }

  return (
    <ToolLayout
      title="字幕时间轴整体偏移"
      description="支持正负偏移，偏移后时间不为负（负数按 0 处理）。默认浏览器本地处理，不上传。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">常见用途</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>字幕整体提前/延后</li>
              <li>修正音画不同步</li>
              <li>与剪辑导出时间对齐</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              仅本地处理。下载使用 ObjectURL，并在合适时机 revoke。
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
      <SubtitleShiftTool />

      {/* 仅新增：相关工具区块（不改核心逻辑） */}
      <section className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关工具</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          字幕工作流常见组合：先清洗格式，再做时间偏移，最后按需合并/拆分文件。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/text/subtitle-format"
            title="SRT 清洗 / 格式整理"
            description="去 BOM、统一换行与空行、重排编号、时间分隔符统一。"
            badge="可用"
          />
          <ToolCard
            href="/text/subtitle-shift"
            title="字幕时间轴整体偏移"
            description="整体前移/后移字幕时间（当前页）。"
            badge="当前"
          />
          <ToolCard
            href="/text/subtitle-merge-split"
            title="SRT 合并 / 拆分"
            description="多文件顺序合并，或按每 N 条拆分并逐个下载。"
            badge="可用"
          />
        </div>
      </section>
    </ToolLayout>
  )
}