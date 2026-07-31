import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-7xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{t('title')}</h1>
      <p className="mt-3 text-slate-600">{t('desc')}</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
