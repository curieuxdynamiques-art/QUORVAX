'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const STORAGE_KEY = 'eu-tech-cookie-consent';

export default function CookieConsent() {
  const t = useTranslations('Cookie');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // 忽略隐私模式等异常
    }
  }, []);

  function save(value: 'all' | 'necessary') {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-slate-900">{t('title')}</h2>
          <p className="mt-1 text-xs text-slate-600">
            {t('desc')}{' '}
            <Link href="/privacy-policy" className="font-medium text-brand-600 underline">
              {t('learnMore')}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => save('necessary')}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('acceptNecessary')}
          </button>
          <button
            type="button"
            onClick={() => save('all')}
            className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {t('acceptAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
