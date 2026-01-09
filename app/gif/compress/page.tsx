// 文件路径: /app/gif/compress/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import BatchGifCompress from '@/components/gif/BatchGifCompress'

export const metadata: Metadata = {
  title: 'GIF 压缩（本地处理） - toolo.cn',
  description:
    'GIF 压缩工具：纯浏览器本地处理，不上传；支持缩放 maxWidth、抽帧 keepEvery、降色 maxColors 三个旋钮，串行处理更稳定，并提供单个/批量下载。',
  alternates: { canonical: 'https://toolo.cn/gif/compress' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/gif/compress',
    title: 'GIF 压缩（本地处理） - toolo.cn',
    description:
      '纯浏览器本地压缩 GIF：缩放/抽帧/降色三旋钮，串行处理更稳定；支持单个下载与下载全部（逐个触发）。',
    siteName: 'toolo.cn',
  },
}

export default function GifCompressPage() {
  /**
   * 页面级结构化数据（单对象根节点，稳定优先）
   * - 根节点必须包含 @context，避免部分解析器假设 r["@context"] 并直接 toLowerCase 时取到 undefined
   * - 一期先用 SoftwareApplication：信息清晰、风险低；FAQPage 二期再加
   */
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GIF 压缩（本地处理）',
    description:
      '纯浏览器本地压缩 GIF：支持缩放 maxWidth、抽帧 keepEvery、降色 maxColors 三个旋钮，串行处理稳定优先；支持单个下载与下载全部（逐个触发）。',
    operatingSystem: 'Web',
    applicationCategory: 'MultimediaApplication',
    featureList: ['缩放（maxWidth）', '抽帧（keepEvery）', '降色（maxColors）', '串行处理', '本地处理不上传', '逐个/批量下载'],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    url: 'https://toolo.cn/gif/compress',
  }

  return (
    <ToolLayout
      title="GIF 压缩"
      description="纯浏览器本地压缩：缩放 / 抽帧 / 降色三旋钮，串行处理稳定优先。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理与隐私</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>默认在浏览器内完成处理，不上传文件。</li>
              <li>无登录、无后端队列，结果只在本机生成。</li>
              <li>下载使用 ObjectURL，并在合适时机回收，避免内存泄漏。</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/privacy"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                aria-label="查看隐私说明"
              >
                隐私说明
              </Link>
              <Link
                href="/gif"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                aria-label="返回 GIF 工具分类"
              >
                返回 GIF 分类
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">三旋钮解释</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>
                <span className="font-medium text-slate-900">maxWidth（缩放）</span>：限制最大宽度（0=不缩放），通常对体积影响最大。
              </li>
              <li>
                <span className="font-medium text-slate-900">keepEvery（抽帧）</span>：每 N 帧保留 1 帧（1=不抽帧），可显著减小体积。
              </li>
              <li>
                <span className="font-medium text-slate-900">maxColors（降色）</span>：限制颜色数（2~255），越低越省，但画质可能下降。
              </li>
            </ul>
            <div className="mt-3 text-xs text-slate-500 leading-relaxed">
              建议：先用“预设：平衡”，再按目标体积逐步降低 maxWidth 或 maxColors，必要时再增大 keepEvery。
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">相关工具</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/gif/video-to-gif"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                aria-label="前往视频转 GIF 工具"
              >
                视频转 GIF
              </Link>
            </div>
          </div>
        </div>
      }
      breadcrumbs={[
        { href: '/', label: '首页' },
        { href: '/gif', label: 'GIF 工具' },
        { href: '/gif/compress', label: 'GIF 压缩' },
      ]}
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-6">
        {/* 首屏：简短说明 */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8">
          <p className="text-sm text-slate-600 leading-relaxed">
            本工具在浏览器本地对 GIF 做"缩放 / 抽帧 / 降色"组合优化，以更可控的方式降低体积。
            一期侧重稳定与可预期结果：串行处理，一次只处理一个文件。所有处理均在本地完成，不上传文件。
          </p>
        </section>

        {/* 工具主体 */}
        <section aria-label="GIF 压缩工具">
          <BatchGifCompress />
        </section>

        {/* A. 用途与适用场景 */}
        <section className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-10 py-8 space-y-4" aria-labelledby="usage-heading">
          <h2 id="usage-heading" className="text-lg font-semibold text-slate-900">用途与适用场景</h2>
          <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
            <li>平台对 GIF 体积有限制（常见为数 MB 到十几 MB），需要压缩到可上传范围。</li>
            <li>教程/文档/演示动图需要更快加载，减少卡顿与等待。</li>
            <li>聊天/社媒发送 GIF 时体积过大导致发送失败或加载慢。</li>
            <li>长动图或大分辨率 GIF 影响页面性能（首屏加载、滚动卡顿）。</li>
          </ul>
        </section>

        {/* B. 一期为什么用这三旋钮 */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-4" aria-labelledby="why-three-heading">
          <h2 id="why-three-heading" className="text-lg font-semibold text-slate-900">为什么一期只做三旋钮</h2>
          <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
            <li>
              <span className="font-medium text-slate-900">缩放</span> 是最确定、最可控的体积杠杆：分辨率越低，体积通常越小。
            </li>
            <li>
              <span className="font-medium text-slate-900">抽帧</span> 显著降低帧数量：对“录屏类动图”非常有效。
            </li>
            <li>
              <span className="font-medium text-slate-900">降色</span> 适合扁平图标/表情包：减少调色板可进一步压缩体积。
            </li>
          </ul>
        </section>

        {/* C. Roadmap */}
        <section className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-10 py-8 space-y-4" aria-labelledby="roadmap-heading">
          <h2 id="roadmap-heading" className="text-lg font-semibold text-slate-900">路线图（Roadmap）</h2>
          <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
            <li>目标体积模式：按目标 MB 自动给出推荐参数组合与预估。</li>
            <li>裁剪/截取：仅压缩某一段帧范围（对超长 GIF 更友好）。</li>
            <li>预览对比：原图/压缩后并排预览，显示体积、比例、耗时。</li>
            <li>更多预设：表情包/录屏/照片类动图的专用预设。</li>
            <li>颜色抖动与调色策略：在体积与观感之间提供更细粒度控制。</li>
            <li>导出策略：优先建议 WebP 动图/MP4/WebM（更省更流畅），再回退 GIF。</li>
          </ul>
        </section>

        {/* 替代方案建议 */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-4" aria-labelledby="alternatives-heading">
          <h2 id="alternatives-heading" className="text-lg font-semibold text-slate-900">替代方案建议（多数平台更优）</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            多数情况下 <span className="font-medium text-slate-900">MP4 / WebM</span> 更适合“动图效果”：
            同等清晰度体积更小、播放更流畅、对长内容更友好。若平台支持，优先考虑使用视频格式替代 GIF。
          </p>
        </section>

        {/* FAQ */}
        <section className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-10 py-8 space-y-4" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-lg font-semibold text-slate-900">常见问题（FAQ）</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">压缩最有效的手段是什么？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                通常是缩放（降低分辨率）+ 抽帧（降低帧数量）+ 降色（减少调色板）。建议先缩放，再逐步调整抽帧与降色。
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">为什么压缩后颜色变差或出现色带？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                GIF 颜色数有限，降色会减少可用颜色，可能产生色带/抖动。建议从 128 色开始，逐步降低到 64 色观察效果。
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">为什么有时压缩不明显？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                若原 GIF 已经较小或内容复杂，单靠降色可能收益有限。尝试降低 maxWidth，通常更容易获得明显体积下降。
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">是否会上传文件到服务器？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                不会。压缩在浏览器本地完成。隐私细节请查看{' '}
                <Link
                  href="/privacy"
                  className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                >
                  /privacy
                </Link>
                。
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">为什么不直接用 MP4/WebM？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                如果平台支持，MP4/WebM 通常更省体积且更流畅。GIF 主要用于“循环、自动播放、无需点击”的兼容场景。
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">与“视频转 GIF”如何配合？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                常见流程：先在{' '}
                <Link
                  href="/gif/video-to-gif"
                  className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                >
                  视频转 GIF
                </Link>{' '}
                截取短片段导出，再在本页进一步压缩体积并优化参数。
              </div>
            </div>
          </div>
        </section>
      </div>
    </ToolLayout>
  )
}