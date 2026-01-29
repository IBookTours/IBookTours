/**
 * Booking History Store (bookingsStore)
 *
 * Manages COMPLETED booking records and order history.
 * This store holds data for bookings that have been submitted/paid,
 * including confirmation numbers, status tracking, and payment records.
 *
 * Use this store when:
 * - Displaying user's booking history
 * - Checking booking status (pending, confirmed, completed, cancelled)
 * - Managing payment status tracking
 *
 * For active/in-progress bookings during checkout, see: bookingStore.ts
 *
 * Persisted to localStorage for offline access to booking history.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';

// ============================================
// BOOKING TYPES
// ============================================

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  passportNumber?: string;
  nationality?: string;
}

export interface BookingItem {
  id: string;
  type: 'vacation-package' | 'day-tour';
  name: string;
  image: string;
  duration: string;
  location: string;
  travelDate: string;
  travelers: {
    adults: number;
    children: number;
  };
  passengers: PassengerInfo[];
  pricePerPerson: number;
  totalPrice: number;
  options?: {
    departureCity?: string;
    hotelName?: string;
    includesFlights?: boolean;
    extras?: string[];
  };
}

export interface Booking {
  id: string;
  confirmationNumber: string;
  userId?: string;
  userEmail: string;
  items: BookingItem[];
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  paymentIntentId?: string;
  notes?: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

// ============================================
// STORE STATE
// ============================================

export interface BookingsState {
  bookings: Booking[];
  currentBookingId: string | null;

  // Actions
  addBooking: (booking: Omit<Booking, 'id' | 'confirmationNumber' | 'createdAt' | 'updatedAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  updatePaymentStatus: (bookingId: string, paymentStatus: PaymentStatus, paymentIntentId?: string) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingById: (bookingId: string) => Booking | undefined;
  getBookingByConfirmation: (confirmationNumber: string) => Booking | undefined;
  getBookingsByEmail: (email: string) => Booking[];
  getUpcomingBookings: () => Booking[];
  getPastBookings: () => Booking[];
  setCurrentBookingId: (bookingId: string | null) => void;
  clearAllBookings: () => void;
}

// ============================================
// HELPERS
// ============================================

const generateBookingId = (): string => {
  return `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generateConfirmationNumber = (): string => {
  const prefix = 'IBT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Convert cart items to booking items
export const cartItemsToBookingItems = (
  cartItems: CartItem[],
  passengersByItem: Record<string, PassengerInfo[]>
): BookingItem[] => {
  return cartItems.map((cartItem) => ({
    id: cartItem.cartItemId,
    type: cartItem.type,
    name: cartItem.name,
    image: cartItem.image,
    duration: cartItem.duration,
    location: cartItem.location,
    travelDate: cartItem.date,
    travelers: cartItem.travelers,
    passengers: passengersByItem[cartItem.cartItemId] || [],
    pricePerPerson: cartItem.basePrice,
    totalPrice: calculateCartItemPrice(cartItem),
    options: cartItem.options,
  }));
};

const calculateCartItemPrice = (item: CartItem): number => {
  const adultTotal = item.basePrice * item.travelers.adults;
  const childPrice = Math.round(item.basePrice * (1 - item.childDiscountPercent / 100));
  const childTotal = childPrice * item.travelers.children;
  return adultTotal + childTotal;
};

// ============================================
// STORE
// ============================================

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookings: [],
      currentBookingId: null,

      addBooking: (bookingData) => {
        const now = new Date().toISOString();
        const newBooking: Booking = {
          ...bookingData,
          id: generateBookingId(),
          confirmationNumber: generateConfirmationNumber(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          bookings: [newBooking, ...state.bookings],
          currentBookingId: newBooking.id,
        }));

        return newBooking;
      },

      updateBookingStatus: (bookingId, status) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status, updatedAt: new Date().toISOString() }
              : booking
          ),
        }));
      },

      updatePaymentStatus: (bookingId, paymentStatus, paymentIntentId) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  paymentStatus,
                  paymentIntentId: paymentIntentId || booking.paymentIntentId,
                  status: paymentStatus === 'paid' ? 'confirmed' : booking.status,
                  updatedAt: new Date().toISOString(),
                }
              : booking
          ),
        }));
      },

      cancelBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status: 'cancelled',
                  updatedAt: new Date().toISOString(),
                }
              : booking
          ),
        }));
      },

      getBookingById: (bookingId) => {
        return get().bookings.find((b) => b.id === bookingId);
      },

      getBookingByConfirmation: (confirmationNumber) => {
        return get().bookings.find((b) => b.confirmationNumber === confirmationNumber);
      },

      getBookingsByEmail: (email) => {
        return get().bookings.filter(
          (b) => b.userEmail.toLowerCase() === email.toLowerCase()
        );
      },

      getUpcomingBookings: () => {
        const now = new Date();
        return get().bookings.filter((booking) => {
          if (booking.status === 'cancelled') return false;
          // Check if any item has a future travel date
          return booking.items.some((item) => new Date(item.travelDate) >= now);
        });
      },

      getPastBookings: () => {
        const now = new Date();
        return get().bookings.filter((booking) => {
          // All items have past travel dates, or booking is cancelled/completed
          if (booking.status === 'cancelled' || booking.status === 'completed') return true;
          return booking.items.every((item) => new Date(item.travelDate) < now);
        });
      },

      setCurrentBookingId: (bookingId) => {
        set({ currentBookingId: bookingId });
      },

      clearAllBookings: () => {
        set({ bookings: [], currentBookingId: null });
      },
    }),
    {
      name: 'ibooktours-bookings',
      partialize: (state) => ({
        bookings: state.bookings,
      }),
    }
  )
);

// ============================================
// HELPER FUNCTIONS
// ============================================

export function formatBookingDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getBookingStatusColor(status: BookingStatus): string {
  switch (status) {
    case 'pending':
      return '#f59e0b'; // Amber
    case 'confirmed':
      return '#10b981'; // Green
    case 'completed':
      return '#6366f1'; // Indigo
    case 'cancelled':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Gray
  }
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case 'pending':
      return '#f59e0b'; // Amber
    case 'paid':
      return '#10b981'; // Green
    case 'refunded':
      return '#6366f1'; // Indigo
    case 'failed':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Gray
  }
}
