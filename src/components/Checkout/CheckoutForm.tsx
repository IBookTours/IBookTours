'use client';

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import styles from './CheckoutForm.module.scss';

interface CheckoutFormProps {
  tourId: string;
  tourName: string;
  amount: number; // in cents
  currency: string;
}

export default function CheckoutForm({
  tourId,
  tourName,
  amount,
  currency,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: '1',
    date: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // In demo mode, simulate a successful payment
      // In production, this would create a payment intent and confirm with Stripe
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          tourId,
          tourName,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Demo: Always succeed
      setIsSuccess(true);
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>
          <CheckCircle size={48} />
        </div>
        <h2>Booking Confirmed!</h2>
        <p>Thank you for booking with IBookTours.</p>
        <p className={styles.successDetails}>
          A confirmation email has been sent to <strong>{formData.email}</strong>
        </p>
        <p className={styles.bookingId}>Booking ID: ITR-{Date.now().toString(36).toUpperCase()}</p>
      </div>
    );
  }

  const displayAmount = (amount / 100).toFixed(2);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <CreditCard size={24} />
        <h2>Payment Details</h2>
      </div>

      <div className={styles.demoNotice}>
        <Lock size={16} />
        <span>Demo Mode - No real charges will be made</span>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Personal Details */}
      <div className={styles.section}>
        <h3>Personal Information</h3>
        <div className={styles.field}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="John Doe"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="john@example.com"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="+1 234 567 8900"
          />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="travelers">Travelers</label>
            <select
              id="travelers"
              name="travelers"
              value={formData.travelers}
              onChange={handleInputChange}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'traveler' : 'travelers'}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="date">Travel Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className={styles.section}>
        <h3>Card Information</h3>
        <div className={styles.field}>
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setFormData((prev) => ({ ...prev, cardNumber: formatted }));
            }}
            required
            placeholder="4242 4242 4242 4242"
            maxLength={19}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="expiry">Expiry Date</label>
            <input
              type="text"
              id="expiry"
              name="expiry"
              value={formData.expiry}
              onChange={(e) => {
                const formatted = formatExpiry(e.target.value);
                setFormData((prev) => ({ ...prev, expiry: formatted }));
              }}
              required
              placeholder="MM/YY"
              maxLength={5}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="cvc">CVC</label>
            <input
              type="text"
              id="cvc"
              name="cvc"
              value={formData.cvc}
              onChange={handleInputChange}
              required
              placeholder="123"
              maxLength={4}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isLoading}
      >
        {isLoading ? (
          <>Processing...</>
        ) : (
          <>
            <Lock size={18} />
            Pay €{displayAmount}
          </>
        )}
      </button>

      <p className={styles.secureNotice}>
        <Lock size={14} />
        Your payment is secured with SSL encryption
      </p>
    </form>
  );
}
