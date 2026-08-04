'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const europeanCountries: { code: string; name: string; flag: string }[] = [
  { code: 'AT', name: 'Österreich', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'BG', name: 'България', flag: '🇧🇬' },
  { code: 'HR', name: 'Hrvatska', flag: '🇭🇷' },
  { code: 'CY', name: 'Κύπρος', flag: '🇨🇾' },
  { code: 'CZ', name: 'Česko', flag: '🇨🇿' },
  { code: 'DK', name: 'Danmark', flag: '🇩🇰' },
  { code: 'EE', name: 'Eesti', flag: '🇪🇪' },
  { code: 'FI', name: 'Suomi', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
  { code: 'GR', name: 'Ελλάδα', flag: '🇬🇷' },
  { code: 'HU', name: 'Magyarország', flag: '🇭🇺' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'LV', name: 'Latvija', flag: '🇱🇻' },
  { code: 'LT', name: 'Lietuva', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'NL', name: 'Nederland', flag: '🇳🇱' },
  { code: 'PL', name: 'Polska', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'RO', name: 'România', flag: '🇷🇴' },
  { code: 'SK', name: 'Slovensko', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenija', flag: '🇸🇮' },
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'SE', name: 'Sverige', flag: '🇸🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CH', name: 'Schweiz', flag: '🇨🇭' },
  { code: 'NO', name: 'Norge', flag: '🇳🇴' },
  { code: 'IS', name: 'Ísland', flag: '🇮🇸' },
  { code: 'RS', name: 'Srbija', flag: '🇷🇸' },
  { code: 'UA', name: 'Україна', flag: '🇺🇦' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'MK', name: 'Северна Македонија', flag: '🇲🇰' },
  { code: 'AL', name: 'Shqipëria', flag: '🇦🇱' },
  { code: 'BA', name: 'Bosna i Hercegovina', flag: '🇧🇦' },
  { code: 'ME', name: 'Crna Gora', flag: '🇲🇪' },
  { code: 'BY', name: 'Беларусь', flag: '🇧🇾' },
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷' }
];

export default function CountrySelector() {
  const t = useTranslations('Country');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selected-country') || 'FR';
    }
    return 'FR';
  });

  const current = europeanCountries.find((c) => c.code === selected) ?? europeanCountries[9];

  function onSelect(code: string) {
    setSelected(code);
    localStorage.setItem('selected-country', code);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white transition-colors hover:border-slate-600"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="text-base">{current.flag}</span>
          <span>{current.name}</span>
        </span>
        <svg
          className="h-4 w-4 text-slate-400"
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
        <>
          {/* Click-away overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <ul
            className="absolute bottom-full left-0 z-50 mb-2 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
            role="listbox"
          >
            <li className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('selectAnotherCountry')}
            </li>
            {europeanCountries.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => onSelect(c.code)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 ${
                    c.code === selected ? 'font-semibold text-brand-600' : 'text-slate-700'
                  }`}
                  role="option"
                  aria-selected={c.code === selected}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 text-left">{c.name}</span>
                  {c.code === selected && (
                    <svg className="h-4 w-4 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
