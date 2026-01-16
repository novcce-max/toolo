'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    PDFLib?: any
  }
}

export type PdfLibScriptProps = {
  onReady: () => void
}

/**
 * 统一加载 pdf-lib（CDN），并在“已存在/加载完成”两种情况下都回调 onReady。
 * 关键：确保客户端路由切换进入工具页也能正确初始化（不依赖整页刷新）。
 */
export default function PdfLibScript({ onReady }: PdfLibScriptProps) {
  useEffect(() => {
    if (window.PDFLib) onReady()
  }, [onReady])

  return (
    <Script
      src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"
      strategy="afterInteractive"
      onLoad={onReady}
    />
  )
}

