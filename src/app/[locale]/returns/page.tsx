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
    title: t('returns'),
    alternates: {
      canonical: `/${params.locale}/returns`,
      languages: { en: '/en/returns', de: '/de/returns', fr: '/fr/returns' }
    }
  };
}

type Section = { title: string; body: string };

const content: Record<Locale, { intro: string; sections: Section[] }> = {
  en: {
    intro:
      'In compliance with EU consumer law, you have the right to withdraw from your purchase within 14 days.',
    sections: [
      {
        title: '14-Day Right of Withdrawal',
        body: 'You may return any unused item in its original packaging within 14 days of receipt for a full refund. No reason is required.'
      },
      {
        title: '2-Year Legal Warranty',
        body: 'All products are covered by the EU 2-year legal warranty against defects. If a product fails within this period, we will repair, replace, or refund it.'
      },
      {
        title: 'How to Return',
        body: 'Contact support@voltkey.eu with your order number. We will provide a return label and instructions. Returns are free for defective items; return shipping for change-of-mind is paid by the buyer.'
      },
      {
        title: 'Refund Processing',
        body: 'Refunds are issued to the original payment method within 14 days of receiving the returned item. You will receive an email confirmation.'
      },
      {
        title: 'Non-Returnable Items',
        body: 'For hygiene reasons, in-ear products and items with broken seals cannot be returned unless defective.'
      }
    ]
  },
  de: {
    intro:
      'Gemäß EU-Verbraucherrecht haben Sie das Recht, Ihren Kauf innerhalb von 14 Tagen zu widerrufen.',
    sections: [
      {
        title: '14-tägiges Widerrufsrecht',
        body: 'Sie können jeden unbenutzten Artikel in der Originalverpackung innerhalb von 14 Tagen nach Erhalt gegen volle Rückerstattung zurückgeben. Ein Grund ist nicht erforderlich.'
      },
      {
        title: '2 Jahre gesetzliche Gewährleistung',
        body: 'Alle Produkte unterliegen der 2-jährigen EU-Gesetzgewährleistung bei Mängeln. Tritt ein Defekt innerhalb dieses Zeitraums auf, reparieren, ersetzen oder erstatten wir den Artikel.'
      },
      {
        title: 'So retournieren Sie',
        body: 'Kontaktieren Sie support@voltkey.eu mit Ihrer Bestellnummer. Wir stellen ein Rücksendeetikett und Anweisungen bereit. Rücksendungen bei Defekt sind kostenlos; Rücksendekosten bei Umtausch trägt der Käufer.'
      },
      {
        title: 'Rückerstattungsabwicklung',
        body: 'Rückerstattungen erfolgen auf die ursprüngliche Zahlungsmethode innerhalb von 14 Tagen nach Erhalt des retournierten Artikels. Sie erhalten eine E-Mail-Bestätigung.'
      },
      {
        title: 'Nicht retournierbare Artikel',
        body: 'Aus Hygienegründen können In-Ear-Produkte und Artikel mit gebrochenem Siegel nicht zurückgegeben werden, es sei denn, sie sind defekt.'
      }
    ]
  },
  fr: {
    intro:
      "Conformément au droit de l'UE, vous disposez d'un droit de rétractation de 14 jours.",
    sections: [
      {
        title: 'Droit de rétractation de 14 jours',
        body: "Vous pouvez retourner tout article inutilisé dans son emballage d'origine dans les 14 jours suivant la réception pour un remboursement complet. Aucune raison n'est requise."
      },
      {
        title: 'Garantie légale de 2 ans',
        body: "Tous les produits sont couverts par la garantie légale européenne de 2 ans contre les défauts. En cas de panne durant cette période, nous réparons, remplaçons ou remboursons l'article."
      },
      {
        title: 'Comment retourner',
        body: 'Contactez support@voltkey.eu avec votre numéro de commande. Nous fournirons une étiquette de retour et des instructions. Les retours pour défaut sont gratuits ; les frais de retour pour changement d’avis sont à la charge de l’acheteur.'
      },
      {
        title: 'Traitement des remboursements',
        body: "Les remboursements sont effectués sur le moyen de paiement d'origine dans les 14 jours suivant la réception de l'article retourné. Vous recevrez une confirmation par e-mail."
      },
      {
        title: 'Articles non retournables',
        body: "Pour des raisons d'hygiène, les produits intra-auriculaires et les articles dont le sceau est brisé ne peuvent être retournés sauf en cas de défaut."
      }
    ]
  }
};

export default async function ReturnsPage({
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
      <PageHeader title={t('returns')} subtitle={data.intro} />
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
