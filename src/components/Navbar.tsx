'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import NavDropdown from './NavDropdown';
import { useCartStore } from '@/store/cart';

export default function Navbar() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // 仅在客户端读取购物车数量（避免 hydration mismatch）
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  useEffect(() => {
    setMounted(true);
  }, []);

  const simpleLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/about' as const, label: t('about') },
    { href: '/contact' as const, label: t('contact') },
    { href: '/faq' as const, label: t('faq') }
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 10l6-6 6 6M6 14l6 6 6-6" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            VoltKey<span className="text-brand-600">.eu</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {simpleLinks.map((l) =>
            l.href === '/' ? (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(l.href)
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ) : null
          )}
          {/* 产品下拉菜单 */}
          <NavDropdown />
          {simpleLinks.map((l) =>
            l.href !== '/' ? (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(l.href)
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ) : null
          )}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/cart"
            className="relative rounded-md p-2 text-slate-700 hover:bg-slate-100"
            aria-label={t('cart')}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <ul className="space-y-1 px-4 py-3">
            {simpleLinks.map((l) =>
              l.href === '/' ? (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-3 py-2 text-base font-medium ${
                      isActive(l.href)
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ) : null
            )}
            {/* 产品下拉菜单（移动端手风琴版本） */}
            <NavDropdown />
            {simpleLinks.map((l) =>
              l.href !== '/' ? (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-3 py-2 text-base font-medium ${
                      isActive(l.href)
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
