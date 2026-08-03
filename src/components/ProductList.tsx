'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductCard from './ProductCard';
import {
  CATEGORY_LIST,
  type Product,
  type ProductCategory,
  type ProductFilter
} from '@/data/products';

type CategoryFilter = 'all' | ProductCategory;

const CATEGORY_ORDER: ProductCategory[] = [...CATEGORY_LIST];

function matches(p: Product, f: {
  cat: CategoryFilter;
  wireless?: boolean;
  subCategory?: ProductFilter['subCategory'];
}) {
  if (f.cat !== 'all' && p.category !== f.cat) return false;
  if (f.wireless !== undefined && p.wireless !== f.wireless) return false;
  if (f.subCategory && p.subCategory !== f.subCategory) return false;
  return true;
}

export default function ProductList({
  products,
  initialFilter
}: {
  products: Product[];
  initialFilter?: ProductFilter;
}) {
  const t = useTranslations('Products');
  const initialCategory: CategoryFilter =
    (initialFilter?.category as CategoryFilter) ?? 'all';
  const [filter, setFilter] = useState<CategoryFilter>(initialCategory);

  const f = useMemo(
    () => ({
      cat: filter,
      wireless: initialFilter?.wireless,
      subCategory: initialFilter?.subCategory
    }),
    [filter, initialFilter?.wireless, initialFilter?.subCategory]
  );

  const filtered = products.filter((p) => matches(p, f));

  const tabs: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: t('categories.all') },
    ...CATEGORY_ORDER.map((c) => ({
      key: c as CategoryFilter,
      label: t(`categories.${c}`)
    }))
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count = products.filter((p) =>
            matches(p, {
              cat: tab.key,
              wireless: initialFilter?.wireless,
              subCategory: initialFilter?.subCategory
            })
          ).length;
          if (count === 0 && tab.key !== 'all') return null;
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
