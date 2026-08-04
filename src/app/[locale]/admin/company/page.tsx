'use client';

import { useTranslations } from 'next-intl';
import AdminShell from '@/components/AdminShell';

export default function CompanyInfoPage() {
  const t = useTranslations('Company');

  return (
    <AdminShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
          <p className="mt-1 text-slate-600">{t('subtitle')}</p>
        </div>

        {/* Business Seller Info */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t('businessSeller')}</h2>
              <p className="text-sm text-slate-500">{t('businessSellerDesc')}</p>
            </div>
          </div>

          <dl className="divide-y divide-slate-100">
            <InfoRow label={t('businessName')} value="REMANET TRADING" />
            <InfoRow label={t('businessType')} value={t('privatelyOwned')} />
            <InfoRow label={t('tradeRegisterNumber')} value="994 539 468" />
            <InfoRow label={t('vatNumber')} value="FR72994539468" />
            <InfoRow label={t('businessAddress')} value="19 rue Auguste Chabrières, 75015 Paris" />
          </dl>
        </section>

        {/* Legal Representative Info */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t('legalRepresentative')}</h2>
              <p className="text-sm text-slate-500">{t('legalRepresentativeDesc')}</p>
            </div>
          </div>

          <dl className="divide-y divide-slate-100">
            <InfoRow label={t('surname')} value="Helene EUGENE" />
            <InfoRow label={t('fullName')} value="Maeva Chrystelle Marie" />
            <InfoRow label={t('birthday')} value="23/04/1997" />
            <InfoRow label={t('address')} value="19 rue Auguste Chabrières, 75015 Paris" />
          </dl>
        </section>

        {/* Compliance Notice */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-3">
            <svg className="h-5 w-5 shrink-0 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div className="text-sm text-amber-900">
              <strong>{t('complianceNotice')}</strong>
              <p className="mt-1">{t('complianceDesc')}</p>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
      <dt className="w-full text-sm font-medium text-slate-500 sm:w-56 sm:shrink-0">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
