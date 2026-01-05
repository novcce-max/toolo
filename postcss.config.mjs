// 文件路径: /postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    // Tailwind v4 推荐使用该插件入口
    '@tailwindcss/postcss': {},
  },
}