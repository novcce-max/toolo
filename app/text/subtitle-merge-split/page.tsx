// 文件路径: /app/text/subtitle-merge-split/page.tsx
import type { Metadata } from 'next'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'
import SubtitleMergeSplitTool from '@/components/text/SubtitleMergeSplitTool'

export const metadata: Metadata = {
  title: 'SRT 合并 / 拆分 - toolo.cn',
  description:
    '本地合并或拆分 SRT：支持多文件按顺序合并，或用“-----”分隔粘贴多段；支持按每 N 条字幕拆分并逐个下载。',
  alternates: { canonical: 'https://toolo.cn/text/subtitle-merge-split' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/text/subtitle-merge-split',
    title: 'SRT 合并 / 拆分 - toolo.cn',
    description:
      '本地合并或拆分 SRT：多文件顺序合并、分隔符粘贴合并、按每 N 条字幕拆分并下载。',
    siteName: 'toolo.cn',
  },
}

export default function SubtitleMergeSplitPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SRT 合并 / 拆分',
    operatingSystem: 'Web',
    applicationCategory: 'MultimediaApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    url: 'https://toolo.cn/text/subtitle-merge-split',
  }

  return (
    <ToolLayout
      title="SRT 合并 / 拆分"
      description="将多个 SRT 合并为一个，或按每 N 条字幕拆分为多段。默认浏览器本地处理，不上传、无登录、无后端队列。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              上传/粘贴内容仅在浏览器内解析与生成；下载使用 ObjectURL，并在合适时机 revoke，减少内存占用。
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">用法提示</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>合并：多选 .srt 文件，按选择顺序拼接。</li>
              <li>合并：粘贴多段时，用一行 “-----” 分隔。</li>
              <li>拆分：按每 N 条字幕切分并逐个下载。</li>
            </ul>
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
      <SubtitleMergeSplitTool />

      {/* 仅新增：相关工具区块（不改核心逻辑） */}
      <section className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关工具</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          字幕处理常见流程：清洗格式 → 时间偏移 → 合并/拆分输出。全程本地处理，适合隐私内容。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/text/subtitle-format"
            title="SRT 清洗 / 格式整理"
            description="规范换行、空行、编号与时间分隔符，减少导入失败。"
            badge="可用"
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
            description="多文件顺序合并，或按每 N 条拆分并逐个下载（当前页）。"
            badge="当前"
          />
        </div>
      </section>
    </ToolLayout>
  )
}