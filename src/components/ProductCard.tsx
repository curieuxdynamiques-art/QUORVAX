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
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-xl hover:shadow-slate-200/60">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-50">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.ceCertified && (
            <span className="rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              CE
            </span>
          )}
          {product.wireless && (
            <span className="rounded-md bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white">
              Wireless
            </span>
          )}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="mb-4 rounded-full bg-white/95 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg">
            {t('viewDetails')}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
            {product.name[locale]}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {product.description[locale]}
        </p>

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-slate-900">
              {formatPrice(product.price, locale)}
            </span>
            {product.inStock ? (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                {t('inStock')}
              </span>
            ) : (
              <span className="text-xs font-medium text-red-600">{t('outOfStock')}</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
