import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { products } from '@/data/products';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/products', '/about', '/contact', '/faq', '/shipping', '/returns', '/privacy-policy', '/terms'];
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // 静态页面 × 每个 locale
  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.6,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${BASE_URL}/${l}${route}`])
          )
        }
      });
    }

    // 产品详情页
    for (const p of products) {
      entries.push({
        url: `${BASE_URL}/${locale}/products/${p.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${BASE_URL}/${l}/products/${p.slug}`])
          )
        }
      });
    }
  }

  return entries;
}
