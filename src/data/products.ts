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
  | 'storage';

export type Product = {
  id: string;
  slug: string;
  category: ProductCategory;
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
  // 头戴式耳机
  {
    id: 'hp-001',
    slug: 'studio-overear-headphones',
    category: 'headphone',
    name: {
      en: 'Studio Over-Ear Headphones',
      de: 'Studio Over-Ear-Kopfhörer',
      fr: 'Casque studio circum-aural'
    },
    description: {
      en: 'Professional over-ear headphones with 40mm drivers and hybrid ANC. Up to 50 hours battery.',
      de: 'Professionelle Over-Ear-Kopfhörer mit 40-mm-Treibern und hybridem ANC. Bis zu 50 Stunden Akku.',
      fr: 'Casque circum-aural professionnel avec pilotes 40mm et ANC hybride. Jusqu\'à 50h d\'autonomie.'
    },
    price: 129.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    wireless: true,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Driver', de: 'Treiber', fr: 'Pilote' }, value: { en: '40mm dynamic', de: '40mm dynamisch', fr: 'Dynamique 40mm' } },
      { label: { en: 'ANC', de: 'ANC', fr: 'RNC' }, value: { en: 'Hybrid active noise cancelling', de: 'Hybride aktive Geräuschunterdrückung', fr: 'Réduction de bruit active hybride' } },
      { label: { en: 'Battery', de: 'Akku', fr: 'Batterie' }, value: { en: '50 h playback', de: '50 Std. Wiedergabe', fr: '50 h de lecture' } },
      { label: { en: 'Codec', de: 'Codec', fr: 'Codec' }, value: { en: 'LDAC / AAC / SBC', de: 'LDAC / AAC / SBC', fr: 'LDAC / AAC / SBC' } }
    ]
  },
  // TWS 入耳式耳机
  {
    id: 'ep-001',
    slug: 'airpulse-tws-earbuds',
    category: 'earphone',
    name: {
      en: 'AirPulse TWS Earbuds',
      de: 'AirPulse TWS In-Ear-Kopfhörer',
      fr: 'Écouteurs TWS AirPulse'
    },
    description: {
      en: 'True wireless earbuds with adaptive ANC, spatial audio and IP55 water resistance.',
      de: 'True Wireless In-Ear-Kopfhörer mit adaptivem ANC, Raumklang und IP55-Schutz.',
      fr: 'Écouteurs True Wireless avec ANC adaptatif, audio spatial et protection IP55.'
    },
    price: 79.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
    wireless: true,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'ANC', de: 'ANC', fr: 'RNC' }, value: { en: 'Adaptive -45 dB', de: 'Adaptiv -45 dB', fr: 'Adaptatif -45 dB' } },
      { label: { en: 'Battery', de: 'Akku', fr: 'Batterie' }, value: { en: '8 h earbuds + 32 h case', de: '8 h Earbuds + 32 h Ladecase', fr: '8 h écouteurs + 32 h boîtier' } },
      { label: { en: 'Waterproof', de: 'Wasserschutz', fr: 'Étanche' }, value: { en: 'IP55', de: 'IP55', fr: 'IP55' } },
      { label: { en: 'Codec', de: 'Codec', fr: 'Codec' }, value: { en: 'LC3 / AAC / SBC', de: 'LC3 / AAC / SBC', fr: 'LC3 / AAC / SBC' } }
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
  // 平板电脑
  {
    id: 'tb-001',
    slug: 'slate-11-tablet',
    category: 'tablet',
    name: {
      en: 'Slate 11 Tablet',
      de: 'Slate 11 Tablet',
      fr: 'Tablette Slate 11'
    },
    description: {
      en: '11" 2K display tablet with stylus support, 8GB RAM and 256GB storage. Wi-Fi 6.',
      de: '11" 2K Tablet mit Stift-Unterstützung, 8GB RAM und 256GB Speicher. Wi-Fi 6.',
      fr: 'Tablette 11" écran 2K avec prise en charge du stylet, 8Go RAM et 256Go de stockage. Wi-Fi 6.'
    },
    price: 379.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    wireless: true,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Display', de: 'Display', fr: 'Écran' }, value: { en: '11" 2K 120Hz LCD', de: '11" 2K 120Hz LCD', fr: '11" 2K 120Hz LCD' } },
      { label: { en: 'SoC', de: 'SoC', fr: 'SoC' }, value: { en: 'Qualcomm Snapdragon 7 Gen 2', de: 'Qualcomm Snapdragon 7 Gen 2', fr: 'Qualcomm Snapdragon 7 Gen 2' } },
      { label: { en: 'Storage', de: 'Speicher', fr: 'Stockage' }, value: { en: '8GB RAM + 256GB', de: '8GB RAM + 256GB', fr: '8Go RAM + 256Go' } },
      { label: { en: 'Stylus', de: 'Eingabestift', fr: 'Stylet' }, value: { en: '4096 levels included', de: '4096 Stufen inklusive', fr: '4096 niveaux inclus' } }
    ]
  },
  // 显示器
  {
    id: 'mn-001',
    slug: 'viewpro-27-4k-monitor',
    category: 'monitor',
    name: {
      en: 'ViewPro 27" 4K Monitor',
      de: 'ViewPro 27" 4K-Monitor',
      fr: 'Écran ViewPro 27" 4K'
    },
    description: {
      en: '27-inch 4K IPS monitor with 99% sRGB, HDR10 and USB-C 90W Power Delivery.',
      de: '27-Zoll-4K-IPS-Monitor mit 99 % sRGB, HDR10 und USB-C 90W Power Delivery.',
      fr: 'Écran IPS 4K 27 pouces avec 99% sRGB, HDR10 et USB-C Power Delivery 90W.'
    },
    price: 389.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
    wireless: false,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Resolution', de: 'Auflösung', fr: 'Résolution' }, value: { en: '3840×2160 4K UHD', de: '3840×2160 4K UHD', fr: '3840×2160 4K UHD' } },
      { label: { en: 'Panel', de: 'Panel', fr: 'Panneau' }, value: { en: 'IPS 10-bit, 99% sRGB', de: 'IPS 10-bit, 99 % sRGB', fr: 'IPS 10-bit, 99% sRGB' } },
      { label: { en: 'Refresh', de: 'Bildwiederh.', fr: 'Rafraîchissement' }, value: { en: '60 Hz', de: '60 Hz', fr: '60 Hz' } },
      { label: { en: 'Ports', de: 'Anschlüsse', fr: 'Ports' }, value: { en: 'USB-C PD 90W / 2× HDMI / DP', de: 'USB-C PD 90W / 2× HDMI / DP', fr: 'USB-C PD 90W / 2× HDMI / DP' } }
    ]
  },
  // 充电器
  {
    id: 'ch-001',
    slug: 'gan-140w-fast-charger',
    category: 'charger',
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
  // 充电宝
  {
    id: 'pb-001',
    slug: 'powergo-20k-powerbank',
    category: 'powerbank',
    name: {
      en: 'PowerGo 20,000mAh Power Bank',
      de: 'PowerGo 20.000-mAh-Powerbank',
      fr: 'Batterie externe PowerGo 20 000 mAh'
    },
    description: {
      en: '20,000mAh power bank with 100W USB-C PD output — charges a laptop on the go.',
      de: '20.000-mAh-Powerbank mit 100W-USB-C-PD-Ausgang — lädt Laptops unterwegs.',
      fr: 'Batterie externe 20 000 mAh avec sortie USB-C PD 100W — recharge un ordinateur portable.'
    },
    price: 59.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1609592866015-119cd52f8761?w=800',
    wireless: false,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Capacity', de: 'Kapazität', fr: 'Capacité' }, value: { en: '20,000mAh', de: '20.000 mAh', fr: '20 000 mAh' } },
      { label: { en: 'Output', de: 'Ausgang', fr: 'Sortie' }, value: { en: 'USB-C PD 100W bidirectional', de: 'USB-C PD 100W bidirektional', fr: 'USB-C PD 100W bidirectionnel' } },
      { label: { en: 'Ports', de: 'Ports', fr: 'Ports' }, value: { en: '2× USB-C / 1× USB-A', de: '2× USB-C / 1× USB-A', fr: '2× USB-C / 1× USB-A' } },
      { label: { en: 'Flight safe', de: 'Flugtauglich', fr: 'Autorisé en avion' }, value: { en: 'Yes (74 Wh)', de: 'Ja (74 Wh)', fr: 'Oui (74 Wh)' } }
    ]
  },
  // 线缆
  {
    id: 'cb-001',
    slug: 'usb4-cable-2m',
    category: 'cable',
    name: {
      en: 'USB4 40Gbps Cable 2m',
      de: 'USB4 40-Gbit/s-Kabel 2 m',
      fr: 'Câble USB4 40 Gbit/s 2 m'
    },
    description: {
      en: 'Premium USB4 Type-C cable — 40Gbps data, 8K video and 240W PD charging all-in-one.',
      de: 'Premium-USB4-Typ-C-Kabel — 40 Gbit/s Daten, 8K-Video und 240W-PD-Ladung in einem.',
      fr: 'Câble USB4 Type-C premium — 40 Gbit/s données, vidéo 8K et charge PD 240W tout-en-un.'
    },
    price: 29.9,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    wireless: false,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Standard', de: 'Standard', fr: 'Standard' }, value: { en: 'USB4 v2 40Gbps', de: 'USB4 v2 40 Gbit/s', fr: 'USB4 v2 40 Gbit/s' } },
      { label: { en: 'Power', de: 'Leistung', fr: 'Puissance' }, value: { en: '240W EPR PD charging', de: '240W EPR PD-Ladung', fr: 'Charge PD 240W EPR' } },
      { label: { en: 'Video', de: 'Video', fr: 'Vidéo' }, value: { en: '8K@60Hz or dual 4K', de: '8K@60Hz oder dual 4K', fr: '8K@60Hz ou double 4K' } },
      { label: { en: 'Length', de: 'Länge', fr: 'Longueur' }, value: { en: '2.0 m braided', de: '2,0 m geflochten', fr: '2,0 m tressé' } }
    ]
  },
  // USB Hub
  {
    id: 'hub-001',
    slug: 'docking-12in1-usb-c-hub',
    category: 'usb_hub',
    name: {
      en: 'Docking 12-in-1 USB-C Hub',
      de: 'Docking 12-in-1 USB-C Hub',
      fr: 'Hub USB-C Docking 12-en-1'
    },
    description: {
      en: '12-in-1 USB-C docking station with dual HDMI, Ethernet, card reader and 100W PD pass-through.',
      de: '12-in-1 USB-C Dockingstation mit dual HDMI, Ethernet, Kartenleser und 100W PD-Passthrough.',
      fr: 'Station d\'accueil USB-C 12-en-1 avec double HDMI, Ethernet, lecteur de cartes et PD 100W pass-through.'
    },
    price: 64.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=800',
    wireless: false,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Video', de: 'Video', fr: 'Vidéo' }, value: { en: '2× HDMI 4K@60Hz', de: '2× HDMI 4K@60Hz', fr: '2× HDMI 4K@60Hz' } },
      { label: { en: 'USB', de: 'USB', fr: 'USB' }, value: { en: '4× USB-A 3.2 + 2× USB-C', de: '4× USB-A 3.2 + 2× USB-C', fr: '4× USB-A 3.2 + 2× USB-C' } },
      { label: { en: 'Network', de: 'Netzwerk', fr: 'Réseau' }, value: { en: 'Gigabit Ethernet', de: 'Gigabit-Ethernet', fr: 'Ethernet Gigabit' } },
      { label: { en: 'PD', de: 'PD', fr: 'PD' }, value: { en: '100W pass-through', de: '100W Pass-Through', fr: 'Pass-Through 100W' } }
    ]
  },
  // 摄像头
  {
    id: 'wc-001',
    slug: '4k-streaming-webcam',
    category: 'webcam',
    name: {
      en: '4K Streaming Webcam',
      de: '4K Streaming-Webcam',
      fr: 'Webcam de streaming 4K'
    },
    description: {
      en: '4K ultra HD webcam with auto-focus, ring light, stereo mics and tripod mount.',
      de: '4K-UHD-Webcam mit Autofokus, Ringlicht, Stereomikros und Stativhalterung.',
      fr: 'Webcam ultra HD 4K avec autofocus, anneau lumineux, micros stéréo et support trépied.'
    },
    price: 89.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
    wireless: false,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Resolution', de: 'Auflösung', fr: 'Résolution' }, value: { en: '4K@30fps / 1080p@60fps', de: '4K@30fps / 1080p@60fps', fr: '4K@30fps / 1080p@60fps' } },
      { label: { en: 'Focus', de: 'Fokus', fr: 'Focus' }, value: { en: 'Fast auto-focus', de: 'Schneller Autofokus', fr: 'Autofocus rapide' } },
      { label: { en: 'Light', de: 'Licht', fr: 'Lumière' }, value: { en: 'Ring light 3-level', de: 'Ringlicht 3 Stufen', fr: 'Anneau lumineux 3 niveaux' } },
      { label: { en: 'Microphone', de: 'Mikrofon', fr: 'Microphone' }, value: { en: 'Dual stereo noise cancel', de: 'Dual-Stereo mit Geräuschunterdrückung', fr: 'Double stéréo anti-bruit' } }
    ]
  },
  // 音箱
  {
    id: 'sp-001',
    slug: 'soundwave-360-bluetooth-speaker',
    category: 'speaker',
    name: {
      en: 'SoundWave 360° Bluetooth Speaker',
      de: 'SoundWave 360° Bluetooth-Lautsprecher',
      fr: 'Enceinte Bluetooth SoundWave 360°'
    },
    description: {
      en: '360° portable Bluetooth speaker with deep bass, IP67 waterproof and 20h battery.',
      de: '360° portabler Bluetooth-Lautsprecher mit starkem Bass, IP67-Schutz und 20 h Akku.',
      fr: 'Enceinte Bluetooth portable 360° avec basses profondes, étanche IP67 et 20h d\'autonomie.'
    },
    price: 69.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
    wireless: true,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Output', de: 'Ausgang', fr: 'Puissance' }, value: { en: '2× 10W drivers + bass radiator', de: '2× 10W Treiber + Bassstrahler', fr: '2× 10W pilotes + radiateur basse' } },
      { label: { en: 'Waterproof', de: 'Schutz', fr: 'Étanche' }, value: { en: 'IP67 dust & waterproof', de: 'IP67 staub- & wasserdicht', fr: 'Étanche poussière et eau IP67' } },
      { label: { en: 'Battery', de: 'Akku', fr: 'Batterie' }, value: { en: '20 hours playback', de: '20 Stunden Wiedergabe', fr: '20 heures de lecture' } },
      { label: { en: 'Multi-room', de: 'Multiroom', fr: 'Multi-room' }, value: { en: 'TWS stereo pairing', de: 'TWS-Stereo-Pairing', fr: 'Appairage stéréo TWS' } }
    ]
  },
  // 智能手表
  {
    id: 'sw-001',
    slug: 'fitpulse-smartwatch',
    category: 'smartwatch',
    name: {
      en: 'FitPulse Smartwatch',
      de: 'FitPulse Smartwatch',
      fr: 'Montre connectée FitPulse'
    },
    description: {
      en: 'AMOLED smartwatch with 14-day battery, 100+ sport modes, GPS, and SpO2 monitoring.',
      de: 'AMOLED-Smartwatch mit 14-Tage-Akku, 100+ Sportmodi, GPS und SpO2-Messung.',
      fr: 'Montre connectée AMOLED avec 14 jours d\'autonomie, 100+ modes sport, GPS et surveillance SpO2.'
    },
    price: 129.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
    wireless: true,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Display', de: 'Display', fr: 'Écran' }, value: { en: '1.43" AMOLED 466×466', de: '1,43" AMOLED 466×466', fr: '1,43" AMOLED 466×466' } },
      { label: { en: 'Sensors', de: 'Sensoren', fr: 'Capteurs' }, value: { en: 'HR / SpO2 / ECG / GPS', de: 'HR / SpO2 / EKG / GPS', fr: 'FC / SpO2 / ECG / GPS' } },
      { label: { en: 'Battery', de: 'Akku', fr: 'Batterie' }, value: { en: 'Up to 14 days', de: 'Bis zu 14 Tage', fr: "Jusqu'à 14 jours" } },
      { label: { en: 'Waterproof', de: 'Wasserschutz', fr: 'Étanche' }, value: { en: '5 ATM', de: '5 ATM', fr: '5 ATM' } }
    ]
  },
  // 存储
  {
    id: 'st-001',
    slug: 'nvme-1tb-portable-ssd',
    category: 'storage',
    name: {
      en: 'NVMe 1TB Portable SSD',
      de: 'NVMe 1TB Portable SSD',
      fr: 'SSD portable NVMe 1To'
    },
    description: {
      en: 'Pocket-sized portable NVMe SSD with USB 3.2 Gen 2x2 — up to 2000 MB/s read.',
      de: 'Taschengroße portable NVMe-SSD mit USB 3.2 Gen 2x2 — bis zu 2000 MB/s Lesen.',
      fr: 'SSD NVMe portable de poche avec USB 3.2 Gen 2x2 — lecture jusqu\'à 2000 Mo/s.'
    },
    price: 89.0,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800',
    wireless: false,
    inStock: true,
    ceCertified: true,
    specs: [
      { label: { en: 'Capacity', de: 'Kapazität', fr: 'Capacité' }, value: { en: '1TB (up to 4TB)', de: '1TB (bis zu 4TB)', fr: '1To (jusqu\'à 4To)' } },
      { label: { en: 'Interface', de: 'Schnittstelle', fr: 'Interface' }, value: { en: 'USB 3.2 Gen 2x2 Type-C', de: 'USB 3.2 Gen 2x2 Typ-C', fr: 'USB 3.2 Gen 2x2 Type-C' } },
      { label: { en: 'Read / Write', de: 'Lesen / Schreiben', fr: 'Lecture / Écriture' }, value: { en: '2000 / 1800 MB/s', de: '2000 / 1800 MB/s', fr: '2000 / 1800 Mo/s' } },
      { label: { en: 'Shockproof', de: 'Stoßfest', fr: 'Antichoc' }, value: { en: '2 m drop, IP55', de: '2 m Fall, IP55', fr: 'Chute 2 m, IP55' } }
    ]
  }
];

export const CATEGORY_LIST: ProductCategory[] = [
  'mouse',
  'keyboard',
  'headphone',
  'earphone',
  'laptop',
  'tablet',
  'monitor',
  'charger',
  'powerbank',
  'cable',
  'usb_hub',
  'webcam',
  'speaker',
  'smartwatch',
  'storage'
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
