/**
 * Current Booking Store (bookingStore)
 *
 * Manages the ACTIVE booking form state during the checkout flow.
 * This store holds data for a booking that is currently being created,
 * including tour selection, traveler details, and pricing calculations.
 *
 * Use this store when:
 * - User is filling out the booking form
 * - Calculating prices during checkout
 * - Managing passenger details before payment
 *
 * For completed/historical bookings, see: bookingsStore.ts
 *
 * Persisted to localStorage to survive page refreshes during checkout.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PassengerDetail {
  fullName: string;
  isChild: boolean;
  specialRequests?: string;
}

export interface BookingState {
  // Tour info
  tourId: string | null;
  tourName: string;
  tourImage: string;
  tourDuration: string;

  // Booking details
  selectedDate: string;
  travelers: {
    adults: number;
    children: number;
  };
  passengerDetails: PassengerDetail[];

  // Extras
  singleSupplement: boolean;

  // Pricing (in cents for Stripe)
  basePricePerAdult: number;
  childDiscountPercent: number;
  singleSupplementPercent: number;
  groupDiscountPercent: number;
  groupDiscountThreshold: number;

  // Contact info
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string;

  // Actions
  setTour: (id: string, name: string, image: string, duration: string, priceInCents: number) => void;
  setSelectedDate: (date: string) => void;
  setTravelers: (adults: number, children: number) => void;
  setPassengerDetails: (details: PassengerDetail[]) => void;
  setSingleSupplement: (enabled: boolean) => void;
  setBookerInfo: (name: string, email: string, phone: string) => void;
  calculateTotal: () => number;
  getPriceBreakdown: () => PriceBreakdown;
  reset: () => void;
}

export interface PriceBreakdown {
  adultPrice: number;
  adultCount: number;
  adultTotal: number;
  childPrice: number;
  childCount: number;
  childTotal: number;
  subtotal: number;
  singleSupplementAmount: number;
  groupDiscountAmount: number;
  total: number;
}

const initialState = {
  tourId: null,
  tourName: '',
  tourImage: '',
  tourDuration: '',
  selectedDate: '',
  travelers: { adults: 1, children: 0 },
  passengerDetails: [],
  singleSupplement: false,
  basePricePerAdult: 0,
  childDiscountPercent: 50, // Children pay 50% of adult price
  singleSupplementPercent: 20, // 20% extra for single travelers
  groupDiscountPercent: 10, // 10% discount for groups
  groupDiscountThreshold: 6, // Groups of 6+
  bookerName: '',
  bookerEmail: '',
  bookerPhone: '',
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setTour: (id, name, image, duration, priceInCents) =>
        set({
          tourId: id,
          tourName: name,
          tourImage: image,
          tourDuration: duration,
          basePricePerAdult: priceInCents,
        }),

      setSelectedDate: (date) => set({ selectedDate: date }),

      setTravelers: (adults, children) =>
        set({
          travelers: { adults, children },
          // Reset passenger details when traveler count changes
          passengerDetails: [],
        }),

      setPassengerDetails: (details) => set({ passengerDetails: details }),

      setSingleSupplement: (enabled) => set({ singleSupplement: enabled }),

      setBookerInfo: (name, email, phone) =>
        set({
          bookerName: name,
          bookerEmail: email,
          bookerPhone: phone,
        }),

      calculateTotal: () => {
        const state = get();
        const breakdown = state.getPriceBreakdown();
        return breakdown.total;
      },

      getPriceBreakdown: () => {
        const state = get();
        const { adults, children } = state.travelers;

        // Adult pricing
        const adultPrice = state.basePricePerAdult;
        const adultTotal = adultPrice * adults;

        // Child pricing (with discount)
        const childPrice = Math.round(
          adultPrice * (1 - state.childDiscountPercent / 100)
        );
        const childTotal = childPrice * children;

        // Subtotal before extras
        let subtotal = adultTotal + childTotal;

        // Single supplement (if only 1 adult, no children)
        let singleSupplementAmount = 0;
        if (state.singleSupplement && adults === 1 && children === 0) {
          singleSupplementAmount = Math.round(
            subtotal * (state.singleSupplementPercent / 100)
          );
        }

        // Group discount
        let groupDiscountAmount = 0;
        const totalTravelers = adults + children;
        if (totalTravelers >= state.groupDiscountThreshold) {
          groupDiscountAmount = Math.round(
            subtotal * (state.groupDiscountPercent / 100)
          );
        }

        // Final total
        const total = subtotal + singleSupplementAmount - groupDiscountAmount;

        return {
          adultPrice,
          adultCount: adults,
          adultTotal,
          childPrice,
          childCount: children,
          childTotal,
          subtotal,
          singleSupplementAmount,
          groupDiscountAmount,
          total,
        };
      },

      reset: () => set(initialState),
    }),
    {
      name: 'ibooktours-booking',
      // Only persist essential booking data, not pricing rules
      partialize: (state) => ({
        tourId: state.tourId,
        tourName: state.tourName,
        tourImage: state.tourImage,
        tourDuration: state.tourDuration,
        selectedDate: state.selectedDate,
        travelers: state.travelers,
        passengerDetails: state.passengerDetails,
        singleSupplement: state.singleSupplement,
        basePricePerAdult: state.basePricePerAdult,
        bookerName: state.bookerName,
        bookerEmail: state.bookerEmail,
        bookerPhone: state.bookerPhone,
      }),
    }
  )
);

// Helper to convert price string (€299) to cents (29900)
export function priceStringToCents(priceStr: string): number {
  const numericValue = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  return Math.round(numericValue * 100);
}

// Helper to format cents to display string
export function centsToDisplayPrice(cents: number, currency = '€'): string {
  return `${currency}${(cents / 100).toFixed(0)}`;
}
