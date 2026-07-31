import NextAuth, { type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

// 受保护的路径前缀 —— 访问这些路径需要登录
const ADMIN_PATH_PATTERN = /^\/(en|de|fr)\/admin(\/|$)/;

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    // 在 JWT 中存储 locale 信息
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.login = (profile as { login?: string }).login;
      }
      return token;
    },
    // 暴露给客户端 session
    async session({ session, token }) {
      if (session.user) {
        (session.user as { login?: string }).login = token.login as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
