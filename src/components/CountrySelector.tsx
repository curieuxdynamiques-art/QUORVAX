'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import type { Locale } from '@/data/products';

const europeanCountries: { code: string; name: Record<string, string>; flag: string }[] = [
  { code: 'AT', flag: '🇦🇹', name: { en: 'Austria', de: 'Österreich', fr: 'Autriche' } },
  { code: 'BE', flag: '🇧🇪', name: { en: 'Belgium', de: 'Belgien', fr: 'Belgique' } },
  { code: 'BG', flag: '🇧🇬', name: { en: 'Bulgaria', de: 'Bulgarien', fr: 'Bulgarie' } },
  { code: 'HR', flag: '🇭🇷', name: { en: 'Croatia', de: 'Kroatien', fr: 'Croatie' } },
  { code: 'CY', flag: '🇨🇾', name: { en: 'Cyprus', de: 'Zypern', fr: 'Chypre' } },
  { code: 'CZ', flag: '🇨🇿', name: { en: 'Czech Republic', de: 'Tschechien', fr: 'Tchéquie' } },
  { code: 'DK', flag: '🇩🇰', name: { en: 'Denmark', de: 'Dänemark', fr: 'Danemark' } },
  { code: 'EE', flag: '🇪🇪', name: { en: 'Estonia', de: 'Estland', fr: 'Estonie' } },
  { code: 'FI', flag: '🇫🇮', name: { en: 'Finland', de: 'Finnland', fr: 'Finlande' } },
  { code: 'FR', flag: '🇫🇷', name: { en: 'France', de: 'Frankreich', fr: 'France' } },
  { code: 'DE', flag: '🇩🇪', name: { en: 'Germany', de: 'Deutschland', fr: 'Allemagne' } },
  { code: 'GR', flag: '🇬🇷', name: { en: 'Greece', de: 'Griechenland', fr: 'Grèce' } },
  { code: 'HU', flag: '🇭🇺', name: { en: 'Hungary', de: 'Ungarn', fr: 'Hongrie' } },
  { code: 'IE', flag: '🇮🇪', name: { en: 'Ireland', de: 'Irland', fr: 'Irlande' } },
  { code: 'IT', flag: '🇮🇹', name: { en: 'Italy', de: 'Italien', fr: 'Italie' } },
  { code: 'LV', flag: '🇱🇻', name: { en: 'Latvia', de: 'Lettland', fr: 'Lettonie' } },
  { code: 'LT', flag: '🇱🇹', name: { en: 'Lithuania', de: 'Litauen', fr: 'Lituanie' } },
  { code: 'LU', flag: '🇱🇺', name: { en: 'Luxembourg', de: 'Luxemburg', fr: 'Luxembourg' } },
  { code: 'MT', flag: '🇲🇹', name: { en: 'Malta', de: 'Malta', fr: 'Malte' } },
  { code: 'NL', flag: '🇳🇱', name: { en: 'Netherlands', de: 'Niederlande', fr: 'Pays-Bas' } },
  { code: 'PL', flag: '🇵🇱', name: { en: 'Poland', de: 'Polen', fr: 'Pologne' } },
  { code: 'PT', flag: '🇵🇹', name: { en: 'Portugal', de: 'Portugal', fr: 'Portugal' } },
  { code: 'RO', flag: '🇷🇴', name: { en: 'Romania', de: 'Rumänien', fr: 'Roumanie' } },
  { code: 'SK', flag: '🇸🇰', name: { en: 'Slovakia', de: 'Slowakei', fr: 'Slovaquie' } },
  { code: 'SI', flag: '🇸🇮', name: { en: 'Slovenia', de: 'Slowenien', fr: 'Slovénie' } },
  { code: 'ES', flag: '🇪🇸', name: { en: 'Spain', de: 'Spanien', fr: 'Espagne' } },
  { code: 'SE', flag: '🇸🇪', name: { en: 'Sweden', de: 'Schweden', fr: 'Suède' } },
  { code: 'GB', flag: '🇬🇧', name: { en: 'United Kingdom', de: 'Vereinigtes Königreich', fr: 'Royaume-Uni' } },
  { code: 'CH', flag: '🇨🇭', name: { en: 'Switzerland', de: 'Schweiz', fr: 'Suisse' } },
  { code: 'NO', flag: '🇳🇴', name: { en: 'Norway', de: 'Norwegen', fr: 'Norvège' } },
  { code: 'IS', flag: '🇮🇸', name: { en: 'Iceland', de: 'Island', fr: 'Islande' } },
  { code: 'RS', flag: '🇷🇸', name: { en: 'Serbia', de: 'Serbien', fr: 'Serbie' } },
  { code: 'UA', flag: '🇺🇦', name: { en: 'Ukraine', de: 'Ukraine', fr: 'Ukraine' } },
  { code: 'MD', flag: '🇲🇩', name: { en: 'Moldova', de: 'Moldau', fr: 'Moldavie' } },
  { code: 'MK', flag: '🇲🇰', name: { en: 'North Macedonia', de: 'Nordmazedonien', fr: 'Macédoine du Nord' } },
  { code: 'AL', flag: '🇦🇱', name: { en: 'Albania', de: 'Albanien', fr: 'Albanie' } },
  { code: 'BA', flag: '🇧🇦', name: { en: 'Bosnia and Herzegovina', de: 'Bosnien und Herzegowina', fr: 'Bosnie-Herzégovine' } },
  { code: 'ME', flag: '🇲🇪', name: { en: 'Montenegro', de: 'Montenegro', fr: 'Monténégro' } },
  { code: 'BY', flag: '🇧🇾', name: { en: 'Belarus', de: 'Belarus', fr: 'Biélorussie' } },
  { code: 'TR', flag: '🇹🇷', name: { en: 'Turkey', de: 'Türkei', fr: 'Turquie' } }
];

export default function CountrySelector({ variant = 'footer' }: { variant?: 'nav' | 'footer' }) {
  const t = useTranslations('Country');
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('FR');

  // 客户端挂载后读取 localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selected-country');
    if (saved) setSelected(saved);
  }, []);

  const current = europeanCountries.find((c) => c.code === selected) ?? europeanCountries[9];

  function getName(c: { name: Record<string, string> }): string {
    return c.name[locale] ?? c.name.en;
  }

  function onSelect(code: string) {
    setSelected(code);
    localStorage.setItem('selected-country', code);
    setOpen(false);
  }

  if (variant === 'nav') {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="text-base leading-none">{current.flag}</span>
          <span className="text-xs font-bold text-slate-600">{current.code}</span>
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
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <ul
              className="absolute right-0 z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
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
                    <span className="flex-1 text-left">{getName(c)}</span>
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

  // footer variant
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
          <span>{getName(current)}</span>
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
                  <span className="flex-1 text-left">{getName(c)}</span>
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
