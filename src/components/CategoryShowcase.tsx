import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { type ProductCategory } from '@/data/products';

const categoryImages: Partial<Record<ProductCategory, string>> = {
  mouse: '/cat-mouse.jpg',
  keyboard: '/cat-keyboard.jpg',
  headphone: '/cat-headphone.jpg',
  laptop: '/cat-laptop.jpg',
};

const showcaseCategories: ProductCategory[] = [
  'mouse',
  'keyboard',
  'headphone',
  'earphone',
  'laptop',
  'tablet',
  'monitor',
  'accessory',
];

export default async function CategoryShowcase() {
  const t = await getTranslations('Products');

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">{t('shopByCategory')}</h2>
        <p className="mt-2 text-slate-600">{t('categoryDesc')}</p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {showcaseCategories.map((cat) => {
          const img = categoryImages[cat];
          return (
            <Link
              key={cat}
              href="/products"
              className="group relative overflow-hidden rounded-xl bg-slate-100"
            >
              {img ? (
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img}
                    alt={t(`categories.${cat}`)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <span className="text-4xl">{getCategoryIcon(cat)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-semibold text-white">
                  {t(`categories.${cat}`)}
                </h3>
                <span className="text-sm text-white/70 group-hover:text-white">
                  {t('shopNow')} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function getCategoryIcon(cat: ProductCategory): string {
  const icons: Record<ProductCategory, string> = {
    mouse: '🖱️',
    keyboard: '⌨️',
    headphone: '🎧',
    earphone: '🎵',
    laptop: '💻',
    tablet: '📱',
    monitor: '🖥️',
    charger: '🔌',
    powerbank: '🔋',
    cable: '🔗',
    usb_hub: '🔀',
    webcam: '📷',
    speaker: '🔊',
    smartwatch: '⌚',
    storage: '💾',
    accessory: '🧩',
  };
  return icons[cat] || '📦';
}
