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
    title: t('terms'),
    alternates: {
      canonical: `/${params.locale}/terms`,
      languages: { en: '/en/terms', de: '/de/terms', fr: '/fr/terms' }
    }
  };
}

type Section = { title: string; body: string };

const content: Record<Locale, { intro: string; sections: Section[] }> = {
  en: {
    intro:
      'These Terms of Service govern your use of the REMANET TRADING website and your purchases.',
    sections: [
      {
        title: '1. Orders & Acceptance',
        body: 'An order placed on our site constitutes an offer to purchase. We accept the offer by shipping the products. We reserve the right to refuse or cancel any order (e.g. suspected fraud, pricing errors).'
      },
      {
        title: '2. Prices & Taxes',
        body: 'All prices are in euros (EUR) and include VAT at the applicable rate. Shipping costs are shown at checkout. We use OSS (One Stop Shop) for EU VAT declarations.'
      },
      {
        title: '3. Payment',
        body: 'We accept Visa, Mastercard, PayPal, Klarna, and iDEAL. Payment is processed securely by our payment providers. We never store your full card details.'
      },
      {
        title: '4. Product Compliance',
        body: 'All products are CE-certified and comply with EU directives (RED, EMC, RoHS, WEEE). Product images are illustrative; specifications may vary slightly.'
      },
      {
        title: '5. Intellectual Property',
        body: 'All content on this site (logos, texts, images) is the property of REMANET TRADING or its licensors and may not be reproduced without permission.'
      },
      {
        title: '6. Liability',
        body: 'We are not liable for indirect damages. Our liability is limited to the order value. Mandatory statutory liability (e.g. for personal injury) remains unaffected.'
      },
      {
        title: '7. Applicable Law',
        body: 'These terms are governed by German law, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). EU consumers retain mandatory consumer rights of their country of residence.'
      },
      {
        title: '8. Online Dispute Resolution',
        body: 'The European Commission provides an online dispute resolution platform: https://ec.europa.eu/consumers/odr/. We are not obliged to participate in dispute settlement proceedings.'
      }
    ]
  },
  de: {
    intro:
      'Diese Allgemeinen Geschäftsbedingungen regeln Ihre Nutzung der Website REMANET TRADING und Ihre Einkäufe.',
    sections: [
      {
        title: '1. Bestellungen & Annahme',
        body: 'Eine auf unserer Website getätigte Bestellung stellt ein Kaufangebot dar. Wir nehmen das Angebot durch Versand der Produkte an. Wir behalten uns vor, Bestellungen abzulehnen oder zu stornieren (z. B. bei Betrugsverdacht, Preisauszeichnungsfehlern).'
      },
      {
        title: '2. Preise & Steuern',
        body: 'Alle Preise in Euro (EUR) inklusive MwSt. Versandkosten werden beim Checkout angezeigt. Wir nutzen das OSS-Verfahren (One Stop Shop) für die EU-Mehrwertsteuererklärung.'
      },
      {
        title: '3. Zahlung',
        body: 'Wir akzeptieren Visa, Mastercard, PayPal, Klarna und iDEAL. Die Zahlung wird sicher über unsere Zahlungsdienstleister abgewickelt. Wir speichern keine vollständigen Kartendaten.'
      },
      {
        title: '4. Produktkonformität',
        body: 'Alle Produkte sind CE-zertifiziert und entsprechen EU-Richtlinien (RED, EMC, RoHS, WEEE). Produktbilder sind illustrativ; Spezifikationen können leicht abweichen.'
      },
      {
        title: '5. geistiges Eigentum',
        body: 'Alle Inhalte dieser Website (Logos, Texte, Bilder) sind Eigentum von REMANET TRADING oder seinen Lizenzgebern und dürfen ohne Genehmigung nicht reproduziert werden.'
      },
      {
        title: '6. Haftung',
        body: 'Wir haften nicht für indirekte Schäden. Unsere Haftung ist auf den Bestellwert begrenzt. Die gesetzliche Verschuldenshaftung (z. B. für Personenschäden) bleibt unberührt.'
      },
      {
        title: '7. Anwendbares Recht',
        body: 'Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts (CISG). EU-Verbraucher behalten zwingende Verbraucherrechte ihres Wohnsitzlandes.'
      },
      {
        title: '8. Online-Streitbeilegung',
        body: 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht zur Teilnahme an Streitbeilegungsverfahren verpflichtet.'
      }
    ]
  },
  fr: {
    intro:
      "Les présentes conditions générales régissent votre utilisation du site REMANET TRADING et vos achats.",
    sections: [
      {
        title: '1. Commandes & acceptation',
        body: "Toute commande passée sur notre site constitue une offre d'achat. Nous acceptons l'offre en expédiant les produits. Nous nous réservons le droit de refuser ou d'annuler toute commande (ex. suspicion de fraude, erreur de prix)."
      },
      {
        title: '2. Prix & taxes',
        body: "Tous les prix sont en euros (EUR), TVA au taux applicable incluse. Les frais de livraison sont indiqués au paiement. Nous utilisons le guichet unique (OSS) pour les déclarations de TVA UE."
      },
      {
        title: '3. Paiement',
        body: "Nous acceptons Visa, Mastercard, PayPal, Klarna et iDEAL. Le paiement est traité de manière sécurisée par nos prestataires. Nous ne stockons jamais vos données bancaires complètes."
      },
      {
        title: '4. Conformité des produits',
        body: "Tous les produits sont certifiés CE et conformes aux directives UE (RED, EMC, RoHS, DEEE). Les images sont illustratives ; les spécifications peuvent légèrement varier."
      },
      {
        title: '5. Propriété intellectuelle',
        body: "Tout le contenu de ce site (logos, textes, images) est la propriété de REMANET TRADING ou de ses concédants et ne peut être reproduit sans autorisation."
      },
      {
        title: '6. Responsabilité',
        body: "Nous ne sommes pas responsables des dommages indirects. Notre responsabilité est limitée au montant de la commande. La responsabilité légale obligatoire (ex. blessures corporelles) demeure inchangée."
      },
      {
        title: '7. Droit applicable',
        body: "Les présentes conditions sont régies par le droit allemand, à l'exclusion de la Convention de Vienne sur les contrats de vente internationale de marchandises (CVIM). Les consommateurs de l'UE conservent les droits obligatoires de leur pays de résidence."
      },
      {
        title: '8. Règlement en ligne des litiges',
        body: "La Commission européenne met à disposition une plateforme de règlement en ligne des litiges : https://ec.europa.eu/consumers/odr/. Nous ne sommes pas tenus de participer à une procédure de règlement des litiges."
      }
    ]
  }
};

export default async function TermsPage({
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
      <PageHeader title={t('terms')} subtitle={data.intro} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="mb-8 text-sm text-slate-500">Last updated: 2026-07-31</p>
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
