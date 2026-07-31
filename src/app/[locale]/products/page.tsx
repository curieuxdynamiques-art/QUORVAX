import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { products } from '@/data/products';
import ProductList from '@/components/ProductList';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'Products' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `/${params.locale}/products`,
      languages: { en: '/en/products', de: '/de/products', fr: '/fr/products' }
    }
  };
}

export default async function ProductsPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations('Products');

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">{t('title')}</h1>
        <p className="mt-2 text-slate-600">{t('subtitle')}</p>
      </header>
      <ProductList products={products} />
    </div>
  );
}
