'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Calendar, Users, Minus, Plus, Check, CreditCard } from 'lucide-react';
import { useFocusTrap } from '@/hooks';
import { Destination } from '@/types';
import styles from './BookingModal.module.scss';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination;
}

type BookingStep = 'details' | 'payment' | 'confirmation';

export default function BookingModal({ isOpen, onClose, destination }: BookingModalProps) {
  const modalRef = useFocusTrap<HTMLDivElement>({
    isActive: isOpen,
    onEscape: onClose,
  });
  const [step, setStep] = useState<BookingStep>('details');
  const [selectedDate, setSelectedDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setSelectedDate('');
      setAdults(2);
      setChildren(0);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
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

  if (!isOpen) return null;

  const priceNumber = parseInt(destination.price?.replace(/[^0-9]/g, '') || '0', 10);
  const totalPrice = priceNumber * adults + Math.round(priceNumber * 0.5) * children;

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleContinue = () => {
    if (step === 'details') {
      setStep('payment');
    } else if (step === 'payment') {
      setIsProcessing(true);
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setStep('confirmation');
      }, 2000);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Generate available dates (next 90 days, no Sundays)
  const availableDates: string[] = [];
  const today = new Date();
  for (let i = 7; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date.getDay() !== 0) {
      availableDates.push(date.toISOString().split('T')[0]);
    }
  }

  return (
    <div className={styles.overlay} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div ref={modalRef} className={styles.modal} tabIndex={-1}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close booking modal"
        >
          <X size={24} />
        </button>

        <div className={styles.header}>
          <div className={styles.tourPreview}>
            <div className={styles.tourImage}>
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                sizes="80px"
              />
            </div>
            <div className={styles.tourInfo}>
              <h2>{destination.name}</h2>
              <p>{destination.location}</p>
              <span className={styles.duration}>{destination.duration}</span>
            </div>
          </div>
        </div>

        {step === 'details' && (
          <div className={styles.content}>
            <div className={styles.section}>
              <h3>
                <Calendar size={18} />
                Select Date
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateSelect}
                min={availableDates[0]}
                max={availableDates[availableDates.length - 1]}
                className={styles.dateInput}
                aria-label="Select tour date"
              />
            </div>

            <div className={styles.section}>
              <h3>
                <Users size={18} />
                Number of Travelers
              </h3>

              <div className={styles.travelerRow}>
                <div className={styles.travelerInfo}>
                  <span className={styles.travelerType}>Adults</span>
                  <span className={styles.travelerPrice}>{destination.price} per person</span>
                </div>
                <div className={styles.counter}>
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                    aria-label="Decrease adults"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{adults}</span>
                  <button
                    onClick={() => setAdults(Math.min(10, adults + 1))}
                    disabled={adults >= 10}
                    aria-label="Increase adults"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.travelerRow}>
                <div className={styles.travelerInfo}>
                  <span className={styles.travelerType}>Children (under 12)</span>
                  <span className={styles.travelerPrice}>50% discount</span>
                </div>
                <div className={styles.counter}>
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children <= 0}
                    aria-label="Decrease children"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{children}</span>
                  <button
                    onClick={() => setChildren(Math.min(10, children + 1))}
                    disabled={children >= 10}
                    aria-label="Increase children"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Adults ({adults})</span>
                <span>€{priceNumber * adults}</span>
              </div>
              {children > 0 && (
                <div className={styles.summaryRow}>
                  <span>Children ({children})</span>
                  <span>€{Math.round(priceNumber * 0.5) * children}</span>
                </div>
              )}
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>€{totalPrice}</span>
              </div>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className={styles.content}>
            <div className={styles.section}>
              <h3>
                <CreditCard size={18} />
                Payment Details
              </h3>
              <p className={styles.demoNote}>
                This is a demo. No actual payment will be processed.
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  placeholder="John Doe"
                  defaultValue="Demo User"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  defaultValue="4242 4242 4242 4242"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="expiry">Expiry</label>
                  <input
                    type="text"
                    id="expiry"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cvc">CVC</label>
                  <input
                    type="text"
                    id="cvc"
                    placeholder="123"
                    defaultValue="123"
                  />
                </div>
              </div>
            </div>

            <div className={styles.summary}>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total to Pay</span>
                <span>€{totalPrice}</span>
              </div>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className={styles.content}>
            <div className={styles.confirmation}>
              <div className={styles.successIcon}>
                <Check size={40} />
              </div>
              <h3>Booking Confirmed!</h3>
              <p>Thank you for booking with ITravel.</p>
              <p className={styles.bookingRef}>
                Booking Reference: <strong>IT-{Math.random().toString(36).substring(2, 8).toUpperCase()}</strong>
              </p>
              <p className={styles.emailNote}>
                A confirmation email has been sent to your email address.
              </p>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          {step !== 'confirmation' ? (
            <button
              className={styles.continueBtn}
              onClick={handleContinue}
              disabled={step === 'details' && !selectedDate}
            >
              {isProcessing ? (
                <span className={styles.spinner} />
              ) : step === 'details' ? (
                'Continue to Payment'
              ) : (
                `Pay €${totalPrice}`
              )}
            </button>
          ) : (
            <button className={styles.continueBtn} onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
