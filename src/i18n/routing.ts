import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['en', 'de', 'fr'],

  // 默认语言（访问根路径时使用）
  defaultLocale: 'en',

  // 始终在 URL 中显示 locale 前缀
  localePrefix: 'always'
});
