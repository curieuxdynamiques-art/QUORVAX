'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import {
  NAV_MENU_FILTERS,
  products,
  filterProducts,
  type ProductFilter
} from '@/data/products';

type PrimaryKey = 'keyboard' | 'mouse' | 'laptop' | 'accessory';

type SubItem = {
  /** Products 页面查询参数 */
  filter: ProductFilter;
  /** 翻译 key（相对于 NavDropdown） */
  labelKey: string;
  /** 展示用图标 emoji */
  icon: string;
};

const PRIMARY: { key: PrimaryKey; labelKey: string; icon: string; items: SubItem[] }[] = [
  {
    key: 'keyboard',
    labelKey: 'keyboard',
    icon: '⌨️',
    items: [
      { filter: NAV_MENU_FILTERS.keyboardWired, labelKey: 'wired', icon: '🔌' },
      { filter: NAV_MENU_FILTERS.keyboardWireless, labelKey: 'wireless', icon: '📶' }
    ]
  },
  {
    key: 'mouse',
    labelKey: 'mouse',
    icon: '🖱️',
    items: [
      { filter: NAV_MENU_FILTERS.mouseWired, labelKey: 'wired', icon: '🔌' },
      { filter: NAV_MENU_FILTERS.mouseWireless, labelKey: 'wireless', icon: '📶' }
    ]
  },
  {
    key: 'laptop',
    labelKey: 'laptop',
    icon: '💻',
    items: [
      { filter: NAV_MENU_FILTERS.laptop, labelKey: 'allLaptops', icon: '💻' }
    ]
  },
  {
    key: 'accessory',
    labelKey: 'accessory',
    icon: '🧩',
    items: [
      { filter: NAV_MENU_FILTERS.mousepad, labelKey: 'mousepad', icon: '🟫' },
      { filter: NAV_MENU_FILTERS.keycap, labelKey: 'keycap', icon: '🔤' },
      { filter: NAV_MENU_FILTERS.charging, labelKey: 'charging', icon: '🔋' }
    ]
  }
];

function buildHref(filter: ProductFilter): string {
  const params = new URLSearchParams();
  if (filter.category) params.set('category', filter.category);
  if (filter.wireless !== undefined) params.set('wireless', String(filter.wireless));
  if (filter.subCategory) params.set('subCategory', filter.subCategory);
  const qs = params.toString();
  return qs ? `/products?${qs}` : '/products';
}

function countFiltered(f: ProductFilter) {
  return filterProducts(products, f).length;
}

/** 桌面端：Hover + 手风琴式二级展开；移动端：点击展开 */
export default function NavDropdown() {
  const t = useTranslations('NavDropdown');
  const tNav = useTranslations('Nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activePrimary, setActivePrimary] = useState<PrimaryKey | null>('laptop');

  const onProductsPage = pathname.startsWith('/products');
  const label = tNav('products');

  return (
    <>
      {/* Desktop */}
      <li
        className="relative hidden md:block"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          setOpen(false);
          setActivePrimary(null);
        }}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            onProductsPage
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          {label}
          <svg
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>


        {open && (
          <div
            className="absolute left-0 top-full z-50 mt-1 w-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5"
            role="menu"
          >
            <div className="grid grid-cols-[200px_1fr]">
              {/* Left: primary */}
              <div className="border-r border-slate-100 bg-slate-50/60 py-2">
                {PRIMARY.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onMouseEnter={() => setActivePrimary(p.key)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                      activePrimary === p.key
                        ? 'bg-white text-brand-700 shadow-sm'
                        : 'text-slate-700 hover:bg-white/70'
                    }`}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <div className="flex-1">
                      <div>{t(p.labelKey)}</div>
                      <div className="text-xs font-normal text-slate-500">
                        {t(`${p.labelKey}Hint`)}
                      </div>
                    </div>
                    <span className="text-slate-400">›</span>
                  </button>
                ))}
              </div>
              {/* Right: sub items */}
              <div className="py-2">
                {PRIMARY.filter((p) => p.key === activePrimary).map((p) =>
                  p.items.map((sub, idx) => {
                    const count = countFiltered(sub.filter);
                    const href = buildHref(sub.filter);
                    return (
                      <Link
                        key={idx}
                        href={href as '/products'}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-50/60"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-base">
                          {sub.icon}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">
                            {t(sub.labelKey)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {count} {t('items')}
                          </div>
                        </div>
                        <svg
                          className="h-4 w-4 text-slate-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
            <div className="border-t border-slate-100 bg-gradient-to-r from-brand-50/80 to-slate-50 px-4 py-3">
              <Link
                href="/products"
                className="flex items-center justify-between text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                <span>{t('viewAllProducts')}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </li>

      {/* Mobile: hand-accordion under Products entry */}
      <li className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium ${
            onProductsPage
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>{label}</span>
          <svg
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="mt-1 space-y-1 rounded-lg border border-slate-200 bg-slate-50/60 p-2">
            {PRIMARY.map((p) => {
              const isActive = activePrimary === p.key;
              return (
                <div key={p.key}>
                  <button
                    type="button"
                    onClick={() => setActivePrimary(isActive ? null : p.key)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
                  >
                    <span className="text-base">{p.icon}</span>
                    <span className="flex-1 text-left">{t(p.labelKey)}</span>
                    <svg
                      className={`h-4 w-4 transition-transform ${
                        isActive ? 'rotate-90' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  {isActive && (
                    <div className="mt-1 space-y-1 pl-9">
                      {p.items.map((sub, idx) => {
                        const href = buildHref(sub.filter);
                        return (
                          <Link
                            key={idx}
                            href={href as '/products'}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-white"
                          >
                            <span>{sub.icon}</span>
                            <span>{t(sub.labelKey)}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </li>
    </>
  );
}
