'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 10l6-6 6 6M6 14l6 6 6-6" />
                </svg>
              </span>
              <span className="text-lg font-bold text-slate-900">
                VoltKey<span className="text-brand-600">.eu</span>
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {t('newsletterDesc')}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                placeholder={t('emailPlaceholder')}
                className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900">
              {t('company')}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/about" className="hover:text-brand-600">
                  {t('company')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900">
              {t('legal')}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-600">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-600">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-brand-600">
                  {t('returns')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900">
              {t('support')}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/shipping" className="hover:text-brand-600">
                  {t('shipping')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-600">
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-center text-sm text-slate-500">
            © {year} VoltKey.eu. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
