'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import AdminShell from '@/components/AdminShell';
import {
  usePaymentConfig,
  isStripeReady,
  isPayPalReady
} from '@/store/payment-config';

export default function AdminPage() {
  const t = useTranslations('Admin');
  const {
    stripe,
    paypal,
    demoMode,
    updateStripe,
    updatePayPal,
    setDemoMode,
    reset
  } = usePaymentConfig();

  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<
    Record<'stripe' | 'paypal', 'idle' | 'testing' | 'ok' | 'fail'>
  >({ stripe: 'idle', paypal: 'idle' });

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function testStripe() {
    setTestResult((r) => ({ ...r, stripe: 'testing' }));
    setTimeout(() => {
      setTestResult((r) => ({
        ...r,
        stripe: isStripeReady(stripe) ? 'ok' : 'fail'
      }));
    }, 800);
  }

  function testPayPal() {
    setTestResult((r) => ({ ...r, paypal: 'testing' }));
    setTimeout(() => {
      setTestResult((r) => ({
        ...r,
        paypal: isPayPalReady(paypal) ? 'ok' : 'fail'
      }));
    }, 800);
  }

  if (!mounted) {
    return <AdminShell><div className="p-8" /></AdminShell>;
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
          <p className="mt-1 text-slate-600">{t('subtitle')}</p>
        </div>

        {/* 安全提示 */}
        <div className="mb-8 flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <svg className="h-5 w-5 shrink-0 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div className="text-sm text-amber-800">
            <strong>{t('securityNotice')}</strong>
            <p className="mt-1">{t('securityDesc')}</p>
          </div>
        </div>

        {/* 演示模式开关 */}
        <div className="mb-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <h3 className="font-semibold text-slate-900">{t('demoMode')}</h3>
            <p className="mt-1 text-sm text-slate-600">{t('demoModeDesc')}</p>
          </div>
          <button
            type="button"
            onClick={() => setDemoMode(!demoMode)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${demoMode ? 'bg-brand-600' : 'bg-slate-300'}`}
            aria-pressed={demoMode}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${demoMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Stripe 配置 */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-12 items-center justify-center rounded bg-[#635bff] text-xs font-bold text-white">Stripe</span>
              <div>
                <h2 className="font-semibold text-slate-900">{t('stripe.title')}</h2>
                <p className="text-sm text-slate-500">{t('stripe.desc')}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${isStripeReady(stripe) ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
              {isStripeReady(stripe) ? t('statusReady') : t('statusNotReady')}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input id="stripe-enabled" type="checkbox" checked={stripe.enabled} onChange={(e) => updateStripe({ enabled: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <label htmlFor="stripe-enabled" className="text-sm font-medium text-slate-700">{t('enable')}</label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('stripe.publishableKey')}</label>
              <input type="text" value={stripe.publishableKey} onChange={(e) => updateStripe({ publishableKey: e.target.value })} placeholder="pk_live_... or pk_test_..." className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('stripe.secretKey')}</label>
              <input type="password" value={stripe.secretKey} onChange={(e) => updateStripe({ secretKey: e.target.value })} placeholder="sk_live_... or sk_test_..." className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
          </div>

          <div className="mt-4">
            <button type="button" onClick={testStripe} disabled={testResult.stripe === 'testing'} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              {testResult.stripe === 'testing' ? t('testing') : t('testConnection')}
            </button>
            {testResult.stripe === 'ok' && <span className="ml-3 text-sm font-medium text-green-600">✓ {t('testOk')}</span>}
            {testResult.stripe === 'fail' && <span className="ml-3 text-sm font-medium text-red-600">✗ {t('testFail')}</span>}
          </div>
        </section>

        {/* PayPal 配置 */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-12 items-center justify-center rounded bg-[#003087] text-xs font-bold text-white">PayPal</span>
              <div>
                <h2 className="font-semibold text-slate-900">{t('paypal.title')}</h2>
                <p className="text-sm text-slate-500">{t('paypal.desc')}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${isPayPalReady(paypal) ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
              {isPayPalReady(paypal) ? t('statusReady') : t('statusNotReady')}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input id="paypal-enabled" type="checkbox" checked={paypal.enabled} onChange={(e) => updatePayPal({ enabled: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <label htmlFor="paypal-enabled" className="text-sm font-medium text-slate-700">{t('enable')}</label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('paypal.clientId')}</label>
              <input type="text" value={paypal.clientId} onChange={(e) => updatePayPal({ clientId: e.target.value })} placeholder="AY... or sandbox ..." className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('paypal.clientSecret')}</label>
              <input type="password" value={paypal.clientSecret} onChange={(e) => updatePayPal({ clientSecret: e.target.value })} placeholder="EOj..." className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
          </div>

          <div className="mt-4">
            <button type="button" onClick={testPayPal} disabled={testResult.paypal === 'testing'} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              {testResult.paypal === 'testing' ? t('testing') : t('testConnection')}
            </button>
            {testResult.paypal === 'ok' && <span className="ml-3 text-sm font-medium text-green-600">✓ {t('testOk')}</span>}
            {testResult.paypal === 'fail' && <span className="ml-3 text-sm font-medium text-red-600">✗ {t('testFail')}</span>}
          </div>
        </section>

        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={handleSave} className="rounded-md bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">{t('save')}</button>
          <button type="button" onClick={reset} className="rounded-md border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">{t('reset')}</button>
          {saved && <span className="text-sm font-medium text-green-600">✓ {t('saved')}</span>}
          <Link href="/checkout" className="ml-auto text-sm font-semibold text-brand-600 hover:text-brand-700">{t('goToCheckout')} →</Link>
        </div>

        {/* 获取密钥指引 */}
        <section className="mt-12 rounded-xl bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">{t('guide.title')}</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-medium text-slate-900">{t('guide.stripe.title')}</h3>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-600">
                <li>{t('guide.stripe.step1')}</li>
                <li>{t('guide.stripe.step2')}</li>
                <li>{t('guide.stripe.step3')}</li>
                <li>{t('guide.stripe.step4')}</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">{t('guide.paypal.title')}</h3>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-600">
                <li>{t('guide.paypal.step1')}</li>
                <li>{t('guide.paypal.step2')}</li>
                <li>{t('guide.paypal.step3')}</li>
                <li>{t('guide.paypal.step4')}</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
