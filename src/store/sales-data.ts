'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/data/products';

export type OrderStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export type OrderItem = {
  productId: string;
  name: Record<string, string>;
  slug: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: 'EUR';
  paymentMethod: 'card' | 'paypal';
  status: OrderStatus;
  customerEmail?: string;
  country?: string;
  createdAt: string; // ISO 8601
};

type SalesDataState = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  getOrders: () => Order[];
  getStats: () => SalesStats;
  getRecentOrders: (limit?: number) => Order[];
  getProductSales: () => ProductSales[];
  getPaymentMethodDistribution: () => PaymentMethodDist[];
  getDailyRevenue: (days?: number) => DailyRevenue[];
  clearAll: () => void;
};

export type SalesStats = {
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  avgOrderValue: number;
  completedOrders: number;
  refundedOrders: number;
};

export type ProductSales = {
  productId: string;
  name: Record<string, string>;
  slug: string;
  image: string;
  quantity: number;
  revenue: number;
};

export type PaymentMethodDist = {
  method: 'card' | 'paypal';
  count: number;
  revenue: number;
  percentage: number;
};

export type DailyRevenue = {
  date: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
};

function generateOrderId(): string {
  return `VK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

// 生成模拟历史订单数据（仅首次初始化时使用）
function generateMockOrders(): Order[] {
  const products = [
    { id: 'm-001', name: { en: 'Aurora Wireless Mouse', de: 'Aurora kabellose Maus', fr: 'Souris sans fil Aurora' }, slug: 'aurora-wireless-mouse', price: 29.9, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800' },
    { id: 'm-002', name: { en: 'Precision Wired Mouse', de: 'Präzisionskabelmaus', fr: 'Souris filaire de précision' }, slug: 'precision-wired-mouse', price: 19.9, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800' },
    { id: 'k-001', name: { en: 'Nebula Wireless Keyboard', de: 'Nebula kabellose Tastatur', fr: 'Clavier sans fil Nebula' }, slug: 'nebula-wireless-keyboard', price: 49.9, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800' },
    { id: 'k-002', name: { en: 'Mechanical RGB Keyboard', de: 'Mechanische RGB-Tastatur', fr: 'Clavier mécanique RGB' }, slug: 'mechanical-rgb-keyboard', price: 89.9, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800' },
    { id: 'hp-001', name: { en: 'Studio Over-Ear Headphones', de: 'Studio Over-Ear-Kopfhörer', fr: 'Casque studio circum-aural' }, slug: 'studio-overear-headphones', price: 129.0, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
    { id: 'ep-001', name: { en: 'AirPulse TWS Earbuds', de: 'AirPulse TWS In-Ear-Kopfhörer', fr: 'Écouteurs TWS AirPulse' }, slug: 'airpulse-tws-earbuds', price: 79.0, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800' },
    { id: 'lp-001', name: { en: 'TravelBook 14 Ultrabook', de: 'TravelBook 14 Ultrabook', fr: 'Ultrabook TravelBook 14' }, slug: 'travelbook-14-ultrabook', price: 899.0, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800' },
    { id: 'tb-001', name: { en: 'Slate 11 Tablet', de: 'Slate 11 Tablet', fr: 'Tablette Slate 11' }, slug: 'slate-11-tablet', price: 379.0, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' },
    { id: 'mn-001', name: { en: 'ViewPro 27" 4K Monitor', de: 'ViewPro 27" 4K-Monitor', fr: 'Écran ViewPro 27" 4K' }, slug: 'viewpro-27-4k-monitor', price: 389.0, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800' },
    { id: 'ch-001', name: { en: 'GaN 140W Fast Charger', de: 'GaN 140W Schnellladegerät', fr: 'Chargeur rapide GaN 140W' }, slug: 'gan-140w-fast-charger', price: 69.0, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800' },
    { id: 'pb-001', name: { en: 'PowerGo 20,000mAh Power Bank', de: 'PowerGo 20.000-mAh-Powerbank', fr: 'Batterie externe PowerGo 20 000 mAh' }, slug: 'powergo-20k-powerbank', price: 59.0, image: 'https://images.unsplash.com/photo-1609592866015-119cd52f8761?w=800' },
    { id: 'cb-001', name: { en: 'USB4 40Gbps Cable 2m', de: 'USB4 40-Gbit/s-Kabel 2 m', fr: 'Câble USB4 40 Gbit/s 2 m' }, slug: 'usb4-cable-2m', price: 29.9, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800' },
    { id: 'hub-001', name: { en: 'Docking 12-in-1 USB-C Hub', de: 'Docking 12-in-1 USB-C Hub', fr: 'Hub USB-C Docking 12-en-1' }, slug: 'docking-12in1-usb-c-hub', price: 64.0, image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=800' },
    { id: 'wc-001', name: { en: '4K Streaming Webcam', de: '4K Streaming-Webcam', fr: 'Webcam de streaming 4K' }, slug: '4k-streaming-webcam', price: 89.0, image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800' },
    { id: 'sp-001', name: { en: 'SoundWave 360° Bluetooth Speaker', de: 'SoundWave 360° Bluetooth-Lautsprecher', fr: 'Enceinte Bluetooth SoundWave 360°' }, slug: 'soundwave-360-bluetooth-speaker', price: 69.0, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800' },
    { id: 'sw-001', name: { en: 'FitPulse Smartwatch', de: 'FitPulse Smartwatch', fr: 'Montre connectée FitPulse' }, slug: 'fitpulse-smartwatch', price: 129.0, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800' },
    { id: 'st-001', name: { en: 'NVMe 1TB Portable SSD', de: 'NVMe 1TB Portable SSD', fr: 'SSD portable NVMe 1To' }, slug: 'nvme-1tb-portable-ssd', price: 89.0, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800' }
  ];

  const countries = ['DE', 'FR', 'NL', 'BE', 'AT', 'IT', 'ES', 'PL', 'GB'];
  const methods: ('card' | 'paypal')[] = ['card', 'paypal'];
  const statuses: OrderStatus[] = ['completed', 'completed', 'completed', 'completed', 'completed', 'pending', 'refunded'];

  const orders: Order[] = [];
  const now = new Date();

  // 生成过去 60 天的订单
  for (let i = 0; i < 180; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    const numItems = Math.floor(Math.random() * 3) + 1;
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const p = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      orderItems.push({
        productId: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        quantity: qty,
        image: p.image
      });
      subtotal += p.price * qty;
    }

    const shipping = subtotal >= 49 ? 0 : 4.95;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];

    // 退款订单只计算部分金额
    const total = status === 'refunded' ? 0 : subtotal + shipping;

    orders.push({
      id: `VK-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${date.getTime().toString(36).slice(-4).toUpperCase()}`,
      items: orderItems,
      subtotal,
      shipping,
      total,
      currency: 'EUR',
      paymentMethod: method,
      status,
      country,
      createdAt: date.toISOString()
    });
  }

  // 按时间倒序
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const useSalesData = create<SalesDataState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData) => {
        const order: Order = {
          ...orderData,
          id: generateOrderId(),
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          orders: [order, ...state.orders]
        }));
        return order;
      },

      getOrders: () => get().orders,

      getStats: () => {
        const orders = get().orders;
        const completed = orders.filter((o) => o.status === 'completed');
        const totalRevenue = completed.reduce((sum, o) => sum + o.total, 0);
        const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((is, it) => is + it.quantity, 0), 0);

        return {
          totalRevenue,
          totalOrders: orders.length,
          totalItems,
          avgOrderValue: completed.length > 0 ? totalRevenue / completed.length : 0,
          completedOrders: completed.length,
          refundedOrders: orders.filter((o) => o.status === 'refunded').length
        };
      },

      getRecentOrders: (limit = 10) => {
        return get().orders.slice(0, limit);
      },

      getProductSales: () => {
        const map = new Map<string, ProductSales>();
        get().orders.forEach((order) => {
          order.items.forEach((item) => {
            const existing = map.get(item.productId);
            if (existing) {
              existing.quantity += item.quantity;
              existing.revenue += item.price * item.quantity;
            } else {
              map.set(item.productId, {
                productId: item.productId,
                name: item.name,
                slug: item.slug,
                image: item.image,
                quantity: item.quantity,
                revenue: item.price * item.quantity
              });
            }
          });
        });
        return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
      },

      getPaymentMethodDistribution: () => {
        const orders = get().orders.filter((o) => o.status === 'completed');
        const total = orders.length;
        if (total === 0) return [];

        const cardOrders = orders.filter((o) => o.paymentMethod === 'card');
        const paypalOrders = orders.filter((o) => o.paymentMethod === 'paypal');
        const cardRevenue = cardOrders.reduce((s, o) => s + o.total, 0);
        const paypalRevenue = paypalOrders.reduce((s, o) => s + o.total, 0);

        return [
          {
            method: 'card' as const,
            count: cardOrders.length,
            revenue: cardRevenue,
            percentage: Math.round((cardOrders.length / total) * 100)
          },
          {
            method: 'paypal' as const,
            count: paypalOrders.length,
            revenue: paypalRevenue,
            percentage: Math.round((paypalOrders.length / total) * 100)
          }
        ];
      },

      getDailyRevenue: (days = 30) => {
        const now = new Date();
        const result: DailyRevenue[] = [];

        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];

          const dayOrders = get().orders.filter((o) => {
            const oDate = o.createdAt.split('T')[0];
            return oDate === dateStr && o.status === 'completed';
          });

          result.push({
            date: dateStr,
            revenue: dayOrders.reduce((s, o) => s + o.total, 0),
            orders: dayOrders.length
          });
        }

        return result;
      },

      clearAll: () => set({ orders: [] })
    }),
    {
      name: 'eu-tech-sales-data',
      // 初始化时如果没有数据，填充模拟数据
      onRehydrateStorage: () => (state) => {
        if (state && state.orders.length === 0) {
          state.orders = generateMockOrders();
        }
      }
    }
  )
);
