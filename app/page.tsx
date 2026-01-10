// 文件路径: /app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import ToolCard from '@/components/ToolCard'
import {
  IconImage,
  IconCompress,
  IconConvert,
  IconGif,
  IconVideoToGif,
  IconSubtitle,
  IconText,
  IconPdf,
  IconPdfCompress,
  IconPdfMerge,
  IconPdfSplit,
} from '@/components/icons/ToolIcons'

export const metadata: Metadata = {
  title: '在线图片压缩、GIF压缩、SRT字幕工具 - toolo.cn（本地处理）',
  description:
    'toolo.cn 提供在线图片压缩/格式转换、GIF 压缩/视频转 GIF、SRT 字幕清洗/时间轴偏移/合并拆分等工具。默认浏览器本地处理，不上传，无需登录，打开即用。',
  alternates: { canonical: 'https://toolo.cn/' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/',
    title: '在线图片压缩、GIF压缩、SRT字幕工具 - toolo.cn（本地处理）',
    description:
      '在线图片压缩/格式转换、GIF 压缩/视频转 GIF、SRT 字幕清洗/偏移/合并拆分。默认浏览器本地处理，不上传，无需登录。',
    siteName: 'toolo.cn',
  },
}

type Tone = 'emerald' | 'violet' | 'blue' | 'slate' | 'amber' | 'rose'
type ToolItem = {
  title: string
  description: string
  href: string
  badge?: string
  tone?: Tone
  icon?: ReactElement
}

