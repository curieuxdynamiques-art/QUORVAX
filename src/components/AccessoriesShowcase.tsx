import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

export default async function AccessoriesShowcase() {
  const t = await getTranslations('Accessories');
  const accessories = products.filter((p) => p.category === 'accessory').slice(0, 4);

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white">
      {/* Banner */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src="/accessories-banner.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-600/90 px-4 py-1.5 text-sm font-semibold text-white">
                {t('badge')}
              </span>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                {t('title')}
              </h2>
              <p className="mt-3 text-lg text-white/80">
                {t('desc')}
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
              >
                {t('cta')} →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {accessories.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
