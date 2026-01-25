import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItemType = 'vacation-package' | 'day-tour';

export interface CartItem {
  id: string;
  cartItemId: string; // Unique ID for this cart entry (allows same tour with different dates)
  type: CartItemType;
  name: string;
  image: string;
  duration: string;
  location: string;
  basePrice: number; // Price per adult in cents
  quantity: number;
  date: string;
  travelers: {
    adults: number;
    children: number;
  };
  childDiscountPercent: number;
  options?: {
    departureCity?: string;
    hotelName?: string;
    includesFlights?: boolean;
    extras?: string[];
  };
  addedAt: number; // Timestamp for sorting
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'cartItemId' | 'addedAt'>) => void;
  removeItem: (cartItemId: string) => void;
  updateItem: (cartItemId: string, updates: Partial<CartItem>) => void;
  updateTravelers: (cartItemId: string, adults: number, children: number) => void;
  updateDate: (cartItemId: string, date: string) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;

  // Computed values
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemPrice: (cartItemId: string) => number;
}

const generateCartItemId = (): string => {
  return `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const calculateItemPrice = (item: CartItem): number => {
  const adultTotal = item.basePrice * item.travelers.adults;
  const childPrice = Math.round(item.basePrice * (1 - item.childDiscountPercent / 100));
  const childTotal = childPrice * item.travelers.children;
  return adultTotal + childTotal;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const cartItemId = generateCartItemId();
        const newItem: CartItem = {
          ...item,
          cartItemId,
          addedAt: Date.now(),
        };

        set((state) => ({
          items: [...state.items, newItem],
          isOpen: true, // Open cart drawer when item is added
        }));
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateItem: (cartItemId, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, ...updates } : item
          ),
        }));
      },

      updateTravelers: (cartItemId, adults, children) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, travelers: { adults, children } }
              : item
          ),
        }));
      },

      updateDate: (cartItemId, date) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, date } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setIsOpen: (isOpen) => {
        set({ isOpen });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => {
          return count + item.travelers.adults + item.travelers.children;
        }, 0);
      },

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          return total + calculateItemPrice(item);
        }, 0);
      },

      getTotal: () => {
        // For now, total equals subtotal
        // Can add taxes, service fees, etc. later
        return get().getSubtotal();
      },

      getItemPrice: (cartItemId) => {
        const state = get();
        const item = state.items.find((i) => i.cartItemId === cartItemId);
        if (!item) return 0;
        return calculateItemPrice(item);
      },
    }),
    {
      name: 'itravel-cart',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

// Helper to format price for display
export function formatCartPrice(cents: number, currency = '€'): string {
  return `${currency}${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Helper to get cart item summary
export function getCartItemSummary(item: CartItem): string {
  const travelers = item.travelers.adults + item.travelers.children;
  const travelerText = travelers === 1 ? '1 traveler' : `${travelers} travelers`;
  return `${item.date} • ${travelerText}`;
}
