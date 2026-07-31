import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// 受保护的 admin 路径
const ADMIN_PATTERN = /^\/(en|de|fr)\/admin(\/|$)/;

export default async function middleware(req: NextRequest) {
  // 先执行 next-intl 中间件（处理 locale 前缀重定向等）
  const intlResponse = intlMiddleware(req);

  // 检查是否是 admin 路径
  const { pathname } = req.nextUrl;

  if (ADMIN_PATTERN.test(pathname)) {
    // 获取 NextAuth token
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
    });

    if (!token) {
      // 未登录，重定向到登录页
      const locale = pathname.split('/')[1];
      const loginUrl = new URL(`/${locale}/auth/signin`, req.url);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
