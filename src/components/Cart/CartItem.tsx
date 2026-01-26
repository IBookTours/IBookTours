'use client';

import Image from 'next/image';
import { Trash2, Calendar, Users, MapPin, Minus, Plus } from 'lucide-react';
import { CartItem as CartItemType, useCartStore, formatCartPrice } from '@/store/cartStore';
import styles from './Cart.module.scss';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateTravelers, updateDate, getItemPrice } = useCartStore();
  const itemPrice = getItemPrice(item.cartItemId);
  const minDate = new Date().toISOString().split('T')[0];

  const handleDecreaseAdults = () => {
    if (item.travelers.adults > 1) {
      updateTravelers(item.cartItemId, item.travelers.adults - 1, item.travelers.children);
    }
  };

  const handleIncreaseAdults = () => {
    updateTravelers(item.cartItemId, item.travelers.adults + 1, item.travelers.children);
  };

  const handleDecreaseChildren = () => {
    if (item.travelers.children > 0) {
      updateTravelers(item.cartItemId, item.travelers.adults, item.travelers.children - 1);
    }
  };

  const handleIncreaseChildren = () => {
    updateTravelers(item.cartItemId, item.travelers.adults, item.travelers.children + 1);
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.itemImage}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          style={{ objectFit: 'cover' }}
        />
        <span className={styles.itemType}>
          {item.type === 'vacation-package' ? 'Package' : 'Tour'}
        </span>
      </div>

      <div className={styles.itemDetails}>
        <h4 className={styles.itemName}>{item.name}</h4>

        <div className={styles.itemMeta}>
          <span className={styles.metaItem}>
            <MapPin size={14} />
            {item.location}
          </span>
        </div>

        <div className={styles.dateField}>
          <label className={styles.dateLabel}>
            <Calendar size={14} />
            Travel Date
          </label>
          <input
            type="date"
            value={item.date}
            onChange={(e) => updateDate(item.cartItemId, e.target.value)}
            min={minDate}
            className={styles.dateInput}
            aria-label="Select travel date"
          />
        </div>

        <div className={styles.travelerControls}>
          <div className={styles.travelerRow}>
            <span className={styles.travelerLabel}>
              <Users size={14} />
              Adults
            </span>
            <div className={styles.counter}>
              <button
                onClick={handleDecreaseAdults}
                disabled={item.travelers.adults <= 1}
                aria-label="Decrease adults"
              >
                <Minus size={14} />
              </button>
              <span>{item.travelers.adults}</span>
              <button
                onClick={handleIncreaseAdults}
                aria-label="Increase adults"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className={styles.travelerRow}>
            <span className={styles.travelerLabel}>Children</span>
            <div className={styles.counter}>
              <button
                onClick={handleDecreaseChildren}
                disabled={item.travelers.children <= 0}
                aria-label="Decrease children"
              >
                <Minus size={14} />
              </button>
              <span>{item.travelers.children}</span>
              <button
                onClick={handleIncreaseChildren}
                aria-label="Increase children"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.itemFooter}>
          <span className={styles.itemPrice}>{formatCartPrice(itemPrice)}</span>
          <button
            className={styles.removeBtn}
            onClick={() => removeItem(item.cartItemId)}
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
