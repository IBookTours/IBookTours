// ============================================
// VALIDATION UTILITIES
// ============================================
// Form validation patterns and functions for ITravel

/**
 * Validation patterns for common input types
 */
export const patterns = {
  // Email: standard email format
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Phone: international format, 10+ digits with optional formatting
  phone: /^\+?[\d\s\-()]{10,}$/,

  // Name: 2-50 characters, letters, spaces, hyphens, apostrophes
  name: /^[a-zA-Z\s'-]{2,50}$/,

  // Card number: 13-19 digits (covers all major card types)
  cardNumber: /^\d{13,19}$/,

  // Card expiry: MM/YY format
  cardExpiry: /^(0[1-9]|1[0-2])\/\d{2}$/,

  // CVC: 3-4 digits
  cvc: /^\d{3,4}$/,

  // Postal code: alphanumeric, 3-10 characters
  postalCode: /^[a-zA-Z0-9\s-]{3,10}$/,
};

/**
 * Validate email address format
 */
export function validateEmail(email: string): boolean {
  return patterns.email.test(email.trim());
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return cleaned.length >= 10 && patterns.phone.test(phone);
}

/**
 * Validate name format
 */
export function validateName(name: string): boolean {
  return patterns.name.test(name.trim());
}

/**
 * Validate credit card number using Luhn algorithm
 */
export function validateCardNumber(number: string): boolean {
  // Remove spaces and non-digits
  const cleaned = number.replace(/\D/g, '');

  // Check length
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate card expiry date (MM/YY format)
 * Checks format and that date is in the future
 */
export function validateExpiry(expiry: string): boolean {
  if (!patterns.cardExpiry.test(expiry)) {
    return false;
  }

  const [month, year] = expiry.split('/').map(Number);
  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Get last 2 digits
  const currentMonth = now.getMonth() + 1;

  // Check if expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
}

/**
 * Validate CVC code
 */
export function validateCVC(cvc: string): boolean {
  return patterns.cvc.test(cvc);
}

// ============================================
// FORMATTING FUNCTIONS
// ============================================

/**
 * Format card number with spaces every 4 digits
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 16);
  const parts: string[] = [];

  for (let i = 0; i < cleaned.length; i += 4) {
    parts.push(cleaned.slice(i, i + 4));
  }

  return parts.join(' ');
}

/**
 * Format expiry date as MM/YY
 */
export function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 4);

  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }

  return cleaned;
}

/**
 * Format phone number for display
 * Preserves international prefix and adds spacing
 */
export function formatPhone(value: string): string {
  const cleaned = value.replace(/[^\d+]/g, '');

  // Handle international format
  if (cleaned.startsWith('+')) {
    // +X XXX XXX XXXX format
    const digits = cleaned.slice(1);
    if (digits.length <= 3) return cleaned;
    if (digits.length <= 6) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 10)
      return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`;
  }

  // Local format: XXX XXX XXXX
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
}

// ============================================
// ERROR MESSAGES
// ============================================

export const errorMessages = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
  },
  phone: {
    required: 'Phone number is required',
    invalid: 'Please enter a valid phone number (at least 10 digits)',
  },
  name: {
    required: 'Name is required',
    invalid: 'Please enter a valid name (2-50 characters)',
  },
  cardNumber: {
    required: 'Card number is required',
    invalid: 'Please enter a valid card number',
  },
  expiry: {
    required: 'Expiry date is required',
    invalid: 'Please enter a valid expiry date (MM/YY)',
    expired: 'This card has expired',
  },
  cvc: {
    required: 'CVC is required',
    invalid: 'Please enter a valid CVC (3-4 digits)',
  },
};

/**
 * Get validation error for a field
 * Returns null if valid, error message if invalid
 */
export function getFieldError(
  field: 'email' | 'phone' | 'name' | 'cardNumber' | 'expiry' | 'cvc',
  value: string,
  required = true
): string | null {
  const trimmed = value.trim();

  // Check required
  if (!trimmed) {
    return required ? errorMessages[field].required : null;
  }

  // Validate based on field type
  switch (field) {
    case 'email':
      return validateEmail(trimmed) ? null : errorMessages.email.invalid;
    case 'phone':
      return validatePhone(trimmed) ? null : errorMessages.phone.invalid;
    case 'name':
      return validateName(trimmed) ? null : errorMessages.name.invalid;
    case 'cardNumber':
      return validateCardNumber(trimmed) ? null : errorMessages.cardNumber.invalid;
    case 'expiry':
      if (!patterns.cardExpiry.test(trimmed)) return errorMessages.expiry.invalid;
      return validateExpiry(trimmed) ? null : errorMessages.expiry.expired;
    case 'cvc':
      return validateCVC(trimmed) ? null : errorMessages.cvc.invalid;
    default:
      return null;
  }
}
