'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StripeConfig = {
  enabled: boolean;
  publishableKey: string;
  secretKey: string;
};

export type PayPalConfig = {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
};

type PaymentConfigState = {
  stripe: StripeConfig;
  paypal: PayPalConfig;
  // 是否为演示模式（未接通真实 API）
  demoMode: boolean;
  updateStripe: (cfg: Partial<StripeConfig>) => void;
  updatePayPal: (cfg: Partial<PayPalConfig>) => void;
  setDemoMode: (v: boolean) => void;
  reset: () => void;
};

const defaultStripe: StripeConfig = {
  enabled: false,
  publishableKey: '',
  secretKey: ''
};

const defaultPayPal: PayPalConfig = {
  enabled: false,
  clientId: '',
  clientSecret: ''
};

export const usePaymentConfig = create<PaymentConfigState>()(
  persist(
    (set) => ({
      stripe: defaultStripe,
      paypal: defaultPayPal,
      demoMode: true,
      updateStripe: (cfg) =>
        set((state) => ({ stripe: { ...state.stripe, ...cfg } })),
      updatePayPal: (cfg) =>
        set((state) => ({ paypal: { ...state.paypal, ...cfg } })),
      setDemoMode: (v) => set({ demoMode: v }),
      reset: () =>
        set({
          stripe: defaultStripe,
          paypal: defaultPayPal,
          demoMode: true
        })
    }),
    {
      name: 'eu-tech-payment-config'
    }
  )
);

// 工具函数：判断某支付方式是否已配置可用
export function isStripeReady(cfg: StripeConfig): boolean {
  return cfg.enabled && !!cfg.publishableKey && !!cfg.secretKey;
}

export function isPayPalReady(cfg: PayPalConfig): boolean {
  return cfg.enabled && !!cfg.clientId;
}
