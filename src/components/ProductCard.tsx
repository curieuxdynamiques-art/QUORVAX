'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { formatPrice, type Product, type Locale } from '@/data/products';
import { useCartStore } from '@/store/cart';

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('Products');
  const locale = useLocale() as Locale;
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-50">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.ceCertified && (
          <span className="absolute left-2 top-2 rounded bg-slate-900/80 px-2 py-0.5 text-xs font-semibold text-white">
            CE
          </span>
        )}
        {product.wireless && (
          <span className="absolute right-2 top-2 rounded bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
            Wireless
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-semibold text-slate-900 group-hover:text-brand-600">
            {product.name[locale]}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {product.description[locale]}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(product.price, locale)}
          </span>
          {product.inStock ? (
            <span className="text-xs font-medium text-green-600">{t('inStock')}</span>
          ) : (
            <span className="text-xs font-medium text-red-600">{t('outOfStock')}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => addItem(product)}
          disabled={!product.inStock}
          className="mt-3 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {t('addToCart')}
        </button>
      </div>
    </div>
  );
}
