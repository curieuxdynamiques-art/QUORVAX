'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import PageHeader from '@/components/PageHeader';
import { type Locale } from '@/data/products';

type QA = { q: string; a: string };

const faqs: Record<Locale, QA[]> = {
  en: [
    {
      q: 'Which countries do you ship to?',
      a: 'We ship to all 27 EU member states, the United Kingdom, Switzerland, and Norway.'
    },
    {
      q: 'How long does delivery take?',
      a: 'Germany: 1–3 business days. EU mainland: 2–5 business days. Remote EU areas: 5–10 business days.'
    },
    {
      q: 'Are your products CE-certified?',
      a: 'Yes. Every product we sell is CE-certified and complies with EU directives including RED, EMC, RoHS, and WEEE.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'Visa, Mastercard, PayPal, Klarna, and iDEAL. All transactions are encrypted and processed by PCI-DSS compliant providers.'
    },
    {
      q: 'Can I return a product?',
      a: 'Yes. You have 14 days to return any unused item in its original packaging for a full refund, as per EU consumer law.'
    },
    {
      q: 'Is VAT included in the price?',
      a: 'Yes, all prices shown include VAT at the applicable rate for your delivery country.'
    },
    {
      q: 'Do you offer a warranty?',
      a: 'All products come with the EU 2-year legal warranty against manufacturing defects.'
    },
    {
      q: 'How do I contact support?',
      a: 'Email support@voltkey.eu or use our contact form. We respond within 24 hours, Mon–Sat.'
    }
  ],
  de: [
    {
      q: 'In welche Länder liefern Sie?',
      a: 'Wir liefern in alle 27 EU-Mitgliedstaaten, nach Großbritannien, Schweiz und Norwegen.'
    },
    {
      q: 'Wie lange dauert die Lieferung?',
      a: 'Deutschland: 1–3 Werktage. EU-Festland: 2–5 Werktage. Entlegene EU-Gebiete: 5–10 Werktage.'
    },
    {
      q: 'Sind Ihre Produkte CE-zertifiziert?',
      a: 'Ja. Jedes Produkt ist CE-zertifiziert und entspricht EU-Richtlinien inkl. RED, EMC, RoHS und WEEE.'
    },
    {
      q: 'Welche Zahlungsmethoden akzeptieren Sie?',
      a: 'Visa, Mastercard, PayPal, Klarna und iDEAL. Alle Transaktionen sind verschlüsselt und werden von PCI-DSS-konformen Anbietern abgewickelt.'
    },
    {
      q: 'Kann ich ein Produkt zurückgeben?',
      a: 'Ja. Sie haben 14 Tage, um jeden unbenutzten Artikel in der Originalverpackung gegen volle Rückerstattung zurückzugeben, gemäß EU-Verbraucherrecht.'
    },
    {
      q: 'Ist die MwSt im Preis enthalten?',
      a: 'Ja, alle angezeigten Preise enthalten die MwSt. zum geltenden Satz für Ihr Lieferland.'
    },
    {
      q: 'Bieten Sie eine Garantie?',
      a: 'Alle Produkte unterliegen der 2-jährigen EU-Gesetzgewährleistung bei Herstellungsfehlern.'
    },
    {
      q: 'Wie erreiche ich den Support?',
      a: 'E-Mail an support@voltkey.eu oder über unser Kontaktformular. Wir antworten innerhalb von 24 Stunden, Mo–Sa.'
    }
  ],
  fr: [
    {
      q: 'Dans quels pays livrez-vous ?',
      a: "Nous livrons dans les 27 États membres de l'UE, au Royaume-Uni, en Suisse et en Norvège."
    },
    {
      q: 'Quel est le délai de livraison ?',
      a: 'Allemagne : 1–3 jours ouvrés. UE continentale : 2–5 jours ouvrés. Zones UE éloignées : 5–10 jours ouvrés.'
    },
    {
      q: 'Vos produits sont-ils certifiés CE ?',
      a: "Oui. Chaque produit vendu est certifié CE et conforme aux directives UE dont RED, EMC, RoHS et DEEE."
    },
    {
      q: 'Quels moyens de paiement acceptez-vous ?',
      a: 'Visa, Mastercard, PayPal, Klarna et iDEAL. Toutes les transactions sont chiffrées et traitées par des prestataires conformes PCI-DSS.'
    },
    {
      q: 'Puis-je retourner un produit ?',
      a: "Oui. Vous disposez de 14 jours pour retourner tout article inutilisé dans son emballage d'origine pour un remboursement complet, conformément au droit de l'UE."
    },
    {
      q: 'La TVA est-elle incluse dans le prix ?',
      a: "Oui, tous les prix affichés incluent la TVA au taux applicable pour votre pays de livraison."
    },
    {
      q: 'Offrez-vous une garantie ?',
      a: "Tous les produits bénéficient de la garantie légale européenne de 2 ans contre les défauts de fabrication."
    },
    {
      q: 'Comment contacter le support ?',
      a: "Envoyez un e-mail à support@voltkey.eu ou utilisez notre formulaire de contact. Nous répondons sous 24 heures, du lundi au samedi."
    }
  ]
};

export default function FAQPage() {
  const t = useTranslations('Nav');
  const locale = useLocale() as Locale;
  const list = faqs[locale] ?? faqs.en;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      <PageHeader title={t('faq')} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <dl className="space-y-3">
          {list.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-slate-900">
                      {item.q}
                    </span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </dt>
                {isOpen && (
                  <dd className="border-t border-slate-100 px-5 py-4 text-slate-600">
                    {item.a}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
