'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import styles from './Cart.module.scss';

interface CartIconProps {
  className?: string;
  scrolled?: boolean;
}

export default function CartIcon({ className, scrolled }: CartIconProps) {
  const { toggleCart, getItemCount, items } = useCartStore();
  const itemCount = items.length;

  return (
    <button
      className={`${styles.cartIcon} ${scrolled ? styles.scrolled : ''} ${className || ''}`}
      onClick={toggleCart}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart />
      {itemCount > 0 && (
        <span className={styles.badge}>
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
