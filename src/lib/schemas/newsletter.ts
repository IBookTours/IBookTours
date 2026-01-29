/**
 * Newsletter Validation Schema
 */

import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email must be less than 254 characters')
    .toLowerCase()
    .trim(),

  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),

  preferences: z
    .object({
      deals: z.boolean().default(true),
      newTours: z.boolean().default(true),
      tips: z.boolean().default(false),
    })
    .optional(),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

export const unsubscribeSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),

  token: z
    .string()
    .min(1, 'Unsubscribe token is required'),
});

export type UnsubscribeData = z.infer<typeof unsubscribeSchema>;

/**
 * Validates newsletter subscription data
 */
export const validateNewsletterSubscription = (data: unknown) => {
  return newsletterSchema.safeParse(data);
};

/**
 * Validates unsubscribe request data
 */
export const validateUnsubscribe = (data: unknown) => {
  return unsubscribeSchema.safeParse(data);
};
