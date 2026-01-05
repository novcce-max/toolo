// 文件路径: /app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // 关键：允许抓取，并显式指向 sitemap
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://toolo.cn/sitemap.xml',
  }
}