/**
 * Tour Availability Store
 *
 * Zustand store for managing tour availability state.
 * Supports per-tour calendars, capacity management, and booking reservations.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  TourAvailability,
  AvailabilityDate,
  BookingSlot,
  AvailabilityCheckResult,
  AvailabilityStatus,
  TourType,
  MonthlyAvailability,
} from '@/types/availability';
import {
  DEFAULT_CAPACITIES,
  BOOKING_WINDOWS,
} from '@/types/availability';

interface AvailabilityState {
  /** Availability by tour ID */
  tourAvailability: Record<string, TourAvailability>;

  /** Active booking slots (pending reservations) */
  bookingSlots: BookingSlot[];

  // ============================================
  // QUERIES
  // ============================================

  /**
   * Get availability for a specific tour and date
   */
  getDateAvailability: (tourId: string, date: string) => AvailabilityDate | null;

  /**
   * Get monthly availability for a tour
   */
  getMonthlyAvailability: (tourId: string, year: number, month: number) => MonthlyAvailability;

  /**
   * Check if a date is available for a number of guests
   */
  checkAvailability: (tourId: string, date: string, guestCount: number) => AvailabilityCheckResult;

  /**
   * Get availability status for a date
   */
  getDateStatus: (tourId: string, date: string) => AvailabilityStatus;

  // ============================================
  // BOOKING ACTIONS
  // ============================================

  /**
   * Reserve a slot (creates pending booking)
   */
  reserveSlot: (
    tourId: string,
    date: string,
    guestCount: number,
    bookingId: string,
    customerEmail: string
  ) => BookingSlot | null;

  /**
   * Confirm a pending reservation
   */
  confirmSlot: (slotId: string) => boolean;

  /**
   * Cancel a reservation
   */
  cancelSlot: (slotId: string) => boolean;

  /**
   * Release expired pending slots
   */
  releaseExpiredSlots: () => number;

  // ============================================
  // ADMIN ACTIONS
  // ============================================

  /**
   * Initialize availability for a tour
   */
  initializeTour: (tourId: string, tourType: TourType, config?: Partial<TourAvailability>) => void;

  /**
   * Set capacity for a specific date
   */
  setDateCapacity: (tourId: string, date: string, capacity: number) => void;

  /**
   * Block a date (no bookings allowed)
   */
  blockDate: (tourId: string, date: string, reason?: string) => void;

  /**
   * Unblock a date
   */
  unblockDate: (tourId: string, date: string) => void;

  /**
   * Set notes for a date
   */
  setDateNotes: (tourId: string, date: string, notes: string) => void;

  /**
   * Update default capacity for a tour
   */
  setDefaultCapacity: (tourId: string, capacity: number) => void;
}

/**
 * Calculate availability status based on booked vs capacity
 */
const calculateStatus = (booked: number, capacity: number): AvailabilityStatus => {
  if (capacity === 0) return 'blocked';
  if (capacity === -1) return 'available'; // Unlimited
  if (booked >= capacity) return 'full';
  if (booked >= capacity * 0.8) return 'limited'; // 80% threshold
  return 'available';
};

/**
 * Check if a date is in the valid booking window
 */
const isInBookingWindow = (
  dateStr: string,
  minAdvanceDays: number,
  maxAdvanceDays: number
): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + minAdvanceDays);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxAdvanceDays);

  return date >= minDate && date <= maxDate;
};

/**
 * Generate slot ID
 */
