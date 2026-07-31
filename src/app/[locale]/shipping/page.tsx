import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { type Locale } from '@/data/products';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'Footer' });
  return {
    title: t('shipping'),
    alternates: {
      canonical: `/${params.locale}/shipping`,
      languages: { en: '/en/shipping', de: '/de/shipping', fr: '/fr/shipping' }
    }
  };
}

type Section = { title: string; body: string };

const content: Record<Locale, { intro: string; sections: Section[] }> = {
  en: {
    intro:
      'We ship to all 27 EU member states, plus the United Kingdom, Switzerland, and Norway.',
    sections: [
      {
        title: 'Processing Time',
        body: 'Orders are processed within 1–2 business days. You will receive a confirmation email with tracking once your order ships.'
      },
      {
        title: 'Shipping Rates',
        body: 'Free shipping on orders above €49. Below that, a flat rate of €4.95 applies within the EU. UK/CH/NO shipments may incur customs duties.'
      },
      {
        title: 'Delivery Times',
        body: 'Germany: 1–3 business days. EU mainland: 2–5 business days. Remote areas (Cyprus, Malta, Greece islands): 5–10 business days.'
      },
      {
        title: 'Tracking',
        body: 'All shipments include tracking. You will receive a DHL / DPD / Hermes tracking number via email once dispatched.'
      },
      {
        title: 'Customs & Duties (UK / CH / NO)',
        body: 'For non-EU destinations, local VAT and import duties may apply at delivery. These charges are the responsibility of the recipient.'
      }
    ]
  },
  de: {
    intro:
      'Wir liefern in alle 27 EU-Mitgliedstaaten sowie nach Großbritannien, Schweiz und Norwegen.',
    sections: [
      {
        title: 'Bearbeitungszeit',
        body: 'Bestellungen werden innerhalb von 1–2 Werktagen bearbeitet. Sie erhalten eine Bestätigungs-E-Mail mit Sendungsverfolgung, sobald Ihre Bestellung versendet wird.'
      },
      {
        title: 'Versandkosten',
        body: 'Kostenloser Versand ab €49 Bestellwert. Darunter fällt eine Pauschale von €4,95 innerhalb der EU an. Für UK/CH/NO können Zollgebühren anfallen.'
      },
      {
        title: 'Lieferzeiten',
        body: 'Deutschland: 1–3 Werktage. EU-Festland: 2–5 Werktage. Entlegene Gebiete (Zypern, Malta, griechische Inseln): 5–10 Werktage.'
      },
      {
        title: 'Sendungsverfolgung',
        body: 'Alle Sendungen enthalten Tracking. Sie erhalten eine DHL-/DPD-/Hermes-Trackingnummer per E-Mail nach dem Versand.'
      },
      {
        title: 'Zoll & Gebühren (UK / CH / NO)',
        body: 'Für Nicht-EU-Ziele können lokale MwSt und Einfuhrzölle bei der Lieferung anfallen. Diese Gebühren trägt der Empfänger.'
      }
    ]
  },
  fr: {
    intro:
      'Nous livrons dans les 27 États membres de l’UE, ainsi qu’au Royaume-Uni, en Suisse et en Norvège.',
    sections: [
      {
        title: 'Délai de traitement',
        body: 'Les commandes sont traitées sous 1 à 2 jours ouvrés. Vous recevrez un e-mail de confirmation avec suivi dès l’expédition.'
      },
      {
        title: 'Frais de livraison',
        body: 'Livraison offerte dès €49 d’achat. En deçà, un forfait de €4,95 s’applique dans l’UE. Les livraisons UK/CH/NO peuvent entraîner des droits de douane.'
      },
      {
        title: 'Délais de livraison',
        body: 'Allemagne : 1–3 jours ouvrés. UE continentale : 2–5 jours ouvrés. Zones éloignées (Chypre, Malte, îles grecques) : 5–10 jours ouvrés.'
      },
      {
        title: 'Suivi',
        body: 'Toutes les expéditions incluent le suivi. Vous recevrez un numéro de suivi DHL / DPD / Hermes par e-mail après l’expédition.'
      },
      {
        title: 'Douane & droits (UK / CH / NO)',
        body: 'Pour les destinations hors UE, la TVA locale et les droits d’importation peuvent s’appliquer à la livraison. Ces frais sont à la charge du destinataire.'
      }
    ]
  }
};

export default async function ShippingPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations('Footer');
  const data = content[locale as Locale] ?? content.en;

  return (
    <div>
      <PageHeader title={t('shipping')} subtitle={data.intro} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="space-y-8">
          {data.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold text-slate-900">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-slate-600">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
