/**
 * Product Configuration
 *
 * Defines business rules for each product type.
 * Using TypeScript config instead of database table to save Neon storage.
 */

export type ProductType = 'day-tour' | 'vacation-package' | 'car-rental' | 'hotel';
export type PaymentMethod = 'full' | 'deposit' | 'cash_on_arrival';
export type ApprovalStatus = 'not_required' | 'pending' | 'approved' | 'rejected';

export interface ProductConfig {
  type: ProductType;
  label: string;
  requiresApproval: boolean;
  allowedPaymentMethods: PaymentMethod[];
  defaultPaymentMethod: PaymentMethod;
  depositPercentage: number; // 0-100, used when deposit payment
  approvalTimeoutHours: number;
  instantConfirmation: boolean;
}

/**
 * Product type configurations
 *
 * Day Tours: Instant confirm, flexible payment
 * Car Rental: Requires approval, deposit required
 * Vacation Package: Requires approval, deposit required
 * Hotel: Requires approval, deposit required
 */
export const PRODUCT_CONFIG: Record<ProductType, ProductConfig> = {
  'day-tour': {
    type: 'day-tour',
    label: 'Day Tour',
    requiresApproval: false,
    allowedPaymentMethods: ['full', 'deposit', 'cash_on_arrival'],
    defaultPaymentMethod: 'full',
    depositPercentage: 30,
    approvalTimeoutHours: 0,
    instantConfirmation: true,
  },
  'vacation-package': {
    type: 'vacation-package',
    label: 'Vacation Package',
    requiresApproval: true,
    allowedPaymentMethods: ['deposit'],
    defaultPaymentMethod: 'deposit',
    depositPercentage: 30,
    approvalTimeoutHours: 24,
    instantConfirmation: false,
  },
  'car-rental': {
    type: 'car-rental',
    label: 'Car Rental',
    requiresApproval: true,
    allowedPaymentMethods: ['deposit'],
    defaultPaymentMethod: 'deposit',
    depositPercentage: 30,
    approvalTimeoutHours: 24,
    instantConfirmation: false,
  },
  'hotel': {
    type: 'hotel',
    label: 'Hotel',
    requiresApproval: true,
    allowedPaymentMethods: ['deposit'],
    defaultPaymentMethod: 'deposit',
    depositPercentage: 30,
    approvalTimeoutHours: 24,
    instantConfirmation: false,
  },
};

/**
 * Get product configuration
 */
export function getProductConfig(type: ProductType): ProductConfig {
  return PRODUCT_CONFIG[type];
}

/**
 * Check if product requires manual approval
 */
export function requiresApproval(type: ProductType): boolean {
  return PRODUCT_CONFIG[type].requiresApproval;
}

/**
 * Calculate deposit amount for a product
 */
export function calculateDeposit(type: ProductType, totalAmount: number): number {
  const config = PRODUCT_CONFIG[type];
  return Math.round((totalAmount * config.depositPercentage) / 100);
}

/**
 * Calculate remaining balance after deposit
 */
export function calculateBalance(type: ProductType, totalAmount: number): number {
  return totalAmount - calculateDeposit(type, totalAmount);
}

/**
 * Get allowed payment methods for a product
 */
export function getAllowedPaymentMethods(type: ProductType): PaymentMethod[] {
  return PRODUCT_CONFIG[type].allowedPaymentMethods;
}

/**
 * Check if a payment method is allowed for a product
 */
export function isPaymentMethodAllowed(type: ProductType, method: PaymentMethod): boolean {
  return PRODUCT_CONFIG[type].allowedPaymentMethods.includes(method);
}
