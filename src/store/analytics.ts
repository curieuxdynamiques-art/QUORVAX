'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PageType =
  | 'home'
  | 'products'
  | 'product_detail'
  | 'cart'
  | 'checkout'
  | 'about'
  | 'contact'
  | 'admin'
  | 'admin_products'
  | 'admin_sales'
  | 'admin_analytics'
  | 'other';

export type AnalyticEvent =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export type PageView = {
  id: string;
  sessionId: string;
  path: string;
  pageType: PageType;
  referrer?: string;
  country?: string;
  device: DeviceType;
  locale: string;
  createdAt: string;
};

export type AnalyticEventRecord = {
  id: string;
  sessionId: string;
  event: AnalyticEvent;
  path: string;
  productId?: string;
  productName?: string;
  amount?: number;
  quantity?: number;
  device: DeviceType;
  country?: string;
  locale: string;
  createdAt: string;
};

export type DailyTraffic = {
  date: string;
  pageViews: number;
  uniqueSessions: number;
  events: number;
};

export type PageTypeStat = {
  pageType: PageType;
  views: number;
};

export type FunnelStep = {
  step: AnalyticEvent | 'page_view';
  label: string;
  count: number;
  rate: number;
};

export type AnalyticsState = {
  pageViews: PageView[];
  events: AnalyticEventRecord[];
  currentSessionId: string;

  trackPageView: (path: string, opts?: { referrer?: string; locale?: string }) => void;
  trackEvent: (event: AnalyticEvent, opts?: {
    path?: string;
    productId?: string;
    productName?: string;
    amount?: number;
    quantity?: number;
    locale?: string;
  }) => void;

  getOverview: (days?: number) => {
    pageViews: number;
    uniqueSessions: number;
    events: number;
    avgSessionDuration: number;
  };
  getDailyTraffic: (days?: number) => DailyTraffic[];
  getTopPages: (days?: number, limit?: number) => (PageView & { views: number })[];
  getPageTypeStats: (days?: number) => PageTypeStat[];
  getTopProductsViewed: (days?: number, limit?: number) => { productId: string; productName?: string; views: number }[];
  getTopProductsAddedToCart: (days?: number, limit?: number) => { productId: string; productName?: string; count: number }[];
  getDeviceDistribution: (days?: number) => { device: DeviceType; count: number }[];
  getFunnel: (days?: number) => FunnelStep[];
  clearAll: () => void;
};

function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  );
}

