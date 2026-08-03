import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { products, type ProductCategory } from '@/data/products';

const categoryImages: Partial<Record<ProductCategory, string>> = {
  mouse: '/cat-mouse.jpg',
  keyboard: '/cat-keyboard.jpg',
  laptop: '/cat-laptop.jpg',
};

// 与顶部下拉菜单一致：键盘 / 鼠标 / 笔记本电脑 / 配件（鼠标垫 / 键帽 / 充电）
const showcaseCategories: ProductCategory[] = [
  'mouse',
  'keyboard',
  'laptop',
  'accessory',
];

// 每个分类取第一个产品的 slug 作为链接目标
function getProductSlugForCategory(cat: ProductCategory): string | null {
  const product = products.find((p) => p.category === cat);
  return product ? product.slug : null;
}

export default async function CategoryShowcase() {
  const t = await getTranslations('Products');

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">{t('shopByCategory')}</h2>
        <p className="mt-1 text-sm text-slate-600">{t('categoryDesc')}</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {showcaseCategories.map((cat) => {
          const img = categoryImages[cat];
          const slug = getProductSlugForCategory(cat);
          const href = slug ? `/products/${slug}` : '/products';
          return (
            <Link
              key={cat}
              href={href as '/products' | `/products/${string}`}
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
              <div className="absolute bottom-0 left-0 p-3">
                <h3 className="text-base font-semibold text-white">
                  {t(`categories.${cat}`)}
                </h3>
                <span className="text-xs text-white/70 group-hover:text-white">
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
  const icons: Partial<Record<ProductCategory, string>> = {
    mouse: '🖱️',
    keyboard: '⌨️',
    laptop: '💻',
    charger: '🔌',
    accessory: '🧩',
  };
  return icons[cat] || '📦';
}
