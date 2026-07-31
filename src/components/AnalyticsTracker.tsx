'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useAnalytics } from '@/store/analytics';

export default function AnalyticsTracker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const trackPageView = useAnalytics((s) => s.trackPageView);
  const locale = (params?.locale as string) || 'en';

  useEffect(() => {
    if (!pathname) return;
    const referrer = document.referrer || undefined;
    trackPageView(pathname, { referrer, locale });
    let lastPath = pathname;
    const timer = setInterval(() => {
      const cur = window.location.pathname + window.location.search;
      if (cur !== lastPath) {
        lastPath = cur;
        trackPageView(cur, { locale });
      }
    }, 800);
    return () => clearInterval(timer);
  }, [pathname, locale, trackPageView]);

  return <>{children}</>;
}
