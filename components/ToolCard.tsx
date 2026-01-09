// 文件路径: /components/ToolCard.tsx
import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  IconPdf,
  IconPdfCompress,
  IconPdfMerge,
  IconPdfSplit,
  IconPdfImagesToPdf,
  IconPdfToImages,
  IconPdfRotate,
} from '@/components/icons/ToolIcons'

export type ToolCardTone = 'emerald' | 'violet' | 'blue' | 'slate' | 'amber' | 'rose'

interface ToolCardProps {
  href: string
  title: string
  description: string
  badge?: string
  tone?: ToolCardTone
  /**
   * 可选：自定义图标（推荐传 SVG ReactNode）
   * - 若不传，将根据 href 自动匹配内置图标
   */
  icon?: ReactNode
}

function toneToIconTextClass(tone: ToolCardTone): string {
  // 颜色必须写死，避免 Tailwind 不能静态分析导致不生效
  switch (tone) {
    case 'emerald':
      return 'text-emerald-600'
    case 'violet':
      return 'text-violet-600'
    case 'blue':
      return 'text-blue-600'
    case 'amber':
      return 'text-amber-600'
    case 'rose':
      return 'text-rose-600'
    default:
      return 'text-slate-700'
  }
}

function toneToBadgeClass(tone: ToolCardTone): string {
  switch (tone) {
    case 'emerald':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'violet':
      return 'border-violet-200 bg-violet-50 text-violet-700'
    case 'blue':
      return 'border-blue-200 bg-blue-50 text-blue-700'
    case 'amber':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'rose':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700'
  }
}

function inferToneFromHref(href: string): ToolCardTone {
  // 关键逻辑：统一“分类色语义”，页面不需要自己传 tone 也能保持一致
  if (href.startsWith('/image')) return 'emerald'
  if (href.startsWith('/gif')) return 'violet'
  if (href.startsWith('/text')) return 'blue'
  return 'slate'
}

type IconKey =
  | 'image'
  | 'compress'
  | 'convert'
  | 'gif'
  | 'videoToGif'
  | 'text'
  | 'subtitleFormat'
  | 'subtitleShift'
  | 'subtitleMergeSplit'
  | 'pdf'
  | 'pdfCompress'
  | 'pdfMerge'
  | 'pdfSplit'
  | 'pdfImagesToPdf'
  | 'pdfToImages'
  | 'pdfRotate'
  | 'default'

function inferIconKeyFromHref(href: string): IconKey {
  // 关键逻辑：只依赖 href 规则，避免页面引入图标组件导致“export 不存在”类报错
  if (href === '/image') return 'image'
  if (href === '/gif') return 'gif'
  if (href === '/text') return 'text'
  if (href === '/pdf') return 'pdf'

  if (href.includes('/image/compress')) return 'compress'
  if (href.includes('/image/convert')) return 'convert'

  if (href.includes('/gif/compress')) return 'compress'
  if (href.includes('/gif/video-to-gif')) return 'videoToGif'

  if (href.includes('/text/subtitle-format')) return 'subtitleFormat'
  if (href.includes('/text/subtitle-shift')) return 'subtitleShift'
  if (href.includes('/text/subtitle-merge-split')) return 'subtitleMergeSplit'

  if (href.includes('/pdf/compress')) return 'pdfCompress'
  if (href.includes('/pdf/merge')) return 'pdfMerge'
  if (href.includes('/pdf/split')) return 'pdfSplit'
  if (href.includes('/pdf/images-to-pdf')) return 'pdfImagesToPdf'
  if (href.includes('/pdf/pdf-to-images')) return 'pdfToImages'
  if (href.includes('/pdf/rotate')) return 'pdfRotate'

  return 'default'
}

/**
 * 内置图标：更“饱满”，采用“描边 + 轻填充”的方式（仍然保持 Apple 风克制）
 * - 统一使用 currentColor，颜色由外层 text-* 控制
 * - 外层不再提供“圆形/圆角容器”，按你的要求：直接显示图标
 */