const generateSlotId = (): string => {
  return `slot_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

export const useAvailabilityStore = create<AvailabilityState>()(
  persist(
    (set, get) => ({
      tourAvailability: {},
      bookingSlots: [],

      // ============================================
      // QUERIES
      // ============================================

      getDateAvailability: (tourId, date) => {
        const tour = get().tourAvailability[tourId];
        if (!tour) return null;

        const dateInfo = tour.dates[date];
        if (dateInfo) return dateInfo;

        // Return default availability for dates without explicit config
        return {
          date,
          capacity: tour.defaultCapacity,
          booked: 0,
          status: calculateStatus(0, tour.defaultCapacity),
        };
      },

      getMonthlyAvailability: (tourId, year, month) => {
        const tour = get().tourAvailability[tourId];
        const days: AvailabilityDate[] = [];

        const daysInMonth = new Date(year, month, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const availability = get().getDateAvailability(tourId, dateStr);

          if (availability) {
            days.push(availability);
          } else {
            const defaultCapacity = tour?.defaultCapacity ?? DEFAULT_CAPACITIES['day-tour'];
            days.push({
              date: dateStr,
              capacity: defaultCapacity,
              booked: 0,
              status: calculateStatus(0, defaultCapacity),
            });
          }
        }

        return { year, month, days };
      },

      checkAvailability: (tourId, date, guestCount) => {
        const tour = get().tourAvailability[tourId];

        // Check if tour exists (allow booking for uninitialized tours in demo mode)
        if (!tour) {
          return {
            available: true,
            remainingSlots: null,
            status: 'available',
          };
        }

        // Check booking window
        if (!isInBookingWindow(date, tour.minAdvanceDays, tour.maxAdvanceDays)) {
          return {
            available: false,
            remainingSlots: null,
            status: 'blocked',
            reason: 'Date is outside booking window',
          };
        }

        const dateInfo = get().getDateAvailability(tourId, date);
        if (!dateInfo) {
          return {
            available: true,
            remainingSlots: null,
            status: 'available',
          };
        }

        // Check if blocked
        if (dateInfo.status === 'blocked' || dateInfo.capacity === 0) {
          return {
            available: false,
            remainingSlots: 0,
            status: 'blocked',
            reason: dateInfo.notes || 'Date is not available',
          };
        }

        // Check capacity
        if (dateInfo.capacity === -1) {
          // Unlimited capacity
          return {
            available: true,
            remainingSlots: null,
            status: 'available',
          };
        }

        const remaining = dateInfo.capacity - dateInfo.booked;
        const hasCapacity = remaining >= guestCount;

        return {
          available: hasCapacity,
          remainingSlots: remaining,
          status: hasCapacity
            ? calculateStatus(dateInfo.booked, dateInfo.capacity)
            : 'full',
          reason: hasCapacity ? undefined : `Only ${remaining} slots available`,
        };
      },

      getDateStatus: (tourId, date) => {
        const availability = get().getDateAvailability(tourId, date);
        return availability?.status ?? 'available';
      },

      // ============================================
      // BOOKING ACTIONS
      // ============================================

      reserveSlot: (tourId, date, guestCount, bookingId, customerEmail) => {
        const check = get().checkAvailability(tourId, date, guestCount);
        if (!check.available) {
          return null;
        }

        const slot: BookingSlot = {
          id: generateSlotId(),
          tourId,
          date,
          guestCount,
          bookingId,
          customerEmail,
          status: 'pending',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min expiry
        };

        set((state) => {
          const tour = state.tourAvailability[tourId];
          if (!tour) return { bookingSlots: [...state.bookingSlots, slot] };

          const dateInfo = tour.dates[date] ?? {
            date,
            capacity: tour.defaultCapacity,
            booked: 0,
            status: 'available',
          };

          const newBooked = dateInfo.booked + guestCount;

          return {
            bookingSlots: [...state.bookingSlots, slot],
            tourAvailability: {
              ...state.tourAvailability,
              [tourId]: {
                ...tour,
                dates: {
                  ...tour.dates,
                  [date]: {
                    ...dateInfo,
                    booked: newBooked,
                    status: calculateStatus(newBooked, dateInfo.capacity),
                  },
                },
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });

        return slot;
      },

      confirmSlot: (slotId) => {
        const slot = get().bookingSlots.find((s) => s.id === slotId);
        if (!slot || slot.status !== 'pending') return false;

        set((state) => ({
          bookingSlots: state.bookingSlots.map((s) =>
            s.id === slotId ? { ...s, status: 'confirmed', expiresAt: undefined } : s
          ),
        }));

        return true;
      },

      cancelSlot: (slotId) => {
        const slot = get().bookingSlots.find((s) => s.id === slotId);
        if (!slot) return false;

        set((state) => {
          const tour = state.tourAvailability[slot.tourId];
          if (!tour) {
            return {
              bookingSlots: state.bookingSlots.filter((s) => s.id !== slotId),
            };
          }

          const dateInfo = tour.dates[slot.date];
          if (!dateInfo) {
            return {
              bookingSlots: state.bookingSlots.filter((s) => s.id !== slotId),
            };
          }

          const newBooked = Math.max(0, dateInfo.booked - slot.guestCount);

          return {
            bookingSlots: state.bookingSlots.filter((s) => s.id !== slotId),
            tourAvailability: {
              ...state.tourAvailability,
              [slot.tourId]: {
                ...tour,
                dates: {
                  ...tour.dates,
                  [slot.date]: {
                    ...dateInfo,
                    booked: newBooked,
                    status: calculateStatus(newBooked, dateInfo.capacity),
                  },
                },
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });

        return true;
      },

      releaseExpiredSlots: () => {
        const now = new Date();
        const expired = get().bookingSlots.filter(
          (s) => s.status === 'pending' && s.expiresAt && new Date(s.expiresAt) < now
        );

        expired.forEach((slot) => get().cancelSlot(slot.id));

        return expired.length;
      },

      // ============================================
      // ADMIN ACTIONS
      // ============================================

      initializeTour: (tourId, tourType, config) => {
        set((state) => ({
          tourAvailability: {
            ...state.tourAvailability,
            [tourId]: {
              tourId,
              tourType,
              defaultCapacity: config?.defaultCapacity ?? DEFAULT_CAPACITIES[tourType],
              minAdvanceDays: config?.minAdvanceDays ?? BOOKING_WINDOWS.minAdvanceDays,
              maxAdvanceDays: config?.maxAdvanceDays ?? BOOKING_WINDOWS.maxAdvanceDays,
              dates: config?.dates ?? {},
              lastUpdated: new Date().toISOString(),
            },
          },
        }));
      },

      setDateCapacity: (tourId, date, capacity) => {
        set((state) => {
          const tour = state.tourAvailability[tourId];
          if (!tour) return state;

          const dateInfo = tour.dates[date] ?? {
            date,
            capacity: tour.defaultCapacity,
            booked: 0,
            status: 'available',
          };

          return {
            tourAvailability: {
              ...state.tourAvailability,
              [tourId]: {
                ...tour,
                dates: {
                  ...tour.dates,
                  [date]: {
                    ...dateInfo,
                    capacity,
                    status: calculateStatus(dateInfo.booked, capacity),
                  },
                },
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      blockDate: (tourId, date, reason) => {
        set((state) => {
          const tour = state.tourAvailability[tourId];
          if (!tour) return state;

          const dateInfo = tour.dates[date] ?? {
            date,
            capacity: 0,
            booked: 0,
            status: 'blocked',
          };

          return {
            tourAvailability: {
              ...state.tourAvailability,
              [tourId]: {
                ...tour,
                dates: {
                  ...tour.dates,
                  [date]: {
                    ...dateInfo,
                    capacity: 0,
                    status: 'blocked',
                    notes: reason,
                  },
                },
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      unblockDate: (tourId, date) => {
        const tour = get().tourAvailability[tourId];
        if (!tour) return;

        get().setDateCapacity(tourId, date, tour.defaultCapacity);
      },

      setDateNotes: (tourId, date, notes) => {
        set((state) => {
          const tour = state.tourAvailability[tourId];
          if (!tour) return state;

          const dateInfo = tour.dates[date] ?? {
            date,
            capacity: tour.defaultCapacity,
            booked: 0,
            status: 'available',
          };

          return {
            tourAvailability: {
              ...state.tourAvailability,
              [tourId]: {
                ...tour,
                dates: {
                  ...tour.dates,
                  [date]: {
                    ...dateInfo,
                    notes,
                  },
                },
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      setDefaultCapacity: (tourId, capacity) => {
        set((state) => {
          const tour = state.tourAvailability[tourId];
          if (!tour) return state;

          return {
            tourAvailability: {
              ...state.tourAvailability,
              [tourId]: {
                ...tour,
                defaultCapacity: capacity,
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },
    }),
    {
      name: 'itravel-availability',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tourAvailability: state.tourAvailability,
        // Don't persist booking slots (they're transient)
      }),
    }
  )
);
