/**
 * Contact Form Validation Schema
 */

import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email must be less than 254 characters')
    .toLowerCase()
    .trim(),

  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),

  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),

  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]{7,20}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Validates contact form data and returns typed result
 */
export const validateContactForm = (data: unknown) => {
  return contactSchema.safeParse(data);
};
