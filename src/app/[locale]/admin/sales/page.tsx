'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { formatPrice, type Locale } from '@/data/products';
import { useSalesData } from '@/store/sales-data';
import type { Order, OrderStatus, DailyRevenue, ProductSales, PaymentMethodDist } from '@/store/sales-data';
import AdminShell from '@/components/AdminShell';

const countryNames: Record<string, string> = {
  DE: 'Germany',
  FR: 'France',
  NL: 'Netherlands',
  BE: 'Belgium',
  AT: 'Austria',
  IT: 'Italy',
  ES: 'Spain',
  PL: 'Poland',
  GB: 'United Kingdom'
};

const statusColors: Record<OrderStatus, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-slate-100 text-slate-600'
};

function KpiCard({
  label,
  value,
  icon,
  accent,
  onClick
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-slate-200 bg-white p-5 ${onClick ? 'cursor-pointer transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${accent}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function RevenueChart({ data, locale }: { data: DailyRevenue[]; locale: Locale }) {
  const t = useTranslations('Sales');
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const days = data.slice(-14); // 最近14天

  return (
    <div id="revenue-section" className="rounded-xl border border-slate-200 bg-white p-6 scroll-mt-20">
      <h3 className="text-lg font-semibold text-slate-900">{t('salesTrend')}</h3>
      <div className="mt-4 flex items-end gap-1 overflow-x-auto pb-2">
        {days.map((d) => {
          const h = Math.max((d.revenue / max) * 100, 4);
          const label = d.date.slice(5); // MM-DD
          return (
            <div key={d.date} className="flex flex-col items-center gap-1" style={{ minWidth: 32 }}>
              <div
                className="w-5 rounded-t bg-brand-400 transition-all hover:bg-brand-600"
                style={{ height: `${h}px` }}
                title={`${d.date}: ${formatPrice(d.revenue, locale)} (${d.orders} orders)`}
              />
              <span className="text-[10px] text-slate-400">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductRanking({ products, locale }: { products: ProductSales[]; locale: Locale }) {
  const t = useTranslations('Sales');
  return (
    <div id="products-section" className="rounded-xl border border-slate-200 bg-white p-6 scroll-mt-20">
      <h3 className="text-lg font-semibold text-slate-900">{t('topProducts')}</h3>
      <div className="mt-4 space-y-3">
        {products.slice(0, 5).map((p, i) => (
          <div key={p.productId} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              {i + 1}
            </span>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-slate-50">
              <Image src={p.image} alt={p.name[locale]} fill sizes="40px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{p.name[locale]}</p>
              <p className="text-xs text-slate-500">{p.quantity} {t('sold')}</p>
            </div>
            <span className="text-sm font-semibold text-slate-900">{formatPrice(p.revenue, locale)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentDistribution({ data, locale }: { data: PaymentMethodDist[]; locale: Locale }) {
  const t = useTranslations('Sales');
  return (
    <div id="avg-section" className="rounded-xl border border-slate-200 bg-white p-6 scroll-mt-20">
      <h3 className="text-lg font-semibold text-slate-900">{t('paymentMethods')}</h3>
      <div className="mt-4 space-y-4">
        {data.map((d) => (
          <div key={d.method}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                {d.method === 'card' ? t('creditCardStripe') : 'PayPal'}
              </span>
              <span className="text-slate-500">{d.percentage}%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  d.method === 'card' ? 'bg-[#635bff]' : 'bg-[#003087]'
                }`}
                style={{ width: `${d.percentage}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {d.count} {t('orders')} · {formatPrice(d.revenue, locale)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountryDistribution({ orders }: { orders: Order[] }) {
  const t = useTranslations('Sales');
  const map = useMemo(() => {
    const m = new Map<string, { count: number; revenue: number }>();
    orders.filter((o) => o.status === 'completed').forEach((o) => {
      const c = o.country ?? 'Unknown';
      const existing = m.get(c);
      if (existing) {
        existing.count += 1;
        existing.revenue += o.total;
      } else {
        m.set(c, { count: 1, revenue: o.total });
      }
    });
    return Array.from(m.entries())
      .map(([code, v]) => ({ code, ...v }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  const max = Math.max(...map.map((d) => d.revenue), 1);

  return (
    <div id="refund-section" className="rounded-xl border border-slate-200 bg-white p-6 scroll-mt-20">
      <h3 className="text-lg font-semibold text-slate-900">{t('salesByCountry')}</h3>
      <div className="mt-4 space-y-3">
        {map.slice(0, 8).map((c) => (
          <div key={c.code} className="flex items-center gap-3">
            <span className="w-8 text-sm font-bold text-slate-600">{c.code}</span>
            <span className="w-24 text-xs text-slate-500">{countryNames[c.code] ?? c.code}</span>
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${(c.revenue / max) * 100}%` }}
                />
              </div>
            </div>
            <span className="w-16 text-right text-xs font-medium text-slate-700">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentOrders({ orders, locale }: { orders: Order[]; locale: Locale }) {
  const t = useTranslations('Sales');
  const [expanded, setExpanded] = useState(false);
  const displayCount = expanded ? orders.length : 5;
  const visible = orders.slice(0, displayCount);
  const hiddenCount = orders.length - displayCount;

  return (
    <div id="orders-section" className="rounded-xl border border-slate-200 bg-white p-6 scroll-mt-20">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{t('recentOrders')}</h3>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          {expanded ? (
            <>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
              {t('collapse')}
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {t('showAllOrders', { count: orders.length })}
            </>
          )}
        </button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="pb-2 pr-4">{t('orderId')}</th>
              <th className="pb-2 pr-4">{t('date')}</th>
              <th className="pb-2 pr-4">{t('items')}</th>
              <th className="pb-2 pr-4">{t('country')}</th>
              <th className="pb-2 pr-4">{t('payment')}</th>
              <th className="pb-2 pr-4">{t('status')}</th>
              <th className="pb-2 text-right">{t('total')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="py-3 pr-4 font-mono text-xs text-slate-600">{o.id}</td>
                <td className="py-3 pr-4 text-slate-600">
                  {new Date(o.createdAt).toLocaleDateString(locale === 'en' ? 'en-IE' : locale === 'de' ? 'de-DE' : 'fr-FR')}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-1">
                    {o.items.map((it, idx) => (
                      <span key={`${it.productId}-${idx}`} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {it.name[locale]} ×{it.quantity}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 pr-4 text-slate-600">{o.country ?? '-'}</td>
                <td className="py-3 pr-4">
                  <span className="text-xs font-medium text-slate-600">
                    {o.paymentMethod === 'card' ? t('card') : 'PayPal'}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="py-3 text-right font-semibold text-slate-900">
                  {formatPrice(o.total, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function SalesDashboardPage() {
  const t = useTranslations('Sales');
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);

  const store = useSalesData();
  const stats = store.getStats();
  const daily = store.getDailyRevenue(30);
  const products = store.getProductSales();
  const payments = store.getPaymentMethodDistribution();
  const recent = store.getRecentOrders(30);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <AdminShell><div className="p-8" /></AdminShell>;
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
            <p className="mt-1 text-slate-600">{t('subtitle')}</p>
          </div>
        </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t('totalRevenue')}
          value={formatPrice(stats.totalRevenue, locale)}
          icon={<svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          accent="bg-green-50"
          onClick={() => scrollTo('revenue-section')}
        />
        <KpiCard
          label={t('totalOrders')}
          value={stats.totalOrders.toString()}
          icon={<svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>}
          accent="bg-blue-50"
          onClick={() => scrollTo('orders-section')}
        />
        <KpiCard
          label={t('avgOrderValue')}
          value={formatPrice(stats.avgOrderValue, locale)}
          icon={<svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
          accent="bg-purple-50"
          onClick={() => scrollTo('avg-section')}
        />
        <KpiCard
          label={t('refundedOrders')}
          value={stats.refundedOrders.toString()}
          icon={<svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>}
          accent="bg-red-50"
          onClick={() => scrollTo('refund-section')}
        />
      </div>

      {/* Chart + Rankings */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={daily} locale={locale} />
        </div>
        <ProductRanking products={products} locale={locale} />
      </div>

      {/* Payment + Country */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PaymentDistribution data={payments} locale={locale} />
        <CountryDistribution orders={store.getOrders()} />
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recent} locale={locale} />
    </div>
    </AdminShell>
  );
}
