import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import { type Locale } from '@/data/products';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'About' });
  return {
    title: t('title'),
    alternates: {
      canonical: `/${params.locale}/about`,
      languages: { en: '/en/about', de: '/de/about', fr: '/fr/about' }
    }
  };
}

const content: Record<Locale, { mission: string; values: { title: string; desc: string }[] }> = {
  en: {
    mission:
      'REMANET TRADING is dedicated to bringing high-quality, CE-certified computer peripherals to customers across Europe. We believe great tools should be reliable, affordable, and beautifully designed.',
    values: [
      { title: 'Quality First', desc: 'Every product is CE-certified and tested to EU standards.' },
      { title: 'European Compliance', desc: 'GDPR, VAT, WEEE, and packaging regulations fully respected.' },
      { title: 'Customer Care', desc: 'Multilingual support in English, German, and French.' },
      { title: 'Sustainable Shipping', desc: 'Carbon-neutral logistics partners across the EU.' }
    ]
  },
  de: {
    mission:
      'REMANET TRADING widmet sich der Bereitstellung hochwertiger, CE-zertifizierter Computerperipherie für Kunden in ganz Europa. Wir glauben, dass gute Werkzeuge zuverlässig, erschwinglich und schön gestaltet sein sollten.',
    values: [
      { title: 'Qualität zuerst', desc: 'Jedes Produkt ist CE-zertifiziert und nach EU-Standards getestet.' },
      { title: 'EU-Konformität', desc: 'GDPR, MwSt, WEEE und Verpackungsvorschriften vollständig eingehalten.' },
      { title: 'Kundenservice', desc: 'Mehrsprachiger Support auf Englisch, Deutsch und Französisch.' },
      { title: 'Nachhaltiger Versand', desc: 'CO₂-neutrale Logistikpartner in der gesamten EU.' }
    ]
  },
  fr: {
    mission:
      "REMANET TRADING s'engage à fournir des périphériques informatiques de haute qualité, certifiés CE, aux clients de toute l'Europe. Nous croyons que de bons outils doivent être fiables, abordables et au design soigné.",
    values: [
      { title: 'Qualité avant tout', desc: 'Chaque produit est certifié CE et testé selon les normes UE.' },
      { title: 'Conformité européenne', desc: 'RGPD, TVA, DEEE et réglementations emballage respectées.' },
      { title: 'Service client', desc: 'Support multilingue en anglais, allemand et français.' },
      { title: 'Livraison durable', desc: 'Partenaires logistiques neutres en carbone dans toute l’UE.' }
    ]
  }
};

export default async function AboutPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations('About');
  const data = content[locale as Locale] ?? content.en;

  return (
    <div>
      <PageHeader title={t('title')} subtitle={t('intro')} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Mission */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900">{t('story')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {data.mission}
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            {t('storyContent')}
          </p>
        </section>

        {/* Values */}
        <section className="mt-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {data.values.map((v, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <h3 className="font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-xl bg-brand-600 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">{t('title')}</h2>
          <p className="mt-2 text-brand-100">{t('intro')}</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            Browse Products
          </Link>
        </section>
      </div>
    </div>
  );
}
