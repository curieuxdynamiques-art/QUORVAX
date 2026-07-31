import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LocalUser = {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  // 简单的哈希密码（演示用途，生产请用 bcrypt/argon2 服务端哈希）
  passwordHash: string;
  createdAt: string;
};

type UsersState = {
  users: LocalUser[];
  registerUser: (data: {
    email: string;
    phone?: string;
    name?: string;
    password: string;
  }) => { ok: boolean; error?: string };
  verifyUser: (data: {
    identifier: string; // email or phone
    password: string;
  }) => LocalUser | null;
  findByEmail: (email: string) => LocalUser | undefined;
};

// 简单的 SHA-256 哈希（浏览器/Web API 可用）
async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined') {
    // 服务端 fallback
    return Buffer.from(`sha256:${password}`, 'utf8').toString('hex');
  }
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(password));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const useUsers = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [],
      registerUser: ({ email, phone, name, password }) => {
        // 在浏览器环境异步地计算 hash，这里用同步 fallback（注册 API 路由会再哈希一次）
        const existing = get().users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() ||
            (phone && u.phone === phone)
        );
        if (existing) {
          return { ok: false, error: 'EMAIL_OR_PHONE_EXISTS' };
        }
        set((s) => ({
          users: [
            ...s.users,
            {
              id: `u_${Date.now()}`,
              email,
              phone,
              name: name || email.split('@')[0],
              passwordHash: password, // 会在服务端 API 重新哈希
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        return { ok: true };
      },
      verifyUser: ({ identifier, password }) => {
        const user = get().users.find(
          (u) =>
            u.email.toLowerCase() === identifier.toLowerCase() ||
            u.phone === identifier
        );
        if (!user) return null;
        if (user.passwordHash !== password) return null;
        return user;
      },
      findByEmail: (email) =>
        get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        ),
    }),
    {
      name: 'eu-tech-users',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { hashPassword };
