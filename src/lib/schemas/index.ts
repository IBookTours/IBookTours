/**
 * Schema Exports
 *
 * Centralized export of all validation schemas
 */

export {
  contactSchema,
  validateContactForm,
  type ContactFormData,
} from './contact';

export {
  paymentIntentSchema,
  bookingPaymentSchema,
  validatePaymentIntent,
  validateBookingPayment,
  type PaymentIntentData,
  type BookingPaymentData,
} from './payment';

export {
  newsletterSchema,
  unsubscribeSchema,
  validateNewsletterSubscription,
  validateUnsubscribe,
  type NewsletterData,
  type UnsubscribeData,
} from './newsletter';

/**
 * Common schema utilities
 */
import { z } from 'zod';

/**
 * Formats Zod validation errors for API responses
 */
export const formatZodErrors = (error: z.ZodError) => {
  return {
    errors: error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  };
};

/**
 * Creates a standardized validation error response
 */
export const createValidationErrorResponse = (error: z.ZodError) => {
  return {
    error: 'Validation failed',
    details: formatZodErrors(error),
  };
};
