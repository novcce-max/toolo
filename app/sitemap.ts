// 文件路径: /app/sitemap.ts
import type { MetadataRoute } from 'next'

/**
 * 说明：
 * - lastModified 必须稳定，避免每次构建/请求都变化导致 SEO 与缓存抖动
 * - 优先读取 NEXT_PUBLIC_BUILD_DATE（若不存在/非法则回退到固定常量）
 */
const FALLBACK_LAST_MODIFIED = new Date('2026-01-01T00:00:00.000Z')

function getStableLastModified(): Date {
  const raw = process.env.NEXT_PUBLIC_BUILD_DATE
  if (!raw) return FALLBACK_LAST_MODIFIED

  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return FALLBACK_LAST_MODIFIED

  return d
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getStableLastModified()

  // routes 列表：不得改动既有项的结构与内容；新增仅按既有规则追加，保持排序稳定
  const routes = [
    {
      url: 'https://toolo.cn/',
      changeFrequency: 'weekly',
      priority: 1,
      path: '/',
    },
    {
      url: 'https://toolo.cn/image',
      changeFrequency: 'weekly',
      priority: 0.8,
      path: '/image',
    },
    {
      url: 'https://toolo.cn/gif',
      changeFrequency: 'weekly',
      priority: 0.8,
      path: '/gif',
    },
    {
      url: 'https://toolo.cn/text',
      changeFrequency: 'weekly',
      priority: 0.8,
      path: '/text',
    },
    {
      url: 'https://toolo.cn/image/compress',
      changeFrequency: 'monthly',
      priority: 0.7,
      path: '/image/compress',
    },
    {
      url: 'https://toolo.cn/text/subtitle-shift',
      changeFrequency: 'monthly',
      priority: 0.7,
      path: '/text/subtitle-shift',
    },
    {
      url: 'https://toolo.cn/text/subtitle-format',
      changeFrequency: 'monthly',
      priority: 0.7,
      path: '/text/subtitle-format',
    },
    {
      url: 'https://toolo.cn/privacy',
      changeFrequency: 'yearly',
      priority: 0.4,
      path: '/privacy',
    },
    {
      url: 'https://toolo.cn/gif/video-to-gif',
      changeFrequency: 'yearly',
      priority: 0.3,
      path: '/gif/video-to-gif',
    },
    {
      url: 'https://toolo.cn/gif/compress',
      changeFrequency: 'yearly',
      priority: 0.3,
      path: '/gif/compress',
    },
    {
      url: 'https://toolo.cn/text/subtitle-merge-split',
      changeFrequency: 'monthly',
      priority: 0.7,
      path: '/text/subtitle-merge-split',
    },

    // 追加：/image/convert（保持排序稳定：只在末尾追加）
    {
      url: 'https://toolo.cn/image/convert',
      changeFrequency: 'monthly',
      priority: 0.7,
      path: '/image/convert',
    },

    // 追加：PDF 与 PDF 频道相关页面（保持排序稳定：只在末尾追加）
    {
      url: 'https://toolo.cn/pdf',
      changeFrequency: 'monthly',
      priority: 0.7,
      path: '/pdf',
    },
    {
      url: 'https://toolo.cn/pdf/merge',
      changeFrequency: 'monthly',
      priority: 0.6,
      path: '/pdf/merge',
    },
    {
      url: 'https://toolo.cn/pdf/split',
      changeFrequency: 'monthly',
      priority: 0.6,
      path: '/pdf/split',
    },
    {
      url: 'https://toolo.cn/pdf/compress',
      changeFrequency: 'monthly',
      priority: 0.6,
      path: '/pdf/compress',
    },
    {
      url: 'https://toolo.cn/pdf/images-to-pdf',
      changeFrequency: 'monthly',
      priority: 0.5,
      path: '/pdf/images-to-pdf',
    },
    {
      url: 'https://toolo.cn/pdf/pdf-to-images',
      changeFrequency: 'monthly',
      priority: 0.5,
      path: '/pdf/pdf-to-images',
    },
    {
      url: 'https://toolo.cn/pdf/rotate',
      changeFrequency: 'monthly',
      priority: 0.5,
      path: '/pdf/rotate',
    },
  ] as const

  return routes.map((r) => ({
    url: r.url,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}