export default function HomePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q : ''

  // JSON-LD：保留 SearchAction，但要求页面实际支持 ?q= 预填并筛选（本页已实现）
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'toolo.cn',
    url: 'https://toolo.cn/',
    description:
      '在线工具箱：图片压缩、图片格式转换、GIF 压缩、视频转 GIF、SRT 字幕清洗、字幕时间轴偏移、字幕合并拆分、PDF 合并拆分压缩等。默认浏览器本地处理，不上传，无需登录。',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://toolo.cn/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  const hotTools: ToolItem[] = [
    {
      title: 'PDF 压缩',
      description: '在线压缩 PDF 体积，浏览器本地处理不上传，适合邮件与平台上传大小限制。',
      href: '/pdf/compress',
      badge: '推荐',
      tone: 'slate',
      icon: <IconPdfCompress />,
    },
    {
      title: 'PDF 合并',
      description: '将多个 PDF 在浏览器本地按顺序合并为一个文件，不上传服务器，适合资料整理与归档。',
      href: '/pdf/merge',
      badge: '推荐',
      tone: 'slate',
      icon: <IconPdfMerge />,
    },
    {
      title: '图片压缩',
      description: '批量压缩 JPG/PNG/WebP，浏览器本地处理不上传，支持质量与最大宽度；串行处理更稳定。',
      href: '/image/compress',
      badge: '可用',
      tone: 'emerald',
      icon: <IconCompress />,
    },
    {
      title: '图片格式转换',
      description: '批量将 JPG/PNG/WebP 转换为 WebP/JPG/PNG，本地处理不上传；支持质量与最大宽度（可选）。',
      href: '/image/convert',
      badge: '可用',
      tone: 'emerald',
      icon: <IconConvert />,
    },
    {
      title: 'GIF 压缩',
      description: '缩放 / 抽帧 / 降色三旋钮，浏览器本地处理不上传；支持单个下载与下载全部（逐个触发）。',
      href: '/gif/compress',
      badge: '可用',
      tone: 'violet',
      icon: <IconGif />,
    },
    {
      title: '视频转 GIF',
      description: '截取时间范围 + FPS + 最大宽度，浏览器本地生成 GIF（短时长/帧数上限，稳定优先）。',
      href: '/gif/video-to-gif',
      badge: '可用',
      tone: 'violet',
      icon: <IconVideoToGif />,
    },
    {
      title: 'SRT 清洗/格式化',
      description: '一键规范字幕内容，清理空行与异常格式，在浏览器本地完成，便于剪辑/翻译流程。',
      href: '/text/subtitle-format',
      badge: '常用',
      tone: 'blue',
      icon: <IconSubtitle />,
    },
    {
      title: '字幕时间轴偏移',
      description: '整体前移/后移字幕时间轴，快速对齐音画；浏览器本地处理不上传。',
      href: '/text/subtitle-shift',
      badge: '常用',
      tone: 'blue',
      icon: <IconText />,
    },
    {
      title: '字幕合并/拆分',
      description: '按段合并或拆分字幕文件，浏览器本地处理不上传，适合多语言/多段导出场景。',
      href: '/text/subtitle-merge-split',
      badge: '可用',
      tone: 'blue',
      icon: <IconText />,
    },
    {
      title: 'PDF 拆分',
      description: '按页码范围拆分 PDF，在浏览器本地处理不上传，适合同一文档按章节或材料拆分提交。',
      href: '/pdf/split',
      badge: '基础版',
      tone: 'slate',
      icon: <IconPdfSplit />,
    },
  ]

  return (
    <div className="py-10 sm:py-14">
      <div className="space-y-8">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero：与 /image /gif /text 同款（介绍感强，避免误认“入口卡片”） */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-10 space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              toolo.cn 在线工具箱
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              在线图片压缩、GIF 压缩与字幕工具合集。默认浏览器本地处理，不上传，无需登录，打开即用。
              适合自媒体、办公与快速发布场景。
            </p>
          </div>

          {/* 特性标签条：更像“说明”，不像“功能入口” */}
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-700">本地处理（默认不上传）</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="text-sm text-slate-700">无需登录（打开即用）</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-sm text-slate-700">稳定优先（串行/限制）</span>
            </div>
          </div>

          {/* 选择路径引导：覆盖两类用户（目标明确 / 目标不明确） */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/image/compress"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              立即开始（图片压缩）
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              了解隐私
            </Link>

            <p className="text-xs text-slate-500">
              目标明确：直接点“热门工具”。不确定从哪开始：先用图片压缩或在搜索框输入关键词。
            </p>
          </div>

          {/* 快速场景（轻引导，不做卡片，避免误认） */}
          <div className="pt-2">
            <div className="text-xs font-medium text-slate-500">我想…</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/image/compress"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                <IconCompress className="h-5 w-5 text-emerald-600" />
                压缩图片
              </Link>
              <Link
                href="/gif/compress"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                <IconGif className="h-5 w-5 text-violet-600" />
                压缩 GIF
              </Link>
              <Link
                href="/text/subtitle-format"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                <IconSubtitle className="h-5 w-5 text-sky-600" />
                清洗 SRT
              </Link>
              <Link
                href="/pdf"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                <IconPdf className="h-5 w-5" />
                PDF 工具
              </Link>
            </div>
          </div>
        </section>

        {/* 热门工具 + 站内搜索：同一份列表，避免重复渲染（减少重复感） */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">热门工具</h2>
              <p id="site-search-home-desc" className="text-sm text-slate-600">
                直接点卡片进入。也可用搜索框快速筛选（支持 URL 参数 <span className="font-medium">?q=</span>，按
                <kbd className="rounded border border-slate-200 bg-slate-50 px-1 text-[11px] font-mono text-slate-600">
                  /
                </kbd>
                快速聚焦）。
              </p>
            </div>

            {/* 搜索框：仅筛选，不重复渲染结果 */}
            <div className="w-full sm:w-[380px]">
              <label htmlFor="site-search-home" className="sr-only">
                搜索工具
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="site-search-home"
                  type="search"
                  inputMode="search"
                  defaultValue={q}
                  placeholder="搜索：压缩 / 转换 / GIF / SRT / PDF…"
                  aria-describedby="site-search-home-desc site-search-empty-home"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <button
                  type="button"
                  id="site-search-home-clear"
                  className="shrink-0 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  清空
                </button>
              </div>
            </div>
          </div>

          <p id="site-search-empty-home" className="hidden text-sm text-slate-600">
            没有匹配的工具。你可以换个关键词（例如：压缩 / WebP / SRT / 偏移 / PDF），或直接浏览下方分类入口。
          </p>

          <div id="site-search-list-home" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotTools.map((t) => (
              <div key={t.href} className="tool-item" data-title={t.title} data-description={t.description}>
                <ToolCard
                  href={t.href}
                  title={t.title}
                  description={t.description}
                  badge={t.badge}
                  tone={t.tone}
                  icon={t.icon}
                />
              </div>
            ))}
          </div>

          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
(function () {
  var input = document.getElementById('site-search-home');
  var list = document.getElementById('site-search-list-home');
  var empty = document.getElementById('site-search-empty-home');
  var clearBtn = document.getElementById('site-search-home-clear');
  if (!input || !list || !empty) return;

  function norm(s) { return (s || '').toLowerCase(); }

  function apply() {
    var q = norm(input.value).trim();
    var items = list.querySelectorAll('.tool-item');
    var visible = 0;

    items.forEach(function (el) {
      var t = norm(el.getAttribute('data-title'));
      var d = norm(el.getAttribute('data-description'));
      var hit = !q || t.indexOf(q) !== -1 || d.indexOf(q) !== -1;
      if (hit) { el.classList.remove('hidden'); visible++; }
      else { el.classList.add('hidden'); }
    });

    if (visible === 0) empty.classList.remove('hidden');
    else empty.classList.add('hidden');

    // 同步 URL（不刷新页面）：让 SearchAction 与真实行为一致
    try {
      var url = new URL(window.location.href);
      if (q) url.searchParams.set('q', input.value);
      else url.searchParams.delete('q');
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  }

  input.addEventListener('input', apply);
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      input.value = '';
      apply();
      input.focus();
    });
  }

  // 键盘快捷键：在页面任意位置按 / 聚焦搜索框（不打断正在输入的表单）
  window.addEventListener('keydown', function (e) {
    if (
      e.key === '/' &&
      !e.defaultPrevented &&
      document.activeElement &&
      (document.activeElement.tagName === 'BODY' ||
        document.activeElement.tagName === 'MAIN' ||
        (document.activeElement instanceof HTMLElement && document.activeElement.closest('input, textarea') === null))
    ) {
      e.preventDefault();
      input.focus();
    }
  });

  apply(); // 初次渲染：支持 ?q= 预填后立刻筛选
})();
              `.trim(),
            }}
          />
        </section>

        {/* 分类入口：补齐 PDF 频道入口（不改既有结构，只增强入口覆盖） */}
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">分类入口</h2>
            <div className="text-sm text-slate-600">目标不明确：按场景进入更快</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ToolCard
              href="/image"
              title="图片工具"
              description="在线图片压缩、格式转换、尺寸处理等（本地处理）。"
              badge="推荐"
              tone="emerald"
              icon={<IconImage />}
            />
            <ToolCard
              href="/gif"
              title="GIF 工具"
              description="GIF 压缩、视频转 GIF 等（本地处理）。"
              tone="violet"
              icon={<IconGif />}
            />
            <ToolCard
              href="/text"
              title="字幕文本"
              description="SRT 清洗、时间轴整体偏移、合并拆分等（本地处理）。"
              badge="常用"
              tone="blue"
              icon={<IconSubtitle />}
            />
            <ToolCard
              href="/pdf"
              title="PDF 工具"
              description="PDF 合并、拆分、压缩与转换等（本地处理，入口先行）。"
              badge="新增"
              tone="slate"
              icon={<IconPdf />}
            />
          </div>
        </section>

        {/* 隐私说明 */}
        <section className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">隐私与本地处理</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            toolo.cn 一期默认“浏览器本地处理”。你选择的文件（例如 .srt、图片、GIF、视频片段、PDF）优先在本机完成计算，
            不做账号系统、不做后端任务队列。仍请注意：浏览器扩展、截图软件、系统剪贴板等第三方因素可能影响隐私。
          </p>
        </section>

        {/* FAQ */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">常见问题（FAQ）</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">为什么强调本地处理？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                稳定与隐私优先：避免上传、避免排队、避免服务器负载导致失败。你的文件默认只在浏览器中处理。
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-900">GIF/视频类为什么会有限制？</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                纯浏览器编码会受到 CPU 与内存影响。一期采用“短时长/帧数上限 + 串行处理”，确保大多数设备稳定可用。
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}