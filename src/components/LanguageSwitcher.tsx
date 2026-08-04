'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import type { Locale } from '@/data/products';

const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'de', label: 'Deutsch', flag: 'DE' },
  { code: 'fr', label: 'Français', flag: 'FR' }
];

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);

  const current = locales.find((l) => l.code === locale) ?? locales[0];

  function onSelect(next: Locale) {
    if (next === locale) {
      setOpen(false);
      return;
    }

    // 获取当前完整路径，去掉 locale 前缀，拼接新 locale
    const fullPath = window.location.pathname;
    const stripped = fullPath.replace(/^\/(en|de|fr)(?=\/|$)/, '') || '/';
    window.location.href = `/${next}${stripped === '/' ? '' : stripped}`;
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-bold text-slate-700">
          {current.flag}
        </span>
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <ul
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {locales.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                onClick={() => onSelect(l.code)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 ${
                  l.code === locale ? 'font-semibold text-brand-600' : 'text-slate-700'
                }`}
                role="option"
                aria-selected={l.code === locale}
              >
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-bold">
                  {l.flag}
                </span>
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
