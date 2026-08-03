export type Locale = 'en' | 'de' | 'fr';

export type ProductCategory =
  | 'mouse'
  | 'keyboard'
  | 'headphone'
  | 'earphone'
  | 'laptop'
  | 'tablet'
  | 'monitor'
  | 'charger'
  | 'powerbank'
  | 'cable'
  | 'usb_hub'
  | 'webcam'
  | 'speaker'
  | 'smartwatch'
  | 'storage'
  | 'accessory';

export type AccessorySubCategory =
  | 'mousepad'
  | 'keycap'
  | 'charging'
  | 'cable'
  | 'wristrest'
  | 'stand';

export type Product = {
  id: string;
  slug: string;
  category: ProductCategory;
  // 配件子类：鼠标垫 / 键帽 / 充电 / 线材 / 腕托 / 支架
  subCategory?: AccessorySubCategory;
  // 多语言名称与描述
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  price: number; // 单位：欧元
  currency: 'EUR';
  image: string;
  gallery?: string[];
  // 关键规格
  specs: Array<{ label: Record<Locale, string>; value: Record<Locale, string> }>;
  // 是否无线
  wireless: boolean;
  // 是否有货
  inStock: boolean;
  // CE 认证
  ceCertified: boolean;
};

// 示例产品数据 —— 后续可替换为 CMS / 后台 / API
export const products: Product[] = [
  // 鼠标
  {
    id: 'm-001',
    slug: 'aurora-wireless-mouse',
    category: 'mouse',
    name: {
      en: 'Aurora Wireless Mouse',
      de: 'Aurora kabellose Maus',
      fr: 'Souris sans fil Aurora'
    },
    description: {
      en: 'Silent-click wireless mouse with 2.4GHz and Bluetooth dual mode. Ergonomic design for all-day comfort.',
      de: 'Leise klickende kabellose Maus mit 2,4-GHz- und Bluetooth-Dualmodus. Ergonomisches Design für ganztägigen Komfort.',
      fr: 'Souris sans fil silencieuse avec double mode 2,4 GHz et Bluetooth. Design ergonomique pour un confort toute la journée.'
    },
    price: 29.9,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
    wireless: true,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Connection', de: 'Verbindung', fr: 'Connexion' }, value: { en: 'Bluetooth 5.1 / 2.4GHz', de: 'Bluetooth 5.1 / 2,4 GHz', fr: 'Bluetooth 5.1 / 2,4 GHz' } },
      { label: { en: 'Battery', de: 'Akku', fr: 'Batterie' }, value: { en: 'Up to 6 months', de: 'Bis zu 6 Monate', fr: "Jusqu'à 6 mois" } },
      { label: { en: 'DPI', de: 'DPI', fr: 'DPI' }, value: { en: '800 / 1200 / 1600', de: '800 / 1200 / 1600', fr: '800 / 1200 / 1600' } },
      { label: { en: 'Buttons', de: 'Tasten', fr: 'Boutons' }, value: { en: '5 silent buttons', de: '5 leise Tasten', fr: '5 boutons silencieux' } }
    ]
  },
  {
    id: 'm-002',
    slug: 'precision-wired-mouse',
    category: 'mouse',
    name: {
      en: 'Precision Wired Mouse',
      de: 'Präzisionskabelmaus',
      fr: 'Souris filaire de précision'
    },
    description: {
      en: 'High-precision optical sensor wired mouse, ideal for design and gaming. USB-C plug-and-play.',
      de: 'Kabelmaus mit hochpräzisem optischem Sensor, ideal für Design und Gaming. USB-C Plug & Play.',
      fr: 'Souris filaire à capteur optique haute précision, idéale pour le design et le jeu. USB-C plug-and-play.'
    },
    price: 19.9,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800',
    wireless: false,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Connection', de: 'Verbindung', fr: 'Connexion' }, value: { en: 'USB-C wired', de: 'USB-C Kabel', fr: 'USB-C filaire' } },
      { label: { en: 'Sensor', de: 'Sensor', fr: 'Capteur' }, value: { en: 'Optical 6400 DPI', de: 'Optisch 6400 DPI', fr: 'Optique 6400 DPI' } },
      { label: { en: 'Cable length', de: 'Kabellänge', fr: 'Longueur du câble' }, value: { en: '1.8 m', de: '1,8 m', fr: '1,8 m' } },
      { label: { en: 'Polling rate', de: 'Polling-Rate', fr: 'Taux de rapport' }, value: { en: '1000 Hz', de: '1000 Hz', fr: '1000 Hz' } }
    ]
  },
  // 键盘
  {
    id: 'k-001',
    slug: 'nebula-wireless-keyboard',
    category: 'keyboard',
    name: {
      en: 'Nebula Wireless Keyboard',
      de: 'Nebula kabellose Tastatur',
      fr: 'Clavier sans fil Nebula'
    },
    description: {
      en: 'Ultra-slim wireless keyboard with scissor-switch keys. Multi-device pairing via Bluetooth.',
      de: 'Ultradünne kabellose Tastatur mit Scherentasten. Multi-Device-Pairing über Bluetooth.',
      fr: 'Clavier sans fil ultra-fin à touches ciseaux. Appairage multi-appareils via Bluetooth.'
    },
    price: 49.9,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
    wireless: true,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Layout', de: 'Layout', fr: 'Disposition' }, value: { en: 'QWERTY / QWERTZ / AZERTY', de: 'QWERTY / QWERTZ / AZERTY', fr: 'QWERTY / QWERTZ / AZERTY' } },
      { label: { en: 'Connection', de: 'Verbindung', fr: 'Connexion' }, value: { en: 'Bluetooth 5.1 (3 devices)', de: 'Bluetooth 5.1 (3 Geräte)', fr: 'Bluetooth 5.1 (3 appareils)' } },
      { label: { en: 'Battery', de: 'Akku', fr: 'Batterie' }, value: { en: 'Up to 3 months', de: 'Bis zu 3 Monate', fr: "Jusqu'à 3 mois" } },
      { label: { en: 'Key travel', de: 'Tastenhub', fr: 'Course des touches' }, value: { en: '1.2 mm scissor', de: '1,2 mm Schere', fr: '1,2 mm ciseaux' } }
    ]
  },
  {
    id: 'k-002',
    slug: 'mechanical-rgb-keyboard',
    category: 'keyboard',
    name: {
      en: 'Mechanical RGB Keyboard',
      de: 'Mechanische RGB-Tastatur',
      fr: 'Clavier mécanique RGB'
    },
    description: {
      en: 'Hot-swappable mechanical keyboard with red switches and per-key RGB lighting. USB-C detachable cable.',
      de: 'Hot-Swap-fähige mechanische Tastatur mit Red-Switches und pro-Tasten-RGB-Beleuchtung. USB-C abnehmbares Kabel.',
      fr: 'Clavier mécanique hot-swap avec switches rouges et rétroéclairage RGB par touche. Câble USB-C détachable.'
    },
    price: 89.9,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    wireless: false,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Layout', de: 'Layout', fr: 'Disposition' }, value: { en: 'TKL 87 keys', de: 'TKL 87 Tasten', fr: 'TKL 87 touches' } },
      { label: { en: 'Switches', de: 'Switches', fr: 'Switches' }, value: { en: 'Red linear, hot-swap', de: 'Rot linear, Hot-Swap', fr: 'Rouge linéaire, hot-swap' } },
      { label: { en: 'Backlight', de: 'Beleuchtung', fr: 'Rétroéclairage' }, value: { en: 'Per-key RGB', de: 'Pro-Taste RGB', fr: 'RGB par touche' } },
      { label: { en: 'Connection', de: 'Verbindung', fr: 'Connexion' }, value: { en: 'USB-C detachable', de: 'USB-C abnehmbar', fr: 'USB-C détachable' } }
    ]
  },
  // 笔记本电脑
  {
    id: 'lp-001',
    slug: 'travelbook-14-ultrabook',
    category: 'laptop',
    name: {
      en: 'TravelBook 14 Ultrabook',
      de: 'TravelBook 14 Ultrabook',
      fr: 'Ultrabook TravelBook 14'
    },
    description: {
      en: '14" lightweight Ultrabook with QHD display, 16GB RAM and 512GB SSD. All-day battery.',
      de: '14" leichtes Ultrabook mit QHD-Display, 16GB RAM und 512GB SSD. Ganztägiger Akku.',
      fr: 'Ultrabook 14" léger avec écran QHD, 16Go RAM et SSD 512Go. Autonomie toute la journée.'
    },
    price: 899.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    wireless: true,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Display', de: 'Display', fr: 'Écran' }, value: { en: '14" QHD 2560×1440 IPS', de: '14" QHD 2560×1440 IPS', fr: '14" QHD 2560×1440 IPS' } },
      { label: { en: 'Processor', de: 'Prozessor', fr: 'Processeur' }, value: { en: 'Intel Core Ultra 7 155H', de: 'Intel Core Ultra 7 155H', fr: 'Intel Core Ultra 7 155H' } },
      { label: { en: 'Memory', de: 'Speicher', fr: 'Mémoire' }, value: { en: '16GB DDR5 / 512GB NVMe SSD', de: '16GB DDR5 / 512GB NVMe SSD', fr: '16Go DDR5 / SSD 512Go NVMe' } },
      { label: { en: 'Battery', de: 'Akku', fr: 'Batterie' }, value: { en: 'Up to 14 hours', de: 'Bis zu 14 Stunden', fr: "Jusqu'à 14 heures" } }
    ]
  },
  // 充电器
  {
    id: 'ch-001',
    slug: 'gan-140w-fast-charger',
    category: 'charger',
    subCategory: 'charging',
    name: {
      en: 'GaN 140W Fast Charger',
      de: 'GaN 140W Schnellladegerät',
      fr: 'Chargeur rapide GaN 140W'
    },
    description: {
      en: 'Compact gallium-nitride charger with 2× USB-C PD 3.1 and 1× USB-A, charges laptops and phones.',
      de: 'Kompaktes Galliumnitrid-Ladegerät mit 2× USB-C PD 3.1 und 1× USB-A, lädt Laptops und Smartphones.',
      fr: 'Chargeur compact au nitrure de gallium avec 2× USB-C PD 3.1 et 1× USB-A, charge ordinateurs et téléphones.'
    },
    price: 69.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800',
    wireless: false,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Power', de: 'Leistung', fr: 'Puissance' }, value: { en: '140W total (GaN)', de: '140W insgesamt (GaN)', fr: '140W au total (GaN)' } },
      { label: { en: 'Ports', de: 'Ports', fr: 'Ports' }, value: { en: '2× USB-C PD3.1 + 1× USB-A', de: '2× USB-C PD3.1 + 1× USB-A', fr: '2× USB-C PD3.1 + 1× USB-A' } },
      { label: { en: 'Standards', de: 'Standards', fr: 'Standards' }, value: { en: 'PD / PPS / QC5', de: 'PD / PPS / QC5', fr: 'PD / PPS / QC5' } },
      { label: { en: 'Plug', de: 'Stecker', fr: 'Fiche' }, value: { en: 'EU Type-C plug', de: 'EU Typ-C Stecker', fr: 'Fiche EU Type-C' } }
    ]
  },
  // ===== 鼠标键盘配件 =====
  {
    id: 'acc-001',
    slug: 'cognac-leather-mousepad',
    category: 'accessory',
    subCategory: 'mousepad',
    name: {
      en: 'Cognac Leather Mouse Pad',
      de: 'Cognac-Leder-Mauspad',
      fr: 'Tapis de souris en cuir Cognac'
    },
    description: {
      en: 'Full-grain leather desk pad with anti-slip suede base. Ages beautifully, developing a unique patina over time.',
      de: 'Schreibtischunterlage aus Vollnarbenleder mit rutschfester Wildleder-Basis. Entwickelt im Laufe der Zeit eine einzigartige Patina.',
      fr: 'Tapis de bureau en cuir pleine fleur avec base en daim antidérapante. Développe une patine unique au fil du temps.'
    },
    price: 34.9,
    currency: 'EUR',
    image: '/acc-mousepad.jpg',
    wireless: false,
    inStock: true,
    ceCertified: false,
    specs: [
      { label: { en: 'Material', de: 'Material', fr: 'Matériau' }, value: { en: 'Full-grain leather', de: 'Vollnarbenleder', fr: 'Cuir pleine fleur' } },
      { label: { en: 'Size', de: 'Größe', fr: 'Taille' }, value: { en: '80 × 30 cm', de: '80 × 30 cm', fr: '80 × 30 cm' } },
      { label: { en: 'Base', de: 'Unterseite', fr: 'Base' }, value: { en: 'Anti-slip suede', de: 'Rutschfestes Wildleder', fr: 'Daim antidérapant' } },
      { label: { en: 'Edge', de: 'Kante', fr: 'Bord' }, value: { en: 'Hand-stitched', de: 'Handgenäht', fr: 'Cousu main' } }
    ]
  },
  {
    id: 'acc-005',
    slug: 'pastel-custom-keycap-set',
    category: 'accessory',
    subCategory: 'keycap',
    name: {
      en: 'Pastel Custom Keycap Set',
      de: 'Pastell Custom-Keycap-Set',
      fr: 'Set de keycaps personnalisés pastel'
    },
    description: {
      en: '139-key PBT keycap set in pastel colors with dye-sublimation legends. Compatible with most mechanical keyboards.',
      de: '139-Tasten-PBT-Keycap-Set in Pastellfarben mit Sublimations-Legenden. Kompatibel mit den meisten mechanischen Tastaturen.',
      fr: 'Set de 39 keycaps PBT en couleurs pastel avec légendes par sublimation. Compatible avec la plupart des claviers mécaniques.'
    },
    price: 44.9,
    currency: 'EUR',
    image: '/acc-keycap.jpg',
    wireless: false,
    inStock: true,
    ceCertified: false,
    specs: [
      { label: { en: 'Material', de: 'Material', fr: 'Matériau' }, value: { en: 'PBT dye-sublimated', de: 'PBT sublimiert', fr: 'PBT sublimé' } },
      { label: { en: 'Keys', de: 'Tasten', fr: 'Touches' }, value: { en: '139 keys, full set', de: '139 Tasten, komplettes Set', fr: '139 touches, set complet' } },
      { label: { en: 'Profile', de: 'Profil', fr: 'Profil' }, value: { en: 'Cherry profile', de: 'Cherry-Profil', fr: 'Profil Cherry' } },
      { label: { en: 'Layout', de: 'Layout', fr: 'Disposition' }, value: { en: 'ISO/ANSI compatible', de: 'ISO/ANSI kompatibel', fr: 'ISO/ANSI compatible' } }
    ]
  }
];

