'use client';

import { useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';

type NavItem = {
  href: '/admin' | '/admin/products' | '/admin/sales' | '/admin/analytics' | '/admin/company';
  icon: string;
  labelKey: 'payment' | 'products' | 'sales' | 'analytics' | 'company';
};

const navItems: NavItem[] = [
  { href: '/admin', icon: '💳', labelKey: 'payment' },
  { href: '/admin/products', icon: '📦', labelKey: 'products' },
  { href: '/admin/sales', icon: '📊', labelKey: 'sales' },
  { href: '/admin/analytics', icon: '📈', labelKey: 'analytics' },
  { href: '/admin/company', icon: '🏛️', labelKey: 'company' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('AdminNav');
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin' || pathname.endsWith('/admin');
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <span className="text-lg font-bold text-slate-900">{t('title')}</span>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Logo / Title */}
            <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
              <span className="text-xl">🛒</span>
              <span className="text-lg font-bold text-slate-900">{t('title')}</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>

            {/* Back to store + User info + Logout */}
            <div className="border-t border-slate-200 p-3">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              >
                <span className="text-base">←</span>
                {t('backToStore')}
              </Link>
              {session?.user && (
                <div className="mt-2 border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-2 px-3 py-2">
                    {session.user.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name || ''}
                        className="h-7 w-7 rounded-full"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-700">
                        {session.user.name || session.user.email}
                      </p>
                      <p className="truncate text-[10px] text-slate-400">
                        {(session.user as { login?: string }).login || session.user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <span className="text-base">⏻</span>
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
