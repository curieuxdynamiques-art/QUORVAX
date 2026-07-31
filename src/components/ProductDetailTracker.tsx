'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAnalytics } from '@/store/analytics';
import type { Product, Locale } from '@/data/products';

export default function ProductDetailTracker({
  product,
  children
}: {
  product: Product;
  children: React.ReactNode;
}) {
  const params = useParams();
  const trackEvent = useAnalytics((s) => s.trackEvent);
  const locale = (params?.locale as Locale) || 'en';

  useEffect(() => {
    const name = product.name[locale] ?? product.name.en;
    trackEvent('product_view', {
      productId: product.id,
      productName: name,
      amount: product.price,
      locale
    });
    // Mount once per product load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return <>{children}</>;
}