export const CATEGORY_LIST: ProductCategory[] = [
  'mouse',
  'keyboard',
  'laptop',
  'charger',
  'accessory'
];

// 工具函数
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

// 欧元价格格式化
export function formatPrice(price: number, locale: Locale = 'en'): string {
  const intlLocale = locale === 'en' ? 'en-IE' : locale === 'de' ? 'de-DE' : 'fr-FR';
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

// 下拉菜单筛选产品
export type ProductFilter = {
  category?: ProductCategory;
  wireless?: boolean;
  subCategory?: AccessorySubCategory;
};

export function filterProducts(list: Product[], f: ProductFilter): Product[] {
  return list.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (f.wireless !== undefined && p.wireless !== f.wireless) return false;
    if (f.subCategory && p.subCategory !== f.subCategory) return false;
    return true;
  });
}

// 导航下拉菜单所对应的筛选
// 键盘 / 鼠标 用 wireless 区分有线无线；充电类用 charger + subCategory=charging；
// 鼠标垫 / 键帽 / 线材 等用 accessory + subCategory
export const NAV_MENU_FILTERS = {
  keyboardWired: { category: 'keyboard' as const, wireless: false },
  keyboardWireless: { category: 'keyboard' as const, wireless: true },
  mouseWired: { category: 'mouse' as const, wireless: false },
  mouseWireless: { category: 'mouse' as const, wireless: true },
  laptop: { category: 'laptop' as const },
  mousepad: { category: 'accessory' as const, subCategory: 'mousepad' as const },
  keycap: { category: 'accessory' as const, subCategory: 'keycap' as const },
  charging: { subCategory: 'charging' as const },
};
