'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/data/products';
import { useAnalytics } from '@/store/analytics';
import type {
  DailyTraffic,
  PageTypeStat,
  DeviceType,
  FunnelStep
} from '@/store/analytics';
import AdminShell from '@/components/AdminShell';

type Duration = 7 | 14 | 30;

function fmtNum(n: number) {
  return new Intl.NumberFormat().format(Math.round(n));
}

function fmtDuration(sec: number) {
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m ${s}s`;
}

type KpiCardProps = {
  label: string;
  value: string;
  sub?: string;
  accent: string;
};

function KpiCard({ label, value, sub, accent }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function TrafficChart({ data }: { data: DailyTraffic[] }) {
  const max = Math.max(1, ...data.map((d) => d.pageViews));
  const w = 760;
  const h = 220;
  const pad = { l: 36, r: 12, t: 16, b: 28 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const step = data.length > 1 ? innerW / (data.length - 1) : innerW;

  function x(i: number) {
    return pad.l + i * step;
  }
  function y(v: number) {
    return pad.t + innerH - (v / max) * innerH;
  }

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.pageViews)}`)
    .join(' ');
  const areaPath =
    linePath +
    ` L ${x(data.length - 1)} ${pad.t + innerH} L ${x(0)} ${pad.t + innerH} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(max * r));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="trafficArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((tv, i) => {
        const yy = pad.t + innerH - (tv / max) * innerH;
        return (
          <g key={i}>
            <line
              x1={pad.l}
              x2={w - pad.r}
              y1={yy}
              y2={yy}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />
            <text
              x={pad.l - 8}
              y={yy + 4}
              fontSize="10"
              textAnchor="end"
              fill="#64748b"
            >
              {tv}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#trafficArea)" />
      <path d={linePath} stroke="#2563eb" strokeWidth="2" fill="none" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.pageViews)} r="3" fill="#2563eb" />
          {i % Math.max(1, Math.floor(data.length / 6)) === 0 && (
            <text
              x={x(i)}
              y={h - 10}
              fontSize="10"
              textAnchor="middle"
              fill="#64748b"
            >
              {d.date.slice(5)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

function DeviceChart({
  data
}: {
  data: { device: DeviceType; count: number }[];
}) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const labels: Record<DeviceType, string> = {
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile'
  };
  const colors: Record<DeviceType, string> = {
    desktop: '#2563eb',
    tablet: '#8b5cf6',
    mobile: '#10b981'
  };
  let acc = 0;
  const r = 70;
  const cx = 90;
  const cy = 90;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
      <svg viewBox="0 0 180 180" className="h-44 w-44">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="22"
        />
        {data.map((d) => {
          const frac = d.count / total;
          const dash = frac * circ;
          const offset = circ - (acc / total) * circ;
          acc += d.count;
          return (
            <circle
              key={d.device}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={colors[d.device]}
              strokeWidth="22"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontSize="14"
          fill="#64748b"
        >
          Total
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#0f172a"
        >
          {fmtNum(total)}
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.device} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: colors[d.device] }}
            />
            <span className="w-20 font-medium text-slate-700">
              {labels[d.device]}
            </span>
            <span className="w-16 text-right text-slate-500">
              {fmtNum(d.count)}
            </span>
            <span className="text-slate-500">
              {Math.round((d.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PageTypeStats({ data }: { data: PageTypeStat[] }) {
  const total = data.reduce((s, d) => s + d.views, 0) || 1;
  const typeLabels: Record<string, string> = {
    home: 'Home',
    products: 'Products List',
    product_detail: 'Product Detail',
    cart: 'Cart',
    checkout: 'Checkout',
    about: 'About',
    contact: 'Contact',
    admin: 'Admin Home',
    admin_products: 'Admin Products',
    admin_sales: 'Admin Sales',
    admin_analytics: 'Admin Analytics',
    other: 'Other'
  };
  return (
    <div className="space-y-3">
      {data
        .sort((a, b) => b.views - a.views)
        .map((s) => (
          <div key={s.pageType}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-slate-700">
                {typeLabels[s.pageType] ?? s.pageType}
              </span>
              <span className="text-slate-500">
                {fmtNum(s.views)} · {Math.round((s.views / total) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${(s.views / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
    </div>
  );
}

function Funnel({ steps }: { steps: FunnelStep[] }) {
  const max = Math.max(1, steps[0]?.count ?? 1);
  const colors = [
    'bg-slate-600',
    'bg-brand-600',
    'bg-indigo-500',
    'bg-emerald-500',
    'bg-amber-500'
  ];
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={s.step} className="flex items-center gap-3">
          <div className="w-28 shrink-0 text-sm font-medium text-slate-700">
            {s.label}
          </div>
          <div className="flex-1">
            <div className="h-8 w-full rounded-md bg-slate-100">
              <div
                className={`${colors[i % colors.length]} flex h-full items-center justify-between rounded-md px-3 text-xs font-semibold text-white`}
                style={{ width: `${Math.max(3, (s.count / max) * 100)}%` }}
              >
                <span>{fmtNum(s.count)}</span>
                <span className="opacity-90">{s.rate}%</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsDashboardPage() {
  const t = useTranslations('Analytics');
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);
  const [duration, setDuration] = useState<Duration>(14);

  useEffect(() => {
    setMounted(true);
  }, []);

  const store = useAnalytics();
  const overview = useMemo(
    () => store.getOverview(duration),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, mounted, duration]
  );
  const daily = useMemo(
    () => store.getDailyTraffic(duration),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, mounted, duration]
  );
  const pageTypes = useMemo(
    () => store.getPageTypeStats(duration),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, mounted, duration]
  );
  const topProductViews = useMemo(
    () => store.getTopProductsViewed(duration, 8),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, mounted, duration]
  );
  const topAddedProducts = useMemo(
    () => store.getTopProductsAddedToCart(duration, 8),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, mounted, duration]
  );
  const devices = useMemo(
    () => store.getDeviceDistribution(duration),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, mounted, duration]
  );
  const funnel = useMemo(
    () => store.getFunnel(duration),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, mounted, duration]
  );
  const topPages = useMemo(
    () => store.getTopPages(duration, 8),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, mounted, duration]
  );

  if (!mounted) {
    return (
      <AdminShell>
        <div className="p-8" />
      </AdminShell>
    );
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
          <div className="flex items-center gap-3">
            <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">
              {([7, 14, 30] as Duration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    duration === d
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t('days', { d })}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm(t('clearConfirm'))) store.clearAll();
              }}
              className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              {t('clearData')}
            </button>
          </div>
        </div>

        {/* KPI */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label={t('kpi.pageViews')}
            value={fmtNum(overview.pageViews)}
            sub={`${t('kpi.uniqueSessions')}: ${fmtNum(overview.uniqueSessions)}`}
            accent="text-slate-900"
          />
          <KpiCard
            label={t('kpi.events')}
            value={fmtNum(overview.events)}
            sub={t('kpi.eventsSub')}
            accent="text-brand-700"
          />
          <KpiCard
            label={t('kpi.avgSessionDuration')}
            value={fmtDuration(overview.avgSessionDuration)}
            sub={t('kpi.sessionDurationSub')}
            accent="text-emerald-700"
          />
          <KpiCard
            label={t('kpi.viewsPerSession')}
            value={
              overview.uniqueSessions
                ? (overview.pageViews / overview.uniqueSessions).toFixed(1)
                : '0'
            }
            sub={t('kpi.viewsPerSessionSub')}
            accent="text-indigo-700"
          />
        </div>

        {/* Traffic Chart */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {t('traffic.title')}
          </h2>
          <TrafficChart data={daily} />
        </section>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Device */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {t('device.title')}
            </h2>
            <DeviceChart data={devices} />
          </section>

          {/* Page Type */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {t('pageTypes.title')}
            </h2>
            <PageTypeStats data={pageTypes} />
          </section>
        </div>

        {/* Funnel */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {t('funnel.title')}
          </h2>
          <Funnel steps={funnel} />
        </section>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Product Views */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {t('topProducts.title')}
            </h2>
            {topProductViews.length === 0 ? (
              <p className="text-sm text-slate-500">{t('noData')}</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-2">#</th>
                    <th className="py-2">{t('topProducts.name')}</th>
                    <th className="py-2 text-right">{t('topProducts.views')}</th>
                  </tr>
                </thead>
                <tbody>
                  {topProductViews.map((p, i) => (
                    <tr key={p.productId} className="border-b border-slate-100">
                      <td className="py-2 text-slate-500">{i + 1}</td>
                      <td className="py-2 font-medium text-slate-800">
                        {p.productName || p.productId}
                      </td>
                      <td className="py-2 text-right font-semibold text-slate-800">
                        {fmtNum(p.views)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Top Added Products */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {t('topAdded.title')}
            </h2>
            {topAddedProducts.length === 0 ? (
              <p className="text-sm text-slate-500">{t('noData')}</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-2">#</th>
                    <th className="py-2">{t('topAdded.name')}</th>
                    <th className="py-2 text-right">{t('topAdded.count')}</th>
                  </tr>
                </thead>
                <tbody>
                  {topAddedProducts.map((p, i) => (
                    <tr key={p.productId} className="border-b border-slate-100">
                      <td className="py-2 text-slate-500">{i + 1}</td>
                      <td className="py-2 font-medium text-slate-800">
                        {p.productName || p.productId}
                      </td>
                      <td className="py-2 text-right font-semibold text-slate-800">
                        {fmtNum(p.count)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        {/* Top Pages */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {t('topPages.title')}
          </h2>
          {topPages.length === 0 ? (
            <p className="text-sm text-slate-500">{t('noData')}</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2">#</th>
                  <th className="py-2">{t('topPages.path')}</th>
                  <th className="py-2 text-right">{t('topPages.views')}</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 text-slate-500">{i + 1}</td>
                    <td className="py-2 font-mono text-slate-800">{p.path}</td>
                    <td className="py-2 text-right font-semibold text-slate-800">
                      {fmtNum(p.views)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
