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

// 为每个 locale + slug 组合生成静态页面
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
  const currentLocale = locale as Locale;

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <ProductDetailTracker product={product}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-600">
          {t('title')}
        </Link>
        <span>/</span>
        <span className="text-slate-900">{product.name[currentLocale]}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <Image
            src={product.image}
            alt={product.name[currentLocale]}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {product.ceCertified && (
            <span className="absolute left-4 top-4 rounded bg-slate-900/80 px-3 py-1 text-sm font-semibold text-white">
              CE Certified
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-700">
              {t(`categories.${product.category}`)}
            </span>
            {product.wireless && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-green-700">
                Wireless
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            {product.name[currentLocale]}
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-3xl font-bold text-slate-900">
              {formatPrice(product.price, currentLocale)}
            </span>
            <span className="text-sm text-slate-500">VAT included</span>
            {product.inStock ? (
              <span className="ml-auto text-sm font-medium text-green-600">
                ● {t('inStock')}
              </span>
            ) : (
              <span className="ml-auto text-sm font-medium text-red-600">
                ● {t('outOfStock')}
              </span>
            )}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {t('description')}
            </h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              {product.description[currentLocale]}
            </p>
          </div>

          {/* Add to cart */}
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          {/* Specs */}
          <div className="mt-10 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900">{t('specs')}</h2>
            <dl className="mt-4 divide-y divide-slate-100">
              {product.specs.map((spec, i) => (
                <div key={i} className="flex py-3">
                  <dt className="w-1/3 text-sm font-medium text-slate-500">
                    {spec.label[currentLocale]}
                  </dt>
                  <dd className="flex-1 text-sm text-slate-900">
                    {spec.value[currentLocale]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900">
            {t('relatedProducts')}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
      </div>
    </ProductDetailTracker>
  );
}
