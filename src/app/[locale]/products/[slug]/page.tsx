import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  products,
  getProductBySlug,
  getRelatedProducts,
  formatPrice,
  type Locale
} from '@/data/products';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';
import ProductDetailTracker from '@/components/ProductDetailTracker';
import ProductTabs from '@/components/ProductTabs';

export function generateStaticParams() {
  return products.flatMap((p) =>
    ['en', 'de', 'fr'].map((locale) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  const name = product.name[params.locale as Locale] ?? product.name.en;
  const description = product.description[params.locale as Locale] ?? product.description.en;
  return {
    title: name,
    description,
    alternates: {
      canonical: `/${params.locale}/products/${params.slug}`,
      languages: {
        en: `/en/products/${params.slug}`,
        de: `/de/products/${params.slug}`,
        fr: `/fr/products/${params.slug}`
      }
    },
    openGraph: {
      title: name,
      description,
      images: [product.image]
    }
  };
}

export default async function ProductDetailPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const t = await getTranslations('Products');
  const tSale = await getTranslations('ProductSale');
  const currentLocale = locale as Locale;

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  // 信任标识
  const trustBadges = [
    { icon: '🚚', label: tSale('freeShipping') },
    { icon: '🛡️', label: tSale('warranty2Year') },
    { icon: '↩️', label: tSale('returns30Day') },
    { icon: '🔒', label: tSale('securePayment') },
  ];

  // 卖点
  const highlights = product.specs.slice(0, 4);

  return (
    <ProductDetailTracker product={product}>
      <div>
        {/* Breadcrumb */}
        <div className="border-b border-slate-100 bg-slate-50">
          <nav className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm text-slate-500 sm:px-6">
            <Link href="/" className="hover:text-brand-600">{tSale('home')}</Link>
            <span>/</span>
            <span className="text-slate-900">{product.name[currentLocale]}</span>
          </nav>
        </div>

        {/* Main product section */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image gallery */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image
                  src={product.image}
                  alt={product.name[currentLocale]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {product.ceCertified && (
                    <span className="rounded-lg bg-slate-900/80 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                      CE
                    </span>
                  )}
                  {product.wireless && (
                    <span className="rounded-lg bg-brand-600 px-3 py-1 text-sm font-semibold text-white">
                      Wireless
                    </span>
                  )}
                </div>
              </div>
              {/* Thumbnail row (using same image as placeholder) */}
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-white ${
                      i === 0 ? 'border-brand-600' : 'border-slate-200'
                    }`}
                  >
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="80px"
                      className={`object-cover ${i === 0 ? 'opacity-100' : 'opacity-40'}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase panel */}
            <div className="flex flex-col">
              {/* Category + badges */}
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
                  {t(`categories.${product.category}`)}
                </span>
                {product.wireless && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                    Wireless
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                {product.name[currentLocale]}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-amber-400">
                  {'★★★★★'.split('').map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-600">4.8</span>
                <span className="text-sm text-slate-400">({tSale('reviewsCount')})</span>
                <span className="ml-2 text-sm text-slate-400">·</span>
                <span className="ml-2 text-sm font-medium text-green-600">
                  {tSale('soldRecently')}
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-end gap-3">
                <span className="text-4xl font-bold text-slate-900">
                  {formatPrice(product.price, currentLocale)}
                </span>
                <span className="pb-1 text-sm text-slate-500">{tSale('vatIncluded')}</span>
              </div>

              {/* Stock */}
              <div className="mt-3">
                {product.inStock ? (
                  <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {tSale('inStock')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-sm font-medium text-red-600">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {tSale('outOfStock')}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="mt-5 leading-relaxed text-slate-600">
                {product.description[currentLocale]}
              </p>

              {/* Add to cart */}
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <AddToCartButton product={product} />
              </div>

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {trustBadges.map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 rounded-lg border border-slate-100 bg-white p-3 text-center">
                    <span className="text-2xl">{b.icon}</span>
                    <span className="text-xs font-medium text-slate-600">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Service links */}
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="text-brand-600">●</span> {tSale('serviceWarranty')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-brand-600">●</span> {tSale('serviceReturns')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-brand-600">●</span> {tSale('serviceSupport')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights section */}
        <section className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900">{tSale('highlights')}</h2>
            <p className="mt-1 text-slate-500">{tSale('highlightsDesc')}</p>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((spec, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <span className="text-lg font-bold">{i + 1}</span>
                  </div>
                  <h3 className="mt-3 font-semibold text-slate-900">
                    {spec.label[currentLocale]}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {spec.value[currentLocale]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs: Specs / Shipping / Reviews */}
        <ProductTabs product={product} />

        {/* Related products */}
        {related.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold text-slate-900">{tSale('youMayAlsoLike')}</h2>
              <Link
                href="/products"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                {tSale('viewAll')} →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* CTA banner */}
        <section className="relative overflow-hidden bg-slate-900">
          <img
            src="/hero-3.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{tSale('ctaTitle')}</h2>
            <p className="mt-3 text-slate-300">{tSale('ctaDesc')}</p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-brand-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {tSale('ctaButton')}
            </Link>
          </div>
        </section>
      </div>
    </ProductDetailTracker>
  );
}
