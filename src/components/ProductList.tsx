'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard from './ProductCard';
import { CATEGORY_LIST, type Product, type ProductCategory, type Locale } from '@/data/products';

type Filter = 'all' | ProductCategory;

const CATEGORY_ORDER: ProductCategory[] = [...CATEGORY_LIST];

export default function ProductList({ products }: { products: Product[] }) {
  const t = useTranslations('Products');
  const locale = useLocale() as Locale;
  const [filter, setFilter] = useState<Filter>('all');

  const filtered =
    filter === 'all' ? products : products.filter((p) => p.category === filter);

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: t('categories.all') },
    ...CATEGORY_ORDER.map((c) => ({
      key: c as Filter,
      label: t(`categories.${c}`)
    }))
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count =
            tab.key === 'all'
              ? products.length
              : products.filter((p) => p.category === tab.key).length;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-slate-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
