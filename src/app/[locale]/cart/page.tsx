'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { formatPrice, type Locale } from '@/data/products';
import { useCartStore } from '@/store/cart';

const FREE_SHIPPING_THRESHOLD = 49;

export default function CartPage() {
  const t = useTranslations('Cart');
  const tProducts = useTranslations('Products');
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 避免水合不匹配
  if (!mounted) {
    return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6" />;
  }

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 4.95;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <svg
          className="mx-auto h-16 w-16 text-slate-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272"
          />
        </svg>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">{t('empty')}</h1>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">{t('title')}</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {items.map((item) => (
              <li
                key={item.product.id}
                className="flex gap-4 p-4"
              >
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-50"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name[locale]}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-semibold text-slate-900 hover:text-brand-600"
                    >
                      {item.product.name[locale]}
                    </Link>
                    <span className="font-bold text-slate-900">
                      {formatPrice(item.product.price * item.quantity, locale)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatPrice(item.product.price, locale)} / {tProducts('quantity').toLowerCase()}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-md border border-slate-300">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                      >
                        −
                      </button>
                      <span className="min-w-[2.5rem] text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      {t('remove')}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/products"
            className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            ← {t('continueShopping')}
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {t('subtotal')}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">{t('subtotal')}</dt>
                <dd className="font-medium text-slate-900">
                  {formatPrice(subtotal, locale)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">{t('shipping')}</dt>
                <dd className="font-medium text-slate-900">
                  {shipping === 0 ? t('free') : formatPrice(shipping, locale)}
                </dd>
              </div>
              {shipping > 0 && (
                <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal, locale)} more for free shipping.
                </p>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
                <dt className="font-semibold text-slate-900">{t('total')}</dt>
                <dd className="font-bold text-slate-900">
                  {formatPrice(total, locale)}
                </dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-lg bg-brand-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700"
            >
              {t('checkout')}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
