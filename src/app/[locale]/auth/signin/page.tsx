'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';

type Mode = 'signin' | 'register';

type Errors = {
  identifier?: string;
  password?: string;
  password2?: string;
  name?: string;
  phone?: string;
  general?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\-\d\s()]{6,20}$/;

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/en/admin';
  const errorQuery = searchParams.get('error');

  const { data: session } = useSession();

  const [mode, setMode] = useState<Mode>('signin');
  const [loading, setLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // 如果已经登录，自动跳转到后台
  useEffect(() => {
    if (session) {
      router.replace(callbackUrl);
    }
  }, [session, callbackUrl, router]);

  function isEmail(v: string) {
    return EMAIL_RE.test(v.trim());
  }
  function isPhone(v: string) {
    return PHONE_RE.test(v.trim());
  }

  function validate(doRegister: boolean): Errors {
    const e: Errors = {};
    const id = identifier.trim();
    if (!id) {
      e.identifier = mode === 'signin' ? 'Please enter email or phone' : 'Please enter your email';
    } else if (doRegister && !isEmail(id) && !isPhone(id)) {
      e.identifier = 'Please enter a valid email or phone';
    } else if (!doRegister && !isEmail(id) && !isPhone(id)) {
      e.identifier = 'Invalid email or phone';
    }

    if (!password) {
      e.password = 'Please enter password';
    } else if (password.length < 6) {
      e.password = 'At least 6 characters';
    }

    if (doRegister) {
      if (password !== password2) {
        e.password2 = 'Passwords do not match';
      }
      if (name.trim().length < 1) {
        e.name = 'Please enter your name';
      }
      if (phone.trim() && !isPhone(phone)) {
        e.phone = 'Invalid phone number';
      }
    }
    return e;
  }

  async function handleGoogle() {
    setLoading('google');
    try {
      await signIn('google', { callbackUrl });
    } finally {
      setLoading(null);
    }
  }

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    const doRegister = mode === 'register';
    const v = validate(doRegister);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(doRegister ? 'register' : 'signin');
    try {
      const res = await signIn('credentials', {
        redirect: false,
        identifier: identifier.trim(),
        password,
        isRegister: doRegister ? '1' : '0',
        name: doRegister ? name.trim() : '',
        phone: doRegister ? phone.trim() : '',
      });

      if (res?.error) {
        const mapped: Errors = {};
        switch (res.error) {
          case 'CredentialsSignin':
            mapped.general = 'Wrong email/phone or password';
            break;
          case 'INVALID_CREDENTIALS':
            mapped.general = 'Wrong email/phone or password';
            break;
          case 'EMAIL_OR_PHONE_EXISTS':
            mapped.identifier = 'This email or phone is already registered';
            break;
          case 'MISSING_CREDENTIALS':
            mapped.general = 'Missing credentials';
            break;
          default:
            mapped.general = `Sign-in failed (${res.error})`;
        }
        setErrors(mapped);
      } else if (res?.ok) {
        router.replace(callbackUrl);
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Logo / Title */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-xl font-bold text-white">
              V
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {mode === 'signin' ? 'Admin Sign In' : 'Create Admin Account'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {mode === 'signin'
                ? 'Sign in to access the admin panel'
                : 'Register to manage your store'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            {(['signin', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setErrors({});
                }}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === m
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* General error banner */}
          {errors.general && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.general}
            </div>
          )}
          {errorQuery && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Sign-in failed: {errorQuery}
            </div>
          )}

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={!!loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {loading === 'google' ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Credentials form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                {mode === 'signin' ? 'Email or Phone' : 'Email or Phone'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or +49..."
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.identifier ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
              />
              {errors.identifier && (
                <p className="mt-1 text-xs text-red-600">{errors.identifier}</p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 151..."
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                  tabIndex={-1}
                >
                  {showPwd ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors.password2 ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.password2 && (
                  <p className="mt-1 text-xs text-red-600">{errors.password2}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!!loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {loading === 'signin' || loading === 'register' ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Forgot / Switch */}
          {mode === 'signin' ? (
            <div className="mt-5 text-center">
              <p className="text-sm text-slate-500">
                No account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrors({});
                  }}
                  className="font-medium text-brand-700 hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          ) : (
            <div className="mt-5 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrors({});
                  }}
                  className="font-medium text-brand-700 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* Back to store */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
              ← Back to store
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Only authorized accounts can access the admin panel.
        </p>
      </div>
    </div>
  );
}
