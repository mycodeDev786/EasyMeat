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
        const existingIndex = items.findIndex(
          i => i.product.id === product.id && i.selectedWeight.label === weight.label
        );
        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({ items: [...items, { product, quantity, selectedWeight: weight }] });
        }
      },

      removeItem: (productId, weightLabel) => {
        set({ items: get().items.filter(
          i => !(i.product.id === productId && i.selectedWeight.label === weightLabel)
        )});
      },

      updateQuantity: (productId, weightLabel, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, weightLabel);
          return;
        }
        const newItems = get().items.map(i =>
          i.product.id === productId && i.selectedWeight.label === weightLabel
            ? { ...i, quantity }
            : i
        );
        set({ items: newItems });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set(s => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () => get().items.reduce(
        (sum, i) => sum + i.selectedWeight.price * i.quantity, 0
      ),

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 200 ? 0 : 25;
      },

      getVAT: () => get().getSubtotal() * 0.05,

      getTotal: () => {
        const sub = get().getSubtotal();
        const fee = get().getDeliveryFee();
        const vat = get().getVAT();
        return sub + fee + vat;
      },
    }),
    { name: 'meat-cart' }
  )
);
