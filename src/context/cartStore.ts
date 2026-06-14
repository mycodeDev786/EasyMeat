'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, WeightOption } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, weight: WeightOption, quantity?: number) => void;
  removeItem: (productId: string, weightLabel: string) => void;
  updateQuantity: (productId: string, weightLabel: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getVAT: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, weight, quantity = 1) => {
        const items = get().items;
        const idx = items.findIndex(i => i.product.id === product.id && i.selectedWeight.label === weight.label);
        if (idx > -1) {
          const next = [...items];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          set({ items: next });
        } else {
          set({ items: [...items, { product, quantity, selectedWeight: weight }] });
        }
      },

      removeItem: (productId, weightLabel) => {
        set({ items: get().items.filter(i => !(i.product.id === productId && i.selectedWeight.label === weightLabel)) });
      },

      updateQuantity: (productId, weightLabel, quantity) => {
        if (quantity <= 0) { get().removeItem(productId, weightLabel); return; }
        set({ items: get().items.map(i => i.product.id === productId && i.selectedWeight.label === weightLabel ? { ...i, quantity } : i) });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set(s => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      getSubtotal: () => get().items.reduce((s, i) => s + i.selectedWeight.price * i.quantity, 0),
      getDeliveryFee: () => get().getSubtotal() >= 200 ? 0 : 25,
      getVAT: () => get().getSubtotal() * 0.05,
      getTotal: () => get().getSubtotal() + get().getDeliveryFee() + get().getVAT(),
    }),
    { name: 'EasyMeat-cart' }
  )
);
