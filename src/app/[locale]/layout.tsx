import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import AnalyticsTracker from '@/components/AnalyticsTracker';

// 为每个 locale 生成静态页面
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    metadataBase: new URL('https://example.com'),
    title: {
      default: 'REMANET TRADING — Premium Tech Accessories for Europe',
      template: '%s | REMANET TRADING'
    },
    description:
      'Premium tech accessories for Europe — laptops, tablets, monitors, headphones, keyboards, mice and more. CE-certified, ships across Europe.',
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        en: '/en',
        de: '/de',
        fr: '/fr'
      }
    },
    openGraph: {
      title: 'REMANET TRADING — Premium Tech Accessories for Europe',
      description:
        'Premium tech accessories for Europe — laptops, tablets, monitors, headphones, keyboards, mice and more. CE-certified, ships across Europe.',
      type: 'website'
    },
    verification: {
      google: '4lsJKmlv-l7DVqFLsUkU5SpxC8Oz2wPgLw7DhRj21HU'
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  // 校验 locale
  if (!routing.locales.includes(locale as never)) {
    notFound();
  }

  // 启用静态渲染
  setRequestLocale(locale);

  return (
    <AnalyticsTracker>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </AnalyticsTracker>
  );
}
