// 文件路径: /tailwind.config.ts
import type { Config } from 'tailwindcss'

/**
 * Tailwind v4：强烈建议显式声明 content 扫描范围
 * - 否则可能出现“页面能打开但大部分类名无样式/排版乱”的情况（尤其在 Turbopack 下更明显）
 */
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config