function BuiltinIcon({ name }: { name: IconKey }) {
  const common = {
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  } as const

  switch (name) {
    case 'image':
      return (
        <svg {...common} fill="none">
          <path
            d="M5 7.5C5 6.119 6.119 5 7.5 5h9C17.881 5 19 6.119 19 7.5v9c0 1.381-1.119 2.5-2.5 2.5h-9C6.119 19 5 17.881 5 16.5v-9z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8.25 10.25a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5z"
            fill="currentColor"
            fillOpacity="0.22"
          />
          <path
            d="M6.2 16.6l4.1-4.1c.4-.4 1.05-.4 1.45 0l1.25 1.25c.4.4 1.05.4 1.45 0l1.55-1.55c.4-.4 1.05-.4 1.45 0L19 12.95V16.5c0 1.38-1.12 2.5-2.5 2.5h-9c-1.38 0-2.5-1.12-2.5-2.5v-.5z"
            fill="currentColor"
            fillOpacity="0.16"
          />
        </svg>
      )

    case 'compress':
      return (
        <svg {...common} fill="none">
          <path
            d="M9 6H7a1 1 0 0 0-1 1v2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15 6h2a1 1 0 0 1 1 1v2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M9 18H7a1 1 0 0 1-1-1v-2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15 18h2a1 1 0 0 0 1-1v-2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M9.5 10.5l2.5 2.5l2.5-2.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 13V9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8.5 15.75h7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>
      )

    case 'convert':
      return (
        <svg {...common} fill="none">
          <path
            d="M8 7h8a3 3 0 0 1 3 3v1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M16.5 5.75L18.75 8L16.5 10.25"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 17H8a3 3 0 0 1-3-3v-1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7.5 18.25L5.25 16L7.5 13.75"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.2 12h7.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      )

    case 'gif':
      return (
        <svg {...common} fill="none">
          <path
            d="M6.5 6.5h11A2.5 2.5 0 0 1 20 9v6a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 15V9a2.5 2.5 0 0 1 2.5-2.5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8 11.8c0-1.5 1.2-2.7 2.7-2.7c.7 0 1.3.25 1.8.7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12.5 11.8h-1.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M14.2 9.3h2.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M14.2 11.6h2.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M14.2 13.9h1.7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.45"
          />
          <path
            d="M6.3 8.4h11.4"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity="0.18"
          />
          <path
            d="M6.3 15.6h11.4"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity="0.18"
          />
        </svg>
      )

    case 'videoToGif':
      return (
        <svg {...common} fill="none">
          <path
            d="M6.8 6.5h8.7A2.5 2.5 0 0 1 18 9v6a2.5 2.5 0 0 1-2.5 2.5H6.8A2.8 2.8 0 0 1 4 14.7V9.3A2.8 2.8 0 0 1 6.8 6.5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M11 10.2l3.2 1.8L11 13.8v-3.6z"
            fill="currentColor"
            fillOpacity="0.22"
          />
          <path
            d="M19.5 10.2v3.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M18.8 9.6c.7.4 1.2 1.1 1.2 1.9s-.5 1.5-1.2 1.9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d="M6.5 19.2h5.3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M13.2 19.2h4.3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'text':
      return (
        <svg {...common} fill="none">
          <path
            d="M6 7.5h12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 11.5h12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M6 15.5h8.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M16.7 15.1l1.3 1.3l-1.3 1.3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
        </svg>
      )

    case 'subtitleFormat':
      return (
        <svg {...common} fill="none">
          <path
            d="M7 5.5h7.5L18.5 9.5V18A2.5 2.5 0 0 1 16 20.5H7A2.5 2.5 0 0 1 4.5 18V8A2.5 2.5 0 0 1 7 5.5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 5.5V9.5h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 12h8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7.5 15h6.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M16.8 13.2l.5 1.2l1.2.5l-1.2.5l-.5 1.2l-.5-1.2l-1.2-.5l1.2-.5l.5-1.2z"
            fill="currentColor"
            fillOpacity="0.22"
          />
        </svg>
      )

    case 'subtitleShift':
      return (
        <svg {...common} fill="none">
          <path
            d="M12 20a8 8 0 1 0 0-16a8 8 0 0 0 0 16z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 8v4l2.8 1.7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.2 10.2l-1.6.1l.1-1.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
          <path
            d="M5.8 9.2A7.2 7.2 0 0 1 12 4.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M15.9 18.6h3.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M18 17.5l1 1.1l-1 1.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        </svg>
      )

    case 'subtitleMergeSplit':
      return (
        <svg {...common} fill="none">
          <path
            d="M7 6.5h10A2.5 2.5 0 0 1 19.5 9v6A2.5 2.5 0 0 1 17 17.5H7A2.5 2.5 0 0 1 4.5 15V9A2.5 2.5 0 0 1 7 6.5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8 10.3h8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8 13.3h6.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M15.9 12.2l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15.9 10.8l1.4 1.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'pdf':
      return <IconPdf className="h-6 w-6" />
    case 'pdfCompress':
      return <IconPdfCompress className="h-6 w-6" />
    case 'pdfMerge':
      return <IconPdfMerge className="h-6 w-6" />
    case 'pdfSplit':
      return <IconPdfSplit className="h-6 w-6" />
    case 'pdfImagesToPdf':
      return <IconPdfImagesToPdf className="h-6 w-6" />
    case 'pdfToImages':
      return <IconPdfToImages className="h-6 w-6" />
    case 'pdfRotate':
      return <IconPdfRotate className="h-6 w-6" />

    default:
      return (
        <svg {...common} fill="none">
          <path
            d="M6.5 7h11A2.5 2.5 0 0 1 20 9.5v5A2.5 2.5 0 0 1 17.5 17h-11A2.5 2.5 0 0 1 4 14.5v-5A2.5 2.5 0 0 1 6.5 7z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M7.8 12h8.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      )
  }
}

export default function ToolCard(props: ToolCardProps) {
  const tone = props.tone ?? inferToneFromHref(props.href)
  const iconColor = toneToIconTextClass(tone)
  const badgeClass = toneToBadgeClass(tone)

  const iconNode =
    props.icon ?? <BuiltinIcon name={inferIconKeyFromHref(props.href)} />

  return (
    <Link
      href={props.href}
      className="group block rounded-3xl border border-slate-200 bg-white px-5 py-5 transition hover:border-slate-300 hover:bg-slate-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
    >
      <div className="flex items-start gap-4">
        {/* 图标：按你的要求“去掉外圆容器”，直接显示；通过外层 class 统一尺寸与颜色 */}
        <div
          className={[
            'shrink-0',
            iconColor,
            // 统一控制 svg 尺寸/线宽，不依赖 icon 组件是否支持 className
            '[&_svg]:h-7 [&_svg]:w-7 sm:[&_svg]:h-8 sm:[&_svg]:w-8',
            '[&_svg]:stroke-[1.8]',
            // 让 hover 更“养眼”但不花哨：轻微提亮
            'group-hover:brightness-110',
          ].join(' ')}
          aria-hidden="true"
        >
          {iconNode}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {props.title}
                </h3>

                {props.badge ? (
                  <span
                    className={[
                      'shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium',
                      badgeClass,
                    ].join(' ')}
                  >
                    {props.badge}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {props.description}
          </p>
        </div>
      </div>
    </Link>
  )
}