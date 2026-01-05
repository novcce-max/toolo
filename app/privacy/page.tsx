// 文件路径: /app/privacy/page.tsx
import type { Metadata } from 'next'
import ToolLayout from '@/components/ToolLayout'

export const metadata: Metadata = {
  title: '隐私说明 - toolo.cn',
  description:
    'toolo.cn 隐私说明：默认浏览器本地处理，不上传文件与文本；无账号、无后端队列；下载使用 ObjectURL 并在合适时机 revoke；提示浏览器扩展与剪贴板风险。',
  alternates: { canonical: 'https://toolo.cn/privacy' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/privacy',
    title: '隐私说明 - toolo.cn',
    description:
      '默认浏览器本地处理，不上传；无账号、无后端队列；ObjectURL revoke；提示浏览器扩展/剪贴板风险。',
    siteName: 'toolo.cn',
  },
}

export default function PrivacyPage() {
  return (
    <ToolLayout
      title="隐私说明"
      description="toolo.cn 一期默认浏览器本地处理：不做账号系统、不做后端任务队列；你上传的文件与粘贴的文本优先在本机浏览器内处理。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">关键结论</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>默认不上传：处理尽量在浏览器本地完成</li>
              <li>无账号系统：无需登录</li>
              <li>无后端队列：不排队、不保存任务</li>
              <li>下载使用 ObjectURL，并在合适时机 revoke</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">你仍需注意</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>浏览器扩展可能读取页面内容</li>
              <li>系统剪贴板可能被其他软件读取</li>
              <li>截图/录屏软件可能保存屏幕内容</li>
            </ul>
          </div>
        </div>
      }
    >
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">我们如何处理数据</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          一期工具（例如图片压缩、SRT 清洗、字幕时间偏移）默认在浏览器本地处理。你选择的文件、粘贴的文本只用于当次计算，
          toolo.cn 不要求登录、不创建账户、不在服务器侧排队执行任务。
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          当你下载结果文件时，页面会使用 <span className="font-medium text-slate-900">URL.createObjectURL</span>{' '}
          创建临时下载链接，并在合适时机调用 <span className="font-medium text-slate-900">URL.revokeObjectURL</span>{' '}
          释放资源，减少内存占用与潜在泄漏。
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题（FAQ）</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">你们会存储我上传的文件吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              一期默认不上传、不存储。文件仅在你的浏览器内参与计算并生成结果；下载链接为临时 ObjectURL。
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">为什么还要提示剪贴板/扩展风险？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              即使站点不上传，浏览器扩展、系统剪贴板、截图录屏软件等第三方仍可能接触到内容。建议在处理敏感内容时关闭不必要扩展。
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">下载的文件里包含隐私信息吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              下载内容由你的输入直接生成（例如清洗后的字幕、压缩后的图片）。请在分享前自行确认是否包含敏感信息。
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">未来会引入账号/云端处理吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              若未来提供可选云端模式，会在页面显著标注，并单独说明上传范围、保存周期与删除方式；默认仍以本地处理优先。
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  )
}