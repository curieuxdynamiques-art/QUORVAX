'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { type Product, type Locale } from '@/data/products';

type Tab = 'specs' | 'shipping' | 'reviews';

export default function ProductTabs({ product }: { product: Product }) {
  const t = useTranslations('ProductSale');
  const locale = useLocale() as Locale;
  const [active, setActive] = useState<Tab>('specs');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'specs', label: t('tabSpecs') },
    { key: 'shipping', label: t('tabShipping') },
    { key: 'reviews', label: t('tabReviews') },
  ];

  const mockReviews = [
    { name: 'Thomas K.', rating: 5, date: '2025-06-15', text: t('review1') },
    { name: 'Marie L.', rating: 5, date: '2025-05-28', text: t('review2') },
    { name: 'Stefan W.', rating: 4, date: '2025-05-10', text: t('review3') },
  ];

  return (
    <section className="border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Tab bar */}
        <div className="flex gap-1 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`relative px-6 py-3 text-sm font-semibold transition-colors ${
                active === tab.key
                  ? 'text-brand-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {active === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-8">
          {/* Specs */}
          {active === 'specs' && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <dl>
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                  >
                    <dt className="w-1/3 px-5 py-3.5 text-sm font-medium text-slate-500">
                      {spec.label[locale]}
                    </dt>
                    <dd className="flex-1 px-5 py-3.5 text-sm text-slate-900">
                      {spec.value[locale]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Shipping */}
          {active === 'shipping' && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-6" />
                    </svg>
                  </span>
                  <h3 className="font-semibold text-slate-900">{t('shippingTitle')}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{t('shippingDesc')}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </span>
                  <h3 className="font-semibold text-slate-900">{t('warrantyTitle')}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{t('warrantyDesc')}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </span>
                  <h3 className="font-semibold text-slate-900">{t('returnsTitle')}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{t('returnsDesc')}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </span>
                  <h3 className="font-semibold text-slate-900">{t('supportTitle')}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{t('supportDesc')}</p>
              </div>
            </div>
          )}

          {/* Reviews */}
          {active === 'reviews' && (
            <div>
              {/* Summary */}
              <div className="mb-8 flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-8 sm:flex-row sm:gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-slate-900">4.8</div>
                  <div className="mt-2 flex text-amber-400">{'★★★★★'}</div>
                  <div className="mt-1 text-sm text-slate-500">{t('basedOn')} 127 {t('reviews')}</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-4 text-sm text-slate-500">{star}</span>
                      <span className="text-amber-400">★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${star === 5 ? 82 : star === 4 ? 12 : star === 3 ? 4 : star === 2 ? 1 : 1}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm text-slate-500">
                        {star === 5 ? '82%' : star === 4 ? '12%' : star === 3 ? '4%' : '1%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-5">
                {mockReviews.map((review, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{review.name}</div>
                          <div className="flex text-amber-400 text-sm">
                            {'★'.repeat(review.rating)}
                            <span className="text-slate-300">{'★'.repeat(5 - review.rating)}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-slate-400">{review.date}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
