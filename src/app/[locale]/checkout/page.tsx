'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { formatPrice, type Locale } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { useSalesData } from '@/store/sales-data';
import { useAnalytics } from '@/store/analytics';
import {
  usePaymentConfig,
  isStripeReady,
  isPayPalReady
} from '@/store/payment-config';

const FREE_SHIPPING_THRESHOLD = 49;

type PaymentMethod = 'card' | 'paypal';

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const tCart = useTranslations('Cart');
  const tPay = useTranslations('Payment');
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useSalesData((s) => s.addOrder);
  const trackEvent = useAnalytics((s) => s.trackEvent);
  const { stripe, paypal, demoMode } = usePaymentConfig();

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // 信用卡表单状态（仅展示）
  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  useEffect(() => {
    setMounted(true);
    // begin_checkout only once if there are items
    if (items.length > 0) {
      const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
      trackEvent('begin_checkout', {
        amount: subtotal,
        quantity: items.reduce((s, i) => s + i.quantity, 0),
        locale
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) {
    return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6" />;
  }

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.95;
  const total = subtotal + shipping;

  const stripeReady = isStripeReady(stripe);
  const paypalReady = isPayPalReady(paypal);

  // 演示模式下两种支付都可展示；非演示模式则需配置就绪
  const cardAvailable = demoMode || stripeReady;
  const paypalAvailable = demoMode || paypalReady;

  function handlePay() {
    setProcessing(true);
    // 演示模式：模拟支付流程
    setTimeout(() => {
      // 保存订单到销售数据
      const subtotal = items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      );
      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.95;
      addOrder({
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          slug: i.product.slug,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image
        })),
        subtotal,
        shipping,
        total: subtotal + shipping,
        currency: 'EUR',
        paymentMethod: method,
        status: 'completed',
        country: 'DE' // 默认德国，后续可接入 IP 定位
      });
      trackEvent('purchase', {
        amount: subtotal + shipping,
        quantity: items.reduce((s, i) => s + i.quantity, 0),
        locale
      });
      setProcessing(false);
      setSuccess(true);
      clearCart();
    }, 1500);
  }

  // 支付成功页
  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          {tPay('successTitle')}
        </h1>
        <p className="mt-3 text-slate-600">{tPay('successDesc')}</p>
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">{tPay('orderNumber')}</span>
            <span className="font-mono font-semibold text-slate-900">
              #VK-{Date.now().toString().slice(-8)}
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-slate-500">{tPay('paymentMethod')}</span>
            <span className="font-semibold text-slate-900">
              {method === 'card' ? tPay('creditCard') : 'PayPal'}
            </span>
          </div>
        </div>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {tPay('continueShopping')}
        </Link>
      </div>
    );
  }

  // 空购物车
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">{tCart('empty')}</h1>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {tCart('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">{t('title')}</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 支付区域 */}
        <div className="order-2 lg:order-1">
          {/* 演示模式提示 */}
          {demoMode && (
            <div className="mb-4 flex gap-3 rounded-lg border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800">
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              <span>{tPay('demoNotice')}</span>
            </div>
          )}

          {/* 支付方式选择 */}
          <div className="mb-4">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              {tPay('selectMethod')}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('card')}
                disabled={!cardAvailable}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  method === 'card'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3M3.75 5.25h16.5c.621 0 1.125.504 1.125 1.125v12c0 .621-.504 1.125-1.125 1.125H3.75c-.621 0-1.125-.504-1.125-1.125v-12c0-.621.504-1.125 1.125-1.125z"
                  />
                </svg>
                {tPay('creditCard')}
              </button>
              <button
                type="button"
                onClick={() => setMethod('paypal')}
                disabled={!paypalAvailable}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  method === 'paypal'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="font-bold italic text-[#003087]">Pay</span>
                <span className="font-bold italic text-[#009cde]">Pal</span>
              </button>
            </div>
          </div>

          {/* 信用卡表单 */}
          {method === 'card' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded bg-[#635bff] px-2 py-0.5 text-xs font-bold text-white">
                  Stripe
                </span>
                <span className="text-xs text-slate-500">
                  {tPay('poweredBy')} Stripe · 3D Secure
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {tPay('cardNumber')}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={card.number}
                    onChange={(e) =>
                      setCard({ ...card, number: e.target.value })
                    }
                    placeholder="4242 4242 4242 4242"
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      {tPay('expiry')}
                    </label>
                    <input
                      type="text"
                      value={card.expiry}
                      onChange={(e) =>
                        setCard({ ...card, expiry: e.target.value })
                      }
                      placeholder="MM/YY"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      {tPay('cvc')}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={card.cvc}
                      onChange={(e) =>
                        setCard({ ...card, cvc: e.target.value })
                      }
                      placeholder="123"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {tPay('nameOnCard')}
                  </label>
                  <input
                    type="text"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                    placeholder="John Doe"
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* 支持的卡种 */}
              <div className="mt-4 flex gap-2 text-xs text-slate-400">
                <span className="rounded border border-slate-200 px-2 py-1 font-semibold">VISA</span>
                <span className="rounded border border-slate-200 px-2 py-1 font-semibold">Mastercard</span>
                <span className="rounded border border-slate-200 px-2 py-1 font-semibold">Amex</span>
              </div>
            </div>
          )}

          {/* PayPal 区域 */}
          {method === 'paypal' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="text-center">
                <p className="text-sm text-slate-600">{tPay('paypalDesc')}</p>
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={processing}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#ffc439] px-8 py-3 text-base font-bold text-[#003087] shadow-sm transition-colors hover:bg-[#f3b820] disabled:opacity-50"
                >
                  {processing ? (
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <span className="font-bold italic">Pay</span>
                  )}
                  {!processing && <span className="font-bold italic">Pal</span>}
                </button>
                <p className="mt-3 text-xs text-slate-400">
                  {tPay('paypalRedirectNote')}
                </p>
              </div>
            </div>
          )}

          {/* 信用卡支付按钮 */}
          {method === 'card' && (
            <button
              type="button"
              onClick={handlePay}
              disabled={processing}
              className="mt-4 w-full rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {processing
                ? tPay('processing')
                : `${tPay('pay')} ${formatPrice(total, locale)}`}
            </button>
          )}

          {/* 安全标识 */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            {tPay('securePayment')}
          </div>

          {/* 未配置提示 */}
          {!demoMode && (!stripeReady || !paypalReady) && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-medium">{tPay('configIncomplete')}</p>
              <p className="mt-1 text-amber-700">{tPay('configIncompleteDesc')}</p>
              <Link
                href="/admin"
                className="mt-2 inline-block font-semibold text-amber-900 underline"
              >
                {tPay('goToAdmin')} →
              </Link>
            </div>
          )}
        </div>

        {/* 订单摘要 */}
        <div className="order-1 lg:order-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {t('cartSummary')}
            </h2>

            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-slate-50">
                    <Image
                      src={item.product.image}
                      alt={item.product.name[locale]}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium text-slate-900">
                      {item.product.name[locale]}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatPrice(item.product.price, locale)} × {item.quantity}
                    </p>
                  </div>
                  <span className="self-center text-sm font-semibold text-slate-900">
                    {formatPrice(item.product.price * item.quantity, locale)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">{tCart('subtotal')}</dt>
                <dd className="font-medium">{formatPrice(subtotal, locale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">{tCart('shipping')}</dt>
                <dd className="font-medium">
                  {shipping === 0
                    ? tCart('free')
                    : formatPrice(shipping, locale)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base">
                <dt className="font-semibold text-slate-900">{tCart('total')}</dt>
                <dd className="font-bold text-slate-900">
                  {formatPrice(total, locale)}
                </dd>
              </div>
              <p className="text-xs text-slate-400">{tPay('vatIncluded')}</p>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
