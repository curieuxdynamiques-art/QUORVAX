import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import CategoryShowcase from '@/components/CategoryShowcase';
import ReviewsSection from '@/components/ReviewsSection';

export default async function HomePage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations('Hero');
  const tf = await getTranslations('Features');
  const tp = await getTranslations('Products');

  const featured = products.slice(0, 8);

  const features = [
    { icon: ShippingIcon, title: tf('shipping.title'), desc: tf('shipping.desc') },
    { icon: ShieldIcon, title: tf('warranty.title'), desc: tf('warranty.desc') },
    { icon: HeadsetIcon, title: tf('support.title'), desc: tf('support.desc') },
    { icon: LockIcon, title: tf('payment.title'), desc: tf('payment.desc') }
  ];

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features bar */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <f.icon />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">{f.title}</h3>
                  <p className="text-[11px] text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{tp('title')}</h2>
            <p className="mt-1 text-sm text-slate-600">{tp('subtitle')}</p>
          </div>
          <Link
            href="/products"
            className="hidden shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:block"
          >
            {t('viewAll')} →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection />

      {/* CTA banner */}
      <section className="relative overflow-hidden bg-slate-900">
        <img
          src="/hero-3.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-10 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {t('ctaTitle')}
          </h2>
          <p className="mt-2 text-base text-slate-300">
            {t('ctaDesc')}
          </p>
          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/30 transition-all hover:bg-brand-700"
          >
            {t('cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}

/* Inline icons */
function ShippingIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-6m6 0V14.25m-6 4.5V14.25m0 0a1.125 1.125 0 00-1.125-1.125H5.625c-.621 0-1.125.504-1.125 1.125v3.75M2.25 6.75c0-.621.504-1.125 1.125-1.125h11.25c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 10.5v-3.75z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  );
}
function HeadsetIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
