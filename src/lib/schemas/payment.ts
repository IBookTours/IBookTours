/**
 * Payment Validation Schemas
 */

import { z } from 'zod';

const MAX_AMOUNT = 10000000; // $100,000 in cents

export const paymentIntentSchema = z.object({
  amount: z
    .number()
    .int('Amount must be a whole number')
    .min(100, 'Minimum amount is $1.00')
    .max(MAX_AMOUNT, 'Amount exceeds maximum allowed'),

  currency: z
    .enum(['usd', 'eur', 'gbp', 'ils'], {
      message: 'Invalid currency',
    })
    .default('usd'),

  metadata: z
    .record(z.string(), z.string())
    .optional(),

  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),

  customerEmail: z
    .string()
    .email('Invalid email address')
    .optional(),
});

export type PaymentIntentData = z.infer<typeof paymentIntentSchema>;

export const bookingPaymentSchema = z.object({
  tourId: z.string().uuid('Invalid tour ID'),

  tourType: z.enum(['day-tour', 'vacation-package'], {
    message: 'Invalid tour type',
  }),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => new Date(date) > new Date(), {
      message: 'Date must be in the future',
    }),

  guests: z
    .number()
    .int('Guest count must be a whole number')
    .min(1, 'At least 1 guest required')
    .max(50, 'Maximum 50 guests per booking'),

  totalAmount: z
    .number()
    .int('Amount must be a whole number')
    .min(100, 'Minimum amount is $1.00')
    .max(MAX_AMOUNT, 'Amount exceeds maximum allowed'),

  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),

  customerEmail: z
    .string()
    .email('Invalid email address'),

  customerPhone: z
    .string()
    .regex(/^[+]?[\d\s()-]{7,20}$/, 'Invalid phone number format')
    .optional(),

  specialRequests: z
    .string()
    .max(1000, 'Special requests must be less than 1000 characters')
    .optional(),
});

export type BookingPaymentData = z.infer<typeof bookingPaymentSchema>;

/**
 * Validates payment intent data
 */
export const validatePaymentIntent = (data: unknown) => {
  return paymentIntentSchema.safeParse(data);
};

/**
 * Validates booking payment data
 */
export const validateBookingPayment = (data: unknown) => {
  return bookingPaymentSchema.safeParse(data);
};
