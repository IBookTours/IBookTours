/**
 * Car Rental Store
 *
 * Zustand store for managing car rental search, filters, and booking state.
 * Persists selected vehicle and booking details to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CarRentalVehicle,
  CarRentalFilters,
  CarRentalBooking,
  VehicleCategory,
  TransmissionType,
} from '@/types/carRental';

export interface CarRentalState {
  // Filter state
  filters: CarRentalFilters;

  // Selected vehicle for booking
  selectedVehicle: CarRentalVehicle | null;

  // Booking form state
  booking: Partial<CarRentalBooking>;

  // UI state
  isBookingModalOpen: boolean;

  // Filter actions
  setFilter: <K extends keyof CarRentalFilters>(key: K, value: CarRentalFilters[K]) => void;
  setFilters: (filters: Partial<CarRentalFilters>) => void;
  resetFilters: () => void;

  // Vehicle selection
  selectVehicle: (vehicle: CarRentalVehicle) => void;
  clearSelectedVehicle: () => void;

  // Booking actions
  updateBooking: (data: Partial<CarRentalBooking>) => void;
  setPickupDate: (date: string) => void;
  setReturnDate: (date: string) => void;
  setPickupLocation: (locationId: string) => void;
  setReturnLocation: (locationId: string) => void;
  addExtra: (extraId: string) => void;
  removeExtra: (extraId: string) => void;
  clearBooking: () => void;

  // UI actions
  openBookingModal: (vehicle?: CarRentalVehicle) => void;
  closeBookingModal: () => void;

  // Computed values
  calculateTotalDays: () => number;
  calculateTotalPrice: (extrasTotal?: number) => number;
}

const defaultFilters: CarRentalFilters = {
  category: 'all',
  transmission: 'all',
  minSeats: undefined,
  maxPrice: undefined,
  fuelType: 'all',
};

const defaultBooking: Partial<CarRentalBooking> = {
  pickupDate: '',
  pickupTime: '10:00',
  returnDate: '',
  returnTime: '10:00',
  pickupLocationId: '',
  returnLocationId: '',
  driverAge: 25,
  extras: [],
};

export const useCarRentalStore = create<CarRentalState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,
      selectedVehicle: null,
      booking: defaultBooking,
      isBookingModalOpen: false,

      // Filter actions
      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      // Vehicle selection
      selectVehicle: (vehicle) => {
        set({ selectedVehicle: vehicle });
      },

      clearSelectedVehicle: () => {
        set({ selectedVehicle: null });
      },

      // Booking actions
      updateBooking: (data) => {
        set((state) => ({
          booking: { ...state.booking, ...data },
        }));
      },

      setPickupDate: (date) => {
        set((state) => ({
          booking: { ...state.booking, pickupDate: date },
        }));
      },

      setReturnDate: (date) => {
        set((state) => ({
          booking: { ...state.booking, returnDate: date },
        }));
      },

      setPickupLocation: (locationId) => {
        set((state) => ({
          booking: {
            ...state.booking,
            pickupLocationId: locationId,
            // If return location not set, default to same location
            returnLocationId: state.booking.returnLocationId || locationId,
          },
        }));
      },

      setReturnLocation: (locationId) => {
        set((state) => ({
          booking: { ...state.booking, returnLocationId: locationId },
        }));
      },

      addExtra: (extraId) => {
        set((state) => ({
          booking: {
            ...state.booking,
            extras: [...(state.booking.extras || []), extraId],
          },
        }));
      },

      removeExtra: (extraId) => {
        set((state) => ({
          booking: {
            ...state.booking,
            extras: (state.booking.extras || []).filter((id) => id !== extraId),
          },
        }));
      },

      clearBooking: () => {
        set({
          booking: defaultBooking,
          selectedVehicle: null,
        });
      },

      // UI actions
      openBookingModal: (vehicle) => {
        if (vehicle) {
          set({ selectedVehicle: vehicle });
        }
        set({ isBookingModalOpen: true });
      },

      closeBookingModal: () => {
        set({ isBookingModalOpen: false });
      },

      // Computed values
      calculateTotalDays: () => {
        const { booking } = get();
        if (!booking.pickupDate || !booking.returnDate) return 0;

        const pickup = new Date(booking.pickupDate);
        const returnDate = new Date(booking.returnDate);
        const diffTime = returnDate.getTime() - pickup.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return Math.max(1, diffDays); // Minimum 1 day
      },

      calculateTotalPrice: (extrasTotal = 0) => {
        const { selectedVehicle } = get();
        const totalDays = get().calculateTotalDays();

        if (!selectedVehicle || totalDays === 0) return 0;

        const vehicleTotal = selectedVehicle.pricePerDay * totalDays;
        return vehicleTotal + extrasTotal;
      },
    }),
    {
      name: 'ibooktours-car-rental',
      partialize: (state) => ({
        booking: state.booking,
        selectedVehicle: state.selectedVehicle,
      }),
    }
  )
);

// Helper functions

/**
 * Filter vehicles based on current filter state
 */
export function filterVehicles(
  vehicles: CarRentalVehicle[],
  filters: CarRentalFilters
): CarRentalVehicle[] {
  return vehicles.filter((vehicle) => {
    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (vehicle.category !== filters.category) return false;
    }

    // Transmission filter
    if (filters.transmission && filters.transmission !== 'all') {
      if (vehicle.transmission !== filters.transmission) return false;
    }

    // Fuel type filter
    if (filters.fuelType && filters.fuelType !== 'all') {
      if (vehicle.fuelType !== filters.fuelType) return false;
    }

    // Min seats filter
    if (filters.minSeats && vehicle.seats < filters.minSeats) {
      return false;
    }

    // Max price filter
    if (filters.maxPrice && vehicle.pricePerDay > filters.maxPrice) {
      return false;
    }

    // Only show available vehicles
    if (!vehicle.available) return false;

    return true;
  });
}

/**
 * Format price for display
 */
export function formatCarPrice(price: number, currency = '€'): string {
  return `${currency}${price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Get minimum date for pickup (today)
 */
export function getMinPickupDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get minimum date for return (pickup date or today)
 */
export function getMinReturnDate(pickupDate?: string): string {
  if (pickupDate) {
    return pickupDate;
  }
  return getMinPickupDate();
}
