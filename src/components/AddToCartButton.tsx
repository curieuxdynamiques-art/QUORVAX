'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { formatPrice, type Product, type Locale } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { useAnalytics } from '@/store/analytics';

export default function AddToCartButton({ product }: { product: Product }) {
  const t = useTranslations('Products');
  const tCart = useTranslations('Cart');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const trackEvent = useAnalytics((s) => s.trackEvent);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const name = product.name[locale] ?? product.name.en;

  function handleAdd() {
    addItem(product, qty);
    trackEvent('add_to_cart', {
      productId: product.id,
      productName: name,
      amount: product.price * qty,
      quantity: qty,
      locale
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-700">
          {tCart('quantity')}
        </span>
        <div className="flex items-center rounded-lg border border-slate-300">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-slate-600 hover:bg-slate-100"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[3rem] text-center text-sm font-semibold">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2 text-slate-600 hover:bg-slate-100"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span className="ml-auto text-sm text-slate-500">
          {formatPrice(product.price * qty, locale)}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="flex-1 rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {added ? '✓ Added!' : t('addToCart')}
        </button>
        <button
          type="button"
          onClick={() => {
            addItem(product, qty);
            router.push('/checkout');
          }}
          disabled={!product.inStock}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {tCart('checkout')}
        </button>
      </div>
    </div>
  );
}
