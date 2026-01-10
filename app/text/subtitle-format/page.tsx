// 文件路径: /app/text/subtitle-format/page.tsx
import type { Metadata } from 'next'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'
import SubtitleFormatTool from '@/components/text/SubtitleFormatTool'

export const metadata: Metadata = {
  title: 'SRT 清洗 / 格式整理 - toolo.cn',
  description:
    '清洗与规范化 SRT：去 BOM、统一换行、重排编号、兼容时间分隔符并统一输出。纯浏览器本地处理，不上传。',
  alternates: { canonical: 'https://toolo.cn/text/subtitle-format' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/text/subtitle-format',
    title: 'SRT 清洗 / 格式整理 - toolo.cn',
    description:
      '清洗与规范化 SRT：去 BOM、统一换行、重排编号、统一时间分隔符。纯浏览器本地处理。',
    siteName: 'toolo.cn',
  },
}

export default function SubtitleFormatPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SRT 清洗 / 格式整理',
    operatingSystem: 'Web',
    applicationCategory: 'MultimediaApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    url: 'https://toolo.cn/text/subtitle-format',
  }

  return (
    <ToolLayout
      title="SRT 清洗 / 格式整理"
      description="去 BOM、统一换行、规范空行、重排编号、时间分隔符统一输出。默认浏览器本地处理，不上传。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">适用场景</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>导入剪辑软件/播放器失败</li>
              <li>编号不连续、空行混乱</li>
              <li>“,”/“.” 毫秒分隔不一致</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              字幕仅在浏览器本地处理。下载使用 ObjectURL，并在合适时机 revoke。
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
      <SubtitleFormatTool />

      {/* 仅新增：相关工具区块（不改核心逻辑） */}
      <section className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关工具</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          都是纯本地处理：适合隐私字幕与批量修正。你可以按目标选择“清洗/偏移/合并拆分”。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/text/subtitle-format"
            title="SRT 清洗 / 格式整理"
            description="规范换行、空行、编号与时间分隔符（当前页）。"
            badge="当前"
          />
          <ToolCard
            href="/text/subtitle-shift"
            title="字幕时间轴整体偏移"
            description="整体前移/后移字幕时间，支持 ms/s 与预设按钮。"
            badge="可用"
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