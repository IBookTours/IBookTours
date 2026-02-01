/**
 * Price Verification Utilities
 *
 * Server-side price verification to prevent payment manipulation.
 * Always verify prices against the source of truth (CMS/database) before processing payments.
 */

import { cms } from '@/lib/cms';
import { siteData } from '@/data/siteData';

/**
 * Parse a price string (e.g., "€99", "$149.99") to cents
 * Returns null if parsing fails
 */
export function parsePriceToCents(priceString: string): number | null {
  if (!priceString) return null;

  // Remove currency symbols and whitespace
  const cleaned = priceString.replace(/[€$£₤¥₹\s,]/g, '').trim();

  // Parse as float
  const value = parseFloat(cleaned);

  if (isNaN(value) || value < 0) {
    return null;
  }

  // Convert to cents (multiply by 100 and round to avoid floating point issues)
  return Math.round(value * 100);
}

/**
 * Tour price lookup result
 */
export interface TourPriceLookup {
  found: boolean;
  tourId: string;
  tourName?: string;
  pricePerPersonCents?: number;
  originalPriceString?: string;
  tourType?: 'dayTour' | 'vacationPackage' | 'destination';
}

/**
 * Look up the actual price of a tour by ID
 * Checks both day tours and vacation packages
 */
export async function getTourPrice(tourId: string): Promise<TourPriceLookup> {
  // First check mock/static data (fast path)
  const staticResult = getStaticTourPrice(tourId);
  if (staticResult.found) {
    return staticResult;
  }

  // If not found in static data, check CMS
  const cmsResult = await getCMSTourPrice(tourId);
  return cmsResult;
}

/**
 * Look up tour price from static data
 */
function getStaticTourPrice(tourId: string): TourPriceLookup {
  // Check day tours
  const dayTour = siteData.dayTours?.find((t) => t.id === tourId);
  if (dayTour) {
    const priceCents = parsePriceToCents(dayTour.pricePerPerson);
    return {
      found: priceCents !== null,
      tourId,
      tourName: dayTour.name,
      pricePerPersonCents: priceCents ?? undefined,
      originalPriceString: dayTour.pricePerPerson,
      tourType: 'dayTour',
    };
  }

  // Check vacation packages
  const vacationPackage = siteData.vacationPackages?.find((p) => p.id === tourId);
  if (vacationPackage) {
    const priceCents = parsePriceToCents(vacationPackage.pricePerPerson);
    return {
      found: priceCents !== null,
      tourId,
      tourName: vacationPackage.destination,
      pricePerPersonCents: priceCents ?? undefined,
      originalPriceString: vacationPackage.pricePerPerson,
      tourType: 'vacationPackage',
    };
  }

  // Check destinations
  const destination = siteData.destinations?.find((d) => d.id === tourId);
  if (destination && destination.price) {
    const priceCents = parsePriceToCents(destination.price);
    return {
      found: priceCents !== null,
      tourId,
      tourName: destination.name,
      pricePerPersonCents: priceCents ?? undefined,
      originalPriceString: destination.price,
      tourType: 'destination',
    };
  }

  return { found: false, tourId };
}

/**
 * Look up tour price from CMS
 */
async function getCMSTourPrice(tourId: string): Promise<TourPriceLookup> {
  // Try day tours first
  const dayTourResult = await cms.getDayTourBySlug(tourId);
  if (dayTourResult.data) {
    const priceCents = parsePriceToCents(dayTourResult.data.pricePerPerson);
    return {
      found: priceCents !== null,
      tourId,
      tourName: dayTourResult.data.name,
      pricePerPersonCents: priceCents ?? undefined,
      originalPriceString: dayTourResult.data.pricePerPerson,
      tourType: 'dayTour',
    };
  }

  // Try vacation packages
  const packageResult = await cms.getVacationPackageBySlug(tourId);
  if (packageResult.data) {
    const priceCents = parsePriceToCents(packageResult.data.pricePerPerson);
    return {
      found: priceCents !== null,
      tourId,
      tourName: packageResult.data.destination,
      pricePerPersonCents: priceCents ?? undefined,
      originalPriceString: packageResult.data.pricePerPerson,
      tourType: 'vacationPackage',
    };
  }

  return { found: false, tourId };
}

/**
 * Verify that the submitted payment amount matches the expected price
 *
 * SECURITY: Uses exact matching (0% tolerance) to prevent price manipulation.
 * Previously had 1% tolerance which allowed €10 fraud on €1000 bookings.
 *
 * @param tourId - The tour ID being booked
 * @param submittedAmountCents - The amount submitted by the client (in cents)
 * @param travelers - Number of travelers
 * @param tolerancePercent - Allowed tolerance for rounding (default 0% - exact match required)
 * @returns Verification result with details
 */
export async function verifyPaymentAmount(
  tourId: string,
  submittedAmountCents: number,
  travelers: number = 1,
  tolerancePercent: number = 0
): Promise<{
  valid: boolean;
  reason?: string;
  expectedAmountCents?: number;
  tourPrice?: TourPriceLookup;
}> {
  // Lookup the tour price
  const tourPrice = await getTourPrice(tourId);

  if (!tourPrice.found || !tourPrice.pricePerPersonCents) {
    return {
      valid: false,
      reason: `Tour not found: ${tourId}`,
      tourPrice,
    };
  }

  // Calculate expected total
  const expectedAmountCents = tourPrice.pricePerPersonCents * travelers;

  // Calculate tolerance (for rounding differences)
  const tolerance = Math.ceil(expectedAmountCents * (tolerancePercent / 100));

  // Check if submitted amount is within tolerance
  const difference = Math.abs(submittedAmountCents - expectedAmountCents);

  if (difference > tolerance) {
    return {
      valid: false,
      reason: `Price mismatch: expected ${expectedAmountCents} cents, received ${submittedAmountCents} cents`,
      expectedAmountCents,
      tourPrice,
    };
  }

  return {
    valid: true,
    expectedAmountCents,
    tourPrice,
  };
}
