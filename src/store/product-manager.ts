'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as staticProducts, type Product, type ProductCategory, type Locale } from '@/data/products';

type ProductManagerState = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  resetToDefault: () => void;
};

function generateId(category: ProductCategory): string {
  return `${category[0]}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export { slugify };

export const useProductManager = create<ProductManagerState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (productData) => {
        const product: Product = {
          ...productData,
          id: generateId(productData.category),
          slug: productData.slug || slugify(productData.name.en),
        };
        set((state) => ({ products: [...state.products, product] }));
        return product;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...updates,
                  slug: updates.slug || (updates.name?.en ? slugify(updates.name.en) : p.slug),
                }
              : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getProduct: (id) => get().products.find((p) => p.id === id),

      resetToDefault: () => set({ products: [] }),
    }),
    {
      name: 'eu-tech-product-manager',
      onRehydrateStorage: () => (state) => {
        if (state && state.products.length === 0) {
          state.products = [...staticProducts];
        }
      },
    }
  )
);
