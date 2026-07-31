import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import crypto from 'node:crypto';
import { useUsers } from './store/users';

// 简单的服务端哈希
function serverHash(pwd: string): string {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
        isRegister: { label: 'isRegister', type: 'hidden' },
        name: { label: 'Name', type: 'text' },
        phone: { label: 'Phone', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('MISSING_CREDENTIALS');
        }

        const identifier = credentials.identifier.trim();
        const password = credentials.password;
        const pwdHash = serverHash(password);

        // 注册流程
        if (credentials.isRegister === '1') {
          const result = useUsers.getState().registerUser({
            email: identifier.includes('@') ? identifier : `${identifier}@local.dev`,
            phone: credentials.phone,
            name: credentials.name,
            password: pwdHash,
          });
          if (!result.ok) {
            throw new Error(result.error || 'REGISTER_FAILED');
          }
        }

        // 验证用户
        const user = useUsers.getState().verifyUser({
          identifier,
          password: pwdHash,
        });

        if (!user) {
          throw new Error('INVALID_CREDENTIALS');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email,
          image: undefined,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, account, user, profile }) {
      if (account && user) {
        token.uid = user.id;
        token.provider = account.provider;
      }
      if (profile && account?.provider === 'google') {
        token.uid = (profile as { sub?: string }).sub || token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = (token.uid as string) || token.sub;
        (session.user as { provider?: string }).provider = token.provider as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