function getDevice(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function classifyPath(path: string): PageType {
  const p = path.split(/[?#]/)[0].replace(/^\/[a-z]{2}/, '').replace(/\/+$/, '') || '/';
  if (p === '/' || p === '') return 'home';
  if (p === '/products') return 'products';
  if (p.startsWith('/products/')) return 'product_detail';
  if (p === '/cart') return 'cart';
  if (p.startsWith('/checkout')) return 'checkout';
  if (p === '/about') return 'about';
  if (p === '/contact') return 'contact';
  if (p === '/admin') return 'admin';
  if (p.startsWith('/admin/products')) return 'admin_products';
  if (p.startsWith('/admin/sales')) return 'admin_sales';
  if (p.startsWith('/admin/analytics')) return 'admin_analytics';
  return 'other';
}

function stripLocale(path: string) {
  const p = path.split(/[?#]/)[0];
  return p.replace(/^\/[a-z]{2}\b/, '') || '/';
}

function daysAgoStart(days: number): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (days - 1));
  return d.getTime();
}

export const useAnalytics = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      pageViews: [],
      events: [],
      currentSessionId: '',

      trackPageView: (path, opts) => {
        const state = get();
        let sessionId = state.currentSessionId;
        if (!sessionId) {
          sessionId = 's_' + uid();
          set({ currentSessionId: sessionId });
        }
        const locale = opts?.locale || 'en';
        const pv: PageView = {
          id: 'pv_' + uid(),
          sessionId,
          path: stripLocale(path),
          pageType: classifyPath(path),
          referrer: opts?.referrer,
          device: getDevice(),
          locale,
          createdAt: new Date().toISOString(),
        };
        set({ pageViews: [...state.pageViews, pv].slice(-5000) });
      },

      trackEvent: (event, opts) => {
        const state = get();
        let sessionId = state.currentSessionId;
        if (!sessionId) {
          sessionId = 's_' + uid();
          set({ currentSessionId: sessionId });
        }
        const locale = opts?.locale || 'en';
        const rec: AnalyticEventRecord = {
          id: 'ev_' + uid(),
          sessionId,
          event,
          path: stripLocale(opts?.path || (typeof window !== 'undefined' ? window.location.pathname : '/')),
          productId: opts?.productId,
          productName: opts?.productName,
          amount: opts?.amount,
          quantity: opts?.quantity,
          device: getDevice(),
          locale,
          createdAt: new Date().toISOString(),
        };
        set({ events: [...state.events, rec].slice(-5000) });
      },

      getOverview: (days = 14) => {
        const state = get();
        const since = daysAgoStart(days);
        const pvs = state.pageViews.filter((p) => new Date(p.createdAt).getTime() >= since);
        const evs = state.events.filter((e) => new Date(e.createdAt).getTime() >= since);
        const sessions = new Set(pvs.map((p) => p.sessionId));
        let totalDur = 0;
        const sessionGroups = new Map<string, number[]>();
        for (const pv of pvs) {
          const list = sessionGroups.get(pv.sessionId) || [];
          list.push(new Date(pv.createdAt).getTime());
          sessionGroups.set(pv.sessionId, list);
        }
        sessionGroups.forEach((times) => {
          if (times.length >= 2) {
            times.sort((a, b) => a - b);
            totalDur += times[times.length - 1] - times[0];
          }
        });
        const avg = sessions.size > 0 ? totalDur / sessions.size / 1000 : 0;
        return {
          pageViews: pvs.length,
          uniqueSessions: sessions.size,
          events: evs.length,
          avgSessionDuration: avg,
        };
      },

      getDailyTraffic: (days = 14) => {
        const state = get();
        const since = daysAgoStart(days);
        const out: Map<string, DailyTraffic> = new Map();
        for (let i = 0; i < days; i++) {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          d.setDate(d.getDate() - (days - 1 - i));
          const key = d.toISOString().slice(0, 10);
          out.set(key, { date: key, pageViews: 0, uniqueSessions: 0, events: 0 });
        }
        const sessionsPerDay = new Map<string, Set<string>>();
        for (const pv of state.pageViews) {
          const t = new Date(pv.createdAt).getTime();
          if (t < since) continue;
          const key = pv.createdAt.slice(0, 10);
          const r = out.get(key);
          if (!r) continue;
          r.pageViews++;
          const s = sessionsPerDay.get(key) || new Set();
          s.add(pv.sessionId);
          sessionsPerDay.set(key, s);
        }
        for (const ev of state.events) {
          const t = new Date(ev.createdAt).getTime();
          if (t < since) continue;
          const key = ev.createdAt.slice(0, 10);
          const r = out.get(key);
          if (r) r.events++;
        }
        sessionsPerDay.forEach((s, key) => {
          const r = out.get(key);
          if (r) r.uniqueSessions = s.size;
        });
        return Array.from(out.values());
      },

      getTopPages: (days = 14, limit = 10) => {
        const state = get();
        const since = daysAgoStart(days);
        const map = new Map<string, PageView & { views: number }>();
        for (const pv of state.pageViews) {
          if (new Date(pv.createdAt).getTime() < since) continue;
          const key = pv.path;
          const existing = map.get(key);
          if (existing) {
            existing.views++;
          } else {
            map.set(key, { ...pv, views: 1 });
          }
        }
        return Array.from(map.values())
          .sort((a, b) => b.views - a.views)
          .slice(0, limit);
      },

      getPageTypeStats: (days = 14) => {
        const state = get();
        const since = daysAgoStart(days);
        const counter: Record<string, number> = {};
        for (const pv of state.pageViews) {
          if (new Date(pv.createdAt).getTime() < since) continue;
          counter[pv.pageType] = (counter[pv.pageType] || 0) + 1;
        }
        return Object.entries(counter).map(([pageType, views]) => ({
          pageType: pageType as PageType,
          views,
        }));
      },

      getTopProductsViewed: (days = 14, limit = 10) => {
        const state = get();
        const since = daysAgoStart(days);
        const counter = new Map<string, { productId: string; productName?: string; views: number }>();
        for (const ev of state.events) {
          if (ev.event !== 'product_view') continue;
          if (new Date(ev.createdAt).getTime() < since) continue;
          if (!ev.productId) continue;
          const e = counter.get(ev.productId);
          if (e) e.views++;
          else counter.set(ev.productId, { productId: ev.productId, productName: ev.productName, views: 1 });
        }
        return Array.from(counter.values())
          .sort((a, b) => b.views - a.views)
          .slice(0, limit);
      },

      getTopProductsAddedToCart: (days = 14, limit = 10) => {
        const state = get();
        const since = daysAgoStart(days);
        const counter = new Map<string, { productId: string; productName?: string; count: number }>();
        for (const ev of state.events) {
          if (ev.event !== 'add_to_cart') continue;
          if (new Date(ev.createdAt).getTime() < since) continue;
          if (!ev.productId) continue;
          const e = counter.get(ev.productId);
          if (e) e.count++;
          else counter.set(ev.productId, { productId: ev.productId, productName: ev.productName, count: 1 });
        }
        return Array.from(counter.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);
      },

      getDeviceDistribution: (days = 14) => {
        const state = get();
        const since = daysAgoStart(days);
        const counter: Record<DeviceType, number> = { desktop: 0, tablet: 0, mobile: 0 };
        for (const pv of state.pageViews) {
          if (new Date(pv.createdAt).getTime() < since) continue;
          counter[pv.device]++;
        }
        return (['desktop', 'tablet', 'mobile'] as DeviceType[]).map((d) => ({
          device: d,
          count: counter[d],
        }));
      },

      getFunnel: (days = 14) => {
        const state = get();
        const since = daysAgoStart(days);
        const sessionsEver = new Set<string>();
        const funnelEvents: AnalyticEvent[] = [
          'page_view',
          'product_view',
          'add_to_cart',
          'begin_checkout',
          'purchase',
        ];
        const counts: Record<string, Set<string>> = {};
        for (const e of funnelEvents) counts[e] = new Set();

        for (const pv of state.pageViews) {
          if (new Date(pv.createdAt).getTime() < since) continue;
          sessionsEver.add(pv.sessionId);
          counts['page_view'].add(pv.sessionId);
        }
        for (const ev of state.events) {
          if (new Date(ev.createdAt).getTime() < since) continue;
          sessionsEver.add(ev.sessionId);
          if (counts[ev.event]) counts[ev.event].add(ev.sessionId);
        }

        const base = counts['page_view'].size || 1;
        const labels: Record<string, string> = {
          page_view: 'Visited Site',
          product_view: 'Viewed Product',
          add_to_cart: 'Added to Cart',
          begin_checkout: 'Started Checkout',
          purchase: 'Completed Purchase',
        };
        return funnelEvents.map((step) => ({
          step,
          label: labels[step] || step,
          count: counts[step].size,
          rate: Math.round((counts[step].size / base) * 100),
        }));
      },

      clearAll: () => {
        set({ pageViews: [], events: [] });
      },
    }),
    {
      name: 'eu-tech-analytics-data',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.currentSessionId) {
          state.currentSessionId = 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        }
        // Seed demo data if empty
        if (state.pageViews.length === 0) {
          const demoPvs: PageView[] = [];
          const demoEvs: AnalyticEventRecord[] = [];
          const locales = ['en', 'de', 'fr'];
          const devices: DeviceType[] = ['desktop', 'mobile', 'tablet'];
          const paths = [
            '/',
            '/products',
            '/products/ergowave-pro-mouse',
            '/products/keychron-q5-keyboard',
            '/products/soundpeats-air4-pro',
            '/products/anker-737-powerbank',
            '/cart',
            '/checkout',
            '/about',
          ];
          const now = Date.now();
          for (let i = 0; i < 40; i++) {
            const sessionId = 's_demo_' + i;
            const days = Math.floor(Math.random() * 14);
            const base = now - days * 86400000 - Math.floor(Math.random() * 86400000);
            const locale = locales[i % 3];
            const device = devices[i % 3];
            const sessionSteps = Math.floor(Math.random() * 5) + 1;
            for (let j = 0; j < sessionSteps; j++) {
              const path = paths[Math.floor(Math.random() * paths.length)];
              demoPvs.push({
                id: 'pv_demo_' + i + '_' + j,
                sessionId,
                path,
                pageType: classifyPath('/' + locale + path),
                device,
                locale,
                createdAt: new Date(base + j * 120000).toISOString(),
              });
            }
            // Events
            if (Math.random() > 0.3) {
              demoEvs.push({
                id: 'ev_demo_pv_' + i,
                sessionId,
                event: 'product_view',
                path: '/products/ergowave-pro-mouse',
                productId: 'mw-001',
                productName: 'ErgoWave Pro Mouse',
                device,
                locale,
                createdAt: new Date(base + 60000).toISOString(),
              });
            }
            if (Math.random() > 0.55) {
              demoEvs.push({
                id: 'ev_demo_atc_' + i,
                sessionId,
                event: 'add_to_cart',
                path: '/products/ergowave-pro-mouse',
                productId: 'mw-001',
                productName: 'ErgoWave Pro Mouse',
                quantity: 1,
                amount: 59.9,
                device,
                locale,
                createdAt: new Date(base + 180000).toISOString(),
              });
            }
            if (Math.random() > 0.7) {
              demoEvs.push({
                id: 'ev_demo_bc_' + i,
                sessionId,
                event: 'begin_checkout',
                path: '/checkout',
                device,
                locale,
                createdAt: new Date(base + 300000).toISOString(),
              });
            }
            if (Math.random() > 0.82) {
              demoEvs.push({
                id: 'ev_demo_pur_' + i,
                sessionId,
                event: 'purchase',
                path: '/checkout',
                amount: 59.9,
                device,
                locale,
                createdAt: new Date(base + 420000).toISOString(),
              });
            }
          }
          state.pageViews = demoPvs;
          state.events = demoEvs;
        }
      },
    }
  )
);
