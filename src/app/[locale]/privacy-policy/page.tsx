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
    title: t('privacy'),
    alternates: {
      canonical: `/${params.locale}/privacy-policy`,
      languages: {
        en: '/en/privacy-policy',
        de: '/de/privacy-policy',
        fr: '/fr/privacy-policy'
      }
    }
  };
}

type Section = { title: string; body: string };

const content: Record<Locale, { intro: string; sections: Section[] }> = {
  en: {
    intro:
      'This Privacy Policy explains how VoltKey.eu collects, uses, and protects your personal data in accordance with the EU General Data Protection Regulation (GDPR).',
    sections: [
      {
        title: '1. Data Controller',
        body: 'VoltKey.eu, Friedrichstraße 68, 10117 Berlin, Germany is the data controller responsible for your personal data. Contact: privacy@voltkey.eu.'
      },
      {
        title: '2. Data We Collect',
        body: 'We collect: (a) contact details (name, email, shipping address, phone) provided at checkout; (b) order and payment metadata (we do not store full card numbers); (c) browsing data via cookies (IP, browser, pages visited).'
      },
      {
        title: '3. Legal Basis',
        body: 'We process your data based on: contract performance (order fulfilment), legal obligation (VAT/invoicing), legitimate interest (fraud prevention), and your consent (marketing cookies).'
      },
      {
        title: '4. Cookies',
        body: 'We use necessary cookies for site operation and optional cookies for analytics. You can manage your preferences via the cookie banner. See our Cookie Policy for details.'
      },
      {
        title: '5. Data Retention',
        body: 'Order data is kept for 10 years (tax/legal requirements). Marketing data is retained until you unsubscribe. Inactive account data is deleted after 3 years.'
      },
      {
        title: '6. Your Rights (GDPR)',
        body: 'You have the right to: access, rectify, erase, restrict processing, data portability, and object. You can also lodge a complaint with your local data protection authority.'
      },
      {
        title: '7. How to Exercise Your Rights',
        body: 'Email privacy@voltkey.eu with your request. We respond within 30 days. For identity verification, we may request additional information.'
      },
      {
        title: '8. International Transfers',
        body: 'Data may be processed outside the EU (e.g. payment providers). We only transfer data to countries with adequacy decisions or appropriate safeguards (Standard Contractual Clauses).'
      }
    ]
  },
  de: {
    intro:
      'Diese Datenschutzerklärung erläutert, wie VoltKey.eu Ihre personenbezogenen Daten gemäß der EU-Datenschutz-Grundverordnung (DSGVO) erhebt, verwendet und schützt.',
    sections: [
      {
        title: '1. Verantwortlicher',
        body: 'VoltKey.eu, Friedrichstraße 68, 10117 Berlin, Deutschland ist der für Ihre personenbezogenen Daten verantwortliche. Kontakt: privacy@voltkey.eu.'
      },
      {
        title: '2. Erhobene Daten',
        body: 'Wir erheben: (a) Kontaktdaten (Name, E-Mail, Lieferadresse, Telefon) beim Checkout; (b) Bestell- und Zahlungs-Metadaten (keine Speicherung vollständiger Kartennummern); (c) Surfdaten per Cookies (IP, Browser, besuchte Seiten).'
      },
      {
        title: '3. Rechtsgrundlage',
        body: 'Wir verarbeiten Ihre Daten auf Basis von: Vertragserfüllung (Bestellabwicklung), gesetzlicher Verpflichtung (MwSt/Rechnung), berechtigtem Interesse (Betrugsprävention) und Ihrer Einwilligung (Marketing-Cookies).'
      },
      {
        title: '4. Cookies',
        body: 'Wir verwenden notwendige Cookies für den Betrieb und optionale Cookies für Analysezwecke. Sie können Ihre Einstellungen über das Cookie-Banner verwalten. Siehe unsere Cookie-Richtlinie für Details.'
      },
      {
        title: '5. Aufbewahrungsdauer',
        body: 'Bestelldaten werden 10 Jahre aufbewahrt (steuerlich/rechtlich). Marketingdaten bis zum Abmelden. Inaktive Kontodaten werden nach 3 Jahren gelöscht.'
      },
      {
        title: '6. Ihre Rechte (DSGVO)',
        body: 'Sie haben das Recht auf: Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Sie können auch bei Ihrer lokalen Datenschutzbehörde Beschwerde einlegen.'
      },
      {
        title: '7. Ausübung Ihrer Rechte',
        body: 'E-Mail an privacy@voltkey.eu mit Ihrer Anfrage. Wir antworten innerhalb von 30 Tagen. Zur Identitätsprüfung können wir zusätzliche Informationen anfordern.'
      },
      {
        title: '8. Internationale Übermittlungen',
        body: 'Daten können außerhalb der EU verarbeitet werden (z. B. Zahlungsanbieter). Wir übermitteln Daten nur an Länder mit Angemessenheitsbeschluss oder geeigneten Garantien (Standardvertragsklauseln).'
      }
    ]
  },
  fr: {
    intro:
      "La présente politique de confidentialité explique comment VoltKey.eu collecte, utilise et protège vos données personnelles conformément au Règlement général sur la protection des données (RGPD) de l'UE.",
    sections: [
      {
        title: '1. Responsable du traitement',
        body: "VoltKey.eu, Friedrichstraße 68, 10117 Berlin, Allemagne est le responsable du traitement de vos données. Contact : privacy@voltkey.eu."
      },
      {
        title: '2. Données collectées',
        body: 'Nous collectons : (a) coordonnées (nom, e-mail, adresse de livraison, téléphone) au paiement ; (b) métadonnées de commande et de paiement (pas de stockage des numéros de carte complets) ; (c) données de navigation via cookies (IP, navigateur, pages visitées).'
      },
      {
        title: '3. Base légale',
        body: "Nous traitons vos données sur la base de : exécution du contrat (traitement des commandes), obligation légale (TVA/facturation), intérêt légitime (prévention des fraudes) et votre consentement (cookies marketing)."
      },
      {
        title: '4. Cookies',
        body: "Nous utilisons des cookies nécessaires au fonctionnement et des cookies optionnels pour l'analyse. Vous pouvez gérer vos préférences via le bandeau cookies. Voir notre Politique Cookies pour plus de détails."
      },
      {
        title: '5. Conservation des données',
        body: "Les données de commande sont conservées 10 ans (fiscal/légal). Les données marketing jusqu'au désabonnement. Les données de comptes inactifs sont supprimées après 3 ans."
      },
      {
        title: '6. Vos droits (RGPD)',
        body: "Vous avez le droit d'accès, de rectification, d'effacement, de limitation du traitement, à la portabilité et d'opposition. Vous pouvez aussi déposer une plainte auprès de votre autorité de protection des données locale."
      },
      {
        title: '7. Exercer vos droits',
        body: "Envoyez un e-mail à privacy@voltkey.eu avec votre demande. Nous répondons sous 30 jours. Pour vérifier votre identité, nous pouvons demander des informations supplémentaires."
      },
      {
        title: '8. Transferts internationaux',
        body: "Les données peuvent être traitées hors UE (ex. prestataires de paiement). Nous ne transférons des données qu'à des pays bénéficiant d'une décision d'adéquation ou de garanties appropriées (clauses contractuelles types)."
      }
    ]
  }
};

export default async function PrivacyPolicyPage({
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
      <PageHeader title={t('privacy')} subtitle={data.intro} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="mb-8 text-sm text-slate-500">
          Last updated: 2026-07-31
        </p>
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
