'use client';

import { useMemo } from 'react';
import { Users, Baby, User, Percent, Tag, Calculator } from 'lucide-react';
import { PriceBreakdown, centsToDisplayPrice } from '@/store/bookingStore';
import styles from './PriceCalculator.module.scss';

interface PriceCalculatorProps {
  breakdown: PriceBreakdown;
  tourName: string;
  selectedDate?: string;
  childDiscountPercent?: number;
  groupDiscountThreshold?: number;
}

export default function PriceCalculator({
  breakdown,
  tourName,
  selectedDate,
  childDiscountPercent = 50,
  groupDiscountThreshold = 6,
}: PriceCalculatorProps) {
  const totalTravelers = breakdown.adultCount + breakdown.childCount;
  const hasGroupDiscount = totalTravelers >= groupDiscountThreshold;

  const formattedDate = useMemo(() => {
    if (!selectedDate) return null;
    try {
      return new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <Calculator size={20} />
        <h3>Price Breakdown</h3>
      </div>

      {/* Tour Info */}
      <div className={styles.tourInfo}>
        <p className={styles.tourName}>{tourName}</p>
        {formattedDate && <p className={styles.tourDate}>{formattedDate}</p>}
      </div>

      {/* Travelers Summary */}
      <div className={styles.travelersRow}>
        <div className={styles.travelers}>
          <Users size={16} />
          <span>{totalTravelers} Traveler{totalTravelers !== 1 ? 's' : ''}</span>
        </div>
        <div className={styles.travelersDetail}>
          {breakdown.adultCount > 0 && (
            <span><User size={14} /> {breakdown.adultCount} Adult{breakdown.adultCount !== 1 ? 's' : ''}</span>
          )}
          {breakdown.childCount > 0 && (
            <span><Baby size={14} /> {breakdown.childCount} Child{breakdown.childCount !== 1 ? 'ren' : ''}</span>
          )}
        </div>
      </div>

      <div className={styles.divider} />

      {/* Line Items */}
      <div className={styles.lineItems}>
        {/* Adult Pricing */}
        {breakdown.adultCount > 0 && (
          <div className={styles.lineItem}>
            <div className={styles.lineLabel}>
              <span>Adult × {breakdown.adultCount}</span>
              <span className={styles.unitPrice}>
                {centsToDisplayPrice(breakdown.adultPrice)} each
              </span>
            </div>
            <span className={styles.lineValue}>
              {centsToDisplayPrice(breakdown.adultTotal)}
            </span>
          </div>
        )}

        {/* Child Pricing */}
        {breakdown.childCount > 0 && (
          <div className={styles.lineItem}>
            <div className={styles.lineLabel}>
              <span>Child × {breakdown.childCount}</span>
              <span className={styles.unitPrice}>
                {centsToDisplayPrice(breakdown.childPrice)} each
                <span className={styles.discount}>({childDiscountPercent}% off)</span>
              </span>
            </div>
            <span className={styles.lineValue}>
              {centsToDisplayPrice(breakdown.childTotal)}
            </span>
          </div>
        )}

        {/* Subtotal */}
        <div className={`${styles.lineItem} ${styles.subtotalLine}`}>
          <span>Subtotal</span>
          <span>{centsToDisplayPrice(breakdown.subtotal)}</span>
        </div>

        {/* Single Supplement */}
        {breakdown.singleSupplementAmount > 0 && (
          <div className={`${styles.lineItem} ${styles.supplementLine}`}>
            <div className={styles.lineLabel}>
              <Tag size={14} />
              <span>Single Supplement (20%)</span>
            </div>
            <span className={styles.lineValue}>
              +{centsToDisplayPrice(breakdown.singleSupplementAmount)}
            </span>
          </div>
        )}

        {/* Group Discount */}
        {breakdown.groupDiscountAmount > 0 && (
          <div className={`${styles.lineItem} ${styles.discountLine}`}>
            <div className={styles.lineLabel}>
              <Percent size={14} />
              <span>Group Discount (10% off)</span>
            </div>
            <span className={styles.lineValue}>
              -{centsToDisplayPrice(breakdown.groupDiscountAmount)}
            </span>
          </div>
        )}

        {/* Group Discount Hint */}
        {!hasGroupDiscount && totalTravelers >= 4 && (
          <div className={styles.discountHint}>
            <Percent size={14} />
            <span>Add {groupDiscountThreshold - totalTravelers} more traveler{groupDiscountThreshold - totalTravelers !== 1 ? 's' : ''} to unlock 10% group discount!</span>
          </div>
        )}
      </div>

      <div className={styles.divider} />

      {/* Total */}
      <div className={styles.total}>
        <span>Total</span>
        <span className={styles.totalAmount}>
          {centsToDisplayPrice(breakdown.total)}
        </span>
      </div>

      {/* Per Person */}
      {totalTravelers > 1 && (
        <p className={styles.perPerson}>
          {centsToDisplayPrice(Math.round(breakdown.total / totalTravelers))} per person
        </p>
      )}

      {/* Guarantees */}
      <div className={styles.guarantees}>
        <span>✓ Free cancellation up to 30 days before</span>
        <span>✓ Best price guaranteed</span>
        <span>✓ No hidden fees</span>
      </div>
    </div>
  );
}
