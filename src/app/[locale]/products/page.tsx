import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { products, filterProducts, type ProductFilter, type Locale } from '@/data/products';
import ProductList from '@/components/ProductList';

type PageProps = {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

function parseFilter(searchParams?: PageProps['searchParams']): ProductFilter {
  const f: ProductFilter = {};
  if (!searchParams) return f;
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const cat = get('category');
  if (cat) f.category = cat as ProductFilter['category'];
  const w = get('wireless');
  if (w === 'true') f.wireless = true;
  if (w === 'false') f.wireless = false;
  const s = get('subCategory');
  if (s) f.subCategory = s as ProductFilter['subCategory'];
  return f;
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams?: PageProps['searchParams'];
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'Products' });
  const f = parseFilter(searchParams);
  const parts: string[] = [];
  if (f.category) {
    try {
      parts.push(t(`categories.${f.category}`));
    } catch {
      /* ignore */
    }
  }
  if (f.wireless === true) parts.push('Wireless');
  if (f.wireless === false) parts.push('Wired');
  const title = parts.length ? `${parts.join(' · ')} | ${t('title')}` : t('title');
  return {
    title,
    description: t('subtitle'),
    alternates: {
      canonical: `/${params.locale}/products`,
      languages: { en: '/en/products', de: '/de/products', fr: '/fr/products' }
    }
  };
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations('Products');
  const tNav = await getTranslations({ locale, namespace: 'NavDropdown' });
  const currentLocale = locale as Locale;

  const initialFilter = parseFilter(searchParams);
  const filtered = Object.keys(initialFilter).length
    ? filterProducts(products, initialFilter)
    : products;

  // 根据筛选拼标题副标题
  let heading = t('title');
  let subHeading = t('subtitle');
  try {
    if (initialFilter.category && !initialFilter.wireless && !initialFilter.subCategory) {
      heading = t(`categories.${initialFilter.category}`);
    }
    if (initialFilter.category === 'keyboard') {
      if (initialFilter.wireless === false) heading = tNav('wired') + ' ' + tNav('keyboard');
      if (initialFilter.wireless === true) heading = tNav('wireless') + ' ' + tNav('keyboard');
    }
    if (initialFilter.category === 'mouse') {
      if (initialFilter.wireless === false) heading = tNav('wired') + ' ' + tNav('mouse');
      if (initialFilter.wireless === true) heading = tNav('wireless') + ' ' + tNav('mouse');
    }
    if (initialFilter.subCategory === 'mousepad') heading = tNav('mousepad');
    if (initialFilter.subCategory === 'keycap') heading = tNav('keycap');
    if (initialFilter.subCategory === 'charging') heading = tNav('charging');
    if (heading !== t('title')) {
      subHeading = t('subtitle');
    }
  } catch {
    /* ignore translation errors */
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">{heading}</h1>
        <p className="mt-2 text-slate-600">{subHeading}</p>
        {filtered.length > 0 && (
          <p className="mt-3 text-sm text-slate-500">
            {filtered.length} {tNav('items')}
          </p>
        )}
      </header>
      <ProductList products={products} initialFilter={initialFilter} />
    </div>
  );
}
