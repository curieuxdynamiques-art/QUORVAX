import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 匹配所有路径，但排除：
  // - api 接口
  // - _next / _vercel 静态资源
  // - 包含点号的静态文件
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
