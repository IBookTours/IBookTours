'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore, formatCartPrice } from '@/store/cartStore';
import CartItem from './CartItem';
import styles from './Cart.module.scss';

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, getTotal, clearCart } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, setIsOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const total = getTotal();

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
        onClick={handleOverlayClick}
        aria-hidden={!isOpen}
        {...(isOpen ? { inert: undefined } : {})}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`${styles.drawer} ${isOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>
            <ShoppingBag size={24} />
            Your Cart
            {items.length > 0 && (
              <span className={styles.itemCount}>({items.length})</span>
            )}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.drawerContent}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={64} strokeWidth={1} />
              <h3>Your cart is empty</h3>
              <p>Add some amazing tours and packages to get started!</p>
              <Link
                href="/tours"
                className={styles.browseBtn}
                onClick={() => setIsOpen(false)}
              >
                Browse Tours
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className={styles.cartItems}>
              {items.map((item) => (
                <CartItem key={item.cartItemId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.footerTop}>
              <button
                className={styles.clearBtn}
                onClick={clearCart}
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
            </div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalPrice}>{formatCartPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              className={styles.checkoutBtn}
              onClick={() => setIsOpen(false)}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>

            <p className={styles.secureNote}>
              Secure checkout powered by Stripe
            </p>
          </div>
        )}
      </div>
    </>
  );
}
