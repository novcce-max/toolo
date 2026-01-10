// 文件路径: /app/gif/video-to-gif/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import BatchVideoToGif from '@/components/gif/BatchVideoToGif'

export const metadata: Metadata = {
  title: '视频转 GIF - toolo.cn',
  description:
    '视频转 GIF（纯浏览器本地处理）：不上传。为稳定优先，一期限制截取时长、帧数与输出分辨率；适合将短视频片段快速导出为 GIF。',
  alternates: { canonical: 'https://toolo.cn/gif/video-to-gif' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/gif/video-to-gif',
    title: '视频转 GIF - toolo.cn',
    description:
      '视频转 GIF（纯浏览器本地处理）：不上传。稳定优先限制（时长/帧数/分辨率），适合短片段导出为 GIF。',
    siteName: 'toolo.cn',
  },
}

export default function VideoToGifPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '视频转 GIF',
    operatingSystem: 'Web',
    applicationCategory: 'MultimediaApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    url: 'https://toolo.cn/gif/video-to-gif',
  }

  return (
    <ToolLayout
      title="视频转 GIF"
      description="纯浏览器本地处理，不上传。稳定优先：截取≤10秒、总帧数≤200、输出分辨率受限（建议 maxWidth=480、fps=10、duration=3s）。"
      breadcrumbs={[
        { href: '/', label: '首页' },
        { href: '/gif', label: 'GIF 工具' },
        { href: '/gif/video-to-gif', label: '视频转 GIF' },
      ]}
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              默认在浏览器内完成抽帧与编码，不上传文件、无登录、无后端队列。生成下载链接使用 ObjectURL，并在合适时机回收。
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/privacy"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                隐私说明
              </Link>
              <Link
                href="/gif"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                返回 GIF 分类
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">稳定优先限制</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>截取时长 ≤ 10 秒（避免长时编码导致卡顿/无响应）</li>
              <li>总帧数 ≤ 200（总帧数=FPS×时长，超过请降 FPS/缩短时长）</li>
              <li>输出像素上限（避免高分辨率帧带来内存峰值）</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">建议参数</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>maxWidth：480（分享/聊天更稳）</li>
              <li>FPS：10（清晰与体积的折中）</li>
              <li>duration：3 秒（优先短片段）</li>
              <li>若体积过大：先降 maxWidth，再降 FPS</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/gif/compress"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                相关工具：GIF 压缩
              </Link>
            </div>
          </div>
        </div>
      }
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">生成 GIF</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            选择一个视频文件，设置起始时间、截取时长与 FPS，点击开始生成。为稳定优先，超出上限会提示你调整参数。
          </p>
        </div>
        <BatchVideoToGif />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">使用建议</h2>
        <ul className="text-sm text-slate-600 leading-relaxed list-disc pl-5 space-y-2">
          <li>优先截取短片段（2–6 秒），更容易稳定生成并控制体积。</li>
          <li>输出过大时，优先降低 maxWidth，其次降低 FPS，再缩短 duration。</li>
          <li>若平台支持，通常 MP4/WebM 更小更清晰；GIF 更适合“短、循环、无需点击播放”的场景。</li>
        </ul>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/gif/compress"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            去 GIF 压缩
          </Link>
          <Link
            href="/gif"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            返回 GIF 分类
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            隐私说明
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题（FAQ）</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">为什么要限制时长/帧数？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              视频抽帧与 GIF 编码会占用主线程与内存。限制上限可以显著降低卡顿/崩溃概率，优先保证“能稳定跑完”。
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">生成慢或卡住怎么办？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              请降低 maxWidth 或 FPS，或缩短 duration；也可以使用“取消”停止当前任务，然后用更小参数重试。
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">会上传视频吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不上传。文件只在浏览器内读取处理。隐私细节见{' '}
              <Link href="/privacy" className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500">
                /privacy
              </Link>
              。
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">导出后体积仍然很大？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              GIF 对分辨率与帧数非常敏感。建议先降低 maxWidth，再降低 FPS。也可配合{' '}
              <Link
                href="/gif/compress"
                className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                GIF 压缩
              </Link>{' '}
              做进一步体积优化。
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  )
}