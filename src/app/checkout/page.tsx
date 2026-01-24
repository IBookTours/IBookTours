'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Users,
  User,
  CreditCard,
  Lock,
  Clock,
  MapPin,
  Shield,
  CheckCircle,
  Minus,
  Plus,
} from 'lucide-react';
import PassengerForm from '@/components/Checkout/PassengerForm';
import PriceCalculator from '@/components/Checkout/PriceCalculator';
import { useBookingStore, priceStringToCents, centsToDisplayPrice, PassengerDetail } from '@/store/bookingStore';
import { siteData } from '@/data/siteData';
import styles from './checkout.module.scss';

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: 'Select', icon: Calendar },
  { id: 2, label: 'Details', icon: Users },
  { id: 3, label: 'Review', icon: Check },
  { id: 4, label: 'Payment', icon: CreditCard },
] as const;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const tourId = searchParams.get('tour');

  // Booking store
  const {
    tourName,
    selectedDate,
    travelers,
    passengerDetails,
    bookerName,
    bookerEmail,
    bookerPhone,
    setTour,
    setSelectedDate,
    setTravelers,
    setPassengerDetails,
    setBookerInfo,
    getPriceBreakdown,
    reset,
  } = useBookingStore();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedTour, setSelectedTour] = useState<typeof siteData.destinations[0] | null>(null);
  const [isPassengerFormValid, setIsPassengerFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [savedEmail, setSavedEmail] = useState('');

  // Card form state
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });

  // Load tour data
  useEffect(() => {
    const tour = tourId
      ? siteData.destinations.find((d) => d.id === tourId)
      : siteData.destinations.find((d) => d.featured) || siteData.destinations[0];

    if (tour) {
      setSelectedTour(tour);
      const priceInCents = priceStringToCents(tour.price || '€299');
      setTour(tour.id, tour.name, tour.image, tour.duration || '3 Days', priceInCents);
    }
  }, [tourId, setTour]);

  const priceBreakdown = getPriceBreakdown();

  // Step navigation
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return selectedDate.length > 0 && travelers.adults >= 1;
      case 2:
        return isPassengerFormValid && bookerEmail.length > 0 && bookerPhone.length > 0;
      case 3:
        return true;
      case 4:
        return cardData.number.replace(/\s/g, '').length >= 16 && cardData.expiry.length >= 5 && cardData.cvc.length >= 3;
      default:
        return false;
    }
  }, [currentStep, selectedDate, travelers, isPassengerFormValid, bookerEmail, bookerPhone, cardData]);

  const goToStep = (step: Step) => {
    if (step < currentStep || canProceed()) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  // Handle payment submission
  const handlePayment = async () => {
    setIsLoading(true);
    setSavedEmail(bookerEmail);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceBreakdown.total,
          currency: 'eur',
          tourId: selectedTour?.id,
          tourName,
          metadata: {
            bookerName,
            bookerEmail,
            bookerPhone,
            selectedDate,
            travelers: JSON.stringify(travelers),
          },
        }),
      });

      if (!response.ok) throw new Error('Payment failed');

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newBookingId = `ITR-${Date.now().toString(36).toUpperCase()}`;
      setBookingId(newBookingId);
      setIsSuccess(true);
      reset();
    } catch {
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Traveler controls
  const updateTravelerCount = (type: 'adults' | 'children', delta: number) => {
    const newCount = travelers[type] + delta;
    if (type === 'adults' && newCount >= 1 && newCount <= 10) {
      setTravelers(newCount, travelers.children);
    } else if (type === 'children' && newCount >= 0 && newCount <= 10) {
      setTravelers(travelers.adults, newCount);
    }
  };

  // Card formatting
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Success screen
  if (isSuccess) {
    return (
      <div className={styles.checkout}>
        <div className={styles.container}>
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <CheckCircle size={64} />
            </div>
            <h1>Booking Confirmed!</h1>
            <p>Thank you for booking with ITravel</p>
            <div className={styles.bookingDetails}>
              <p><strong>Booking ID:</strong> {bookingId}</p>
              <p><strong>Tour:</strong> {selectedTour?.name}</p>
              <p>A confirmation email has been sent to <strong>{savedEmail}</strong></p>
            </div>
            <div className={styles.successActions}>
              <Link href="/tours" className={styles.primaryBtn}>
                Browse More Tours
              </Link>
              <Link href="/" className={styles.secondaryBtn}>
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTour) {
    return (
      <div className={styles.loading}>
        <p>Loading tour details...</p>
      </div>
    );
  }

  return (
    <div className={styles.checkout}>
      <div className={styles.container}>
        {/* Back Link */}
        <Link href="/tours" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Tours
        </Link>

        {/* Progress Steps */}
        <div className={styles.steps}>
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
                onClick={() => goToStep(step.id as Step)}
                disabled={step.id > currentStep && !canProceed()}
                type="button"
              >
                <div className={styles.stepIcon}>
                  {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className={styles.grid}>
          {/* Left Column - Step Content */}
          <div className={styles.content}>
            {/* Step 1: Select Date & Travelers */}
            {currentStep === 1 && (
              <div className={styles.stepContent}>
                <h1 className={styles.title}>Select Your Trip Details</h1>

                {/* Tour Card */}
                <div className={styles.tourCard}>
                  <div className={styles.tourImage}>
                    <Image
                      src={selectedTour.image}
                      alt={selectedTour.name}
                      width={600}
                      height={300}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.tourInfo}>
                    <span className={styles.tourLocation}>
                      <MapPin size={14} /> {selectedTour.location}
                    </span>
                    <h2 className={styles.tourName}>{selectedTour.name}</h2>
                    <p className={styles.tourDescription}>{selectedTour.description}</p>
                    <div className={styles.tourMeta}>
                      <span><Clock size={16} /> {selectedTour.duration}</span>
                      <span><Users size={16} /> Small Group</span>
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div className={styles.formSection}>
                  <h3><Calendar size={18} /> Select Travel Date</h3>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={styles.dateInput}
                  />
                </div>

                {/* Traveler Count */}
                <div className={styles.formSection}>
                  <h3><Users size={18} /> Number of Travelers</h3>

                  <div className={styles.travelerRow}>
                    <div className={styles.travelerInfo}>
                      <User size={20} />
                      <div>
                        <span className={styles.travelerType}>Adults</span>
                        <span className={styles.travelerPrice}>{centsToDisplayPrice(priceBreakdown.adultPrice)} per person</span>
                      </div>
                    </div>
                    <div className={styles.counter}>
                      <button
                        type="button"
                        onClick={() => updateTravelerCount('adults', -1)}
                        disabled={travelers.adults <= 1}
                        aria-label="Decrease adults"
                      >
                        <Minus size={16} />
                      </button>
                      <span>{travelers.adults}</span>
                      <button
                        type="button"
                        onClick={() => updateTravelerCount('adults', 1)}
                        disabled={travelers.adults >= 10}
                        aria-label="Increase adults"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.travelerRow}>
                    <div className={styles.travelerInfo}>
                      <Users size={20} />
                      <div>
                        <span className={styles.travelerType}>Children (under 12)</span>
                        <span className={styles.travelerPrice}>{centsToDisplayPrice(priceBreakdown.childPrice)} per person (50% off)</span>
                      </div>
                    </div>
                    <div className={styles.counter}>
                      <button
                        type="button"
                        onClick={() => updateTravelerCount('children', -1)}
                        disabled={travelers.children <= 0}
                        aria-label="Decrease children"
                      >
                        <Minus size={16} />
                      </button>
                      <span>{travelers.children}</span>
                      <button
                        type="button"
                        onClick={() => updateTravelerCount('children', 1)}
                        disabled={travelers.children >= 10}
                        aria-label="Increase children"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Passenger Details */}
            {currentStep === 2 && (
              <div className={styles.stepContent}>
                <h1 className={styles.title}>Traveler Information</h1>

                {/* Contact Details */}
                <div className={styles.formSection}>
                  <h3><User size={18} /> Primary Contact</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label htmlFor="bookerName">Full Name *</label>
                      <input
                        type="text"
                        id="bookerName"
                        value={bookerName}
                        onChange={(e) => setBookerInfo(e.target.value, bookerEmail, bookerPhone)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="bookerEmail">Email *</label>
                      <input
                        type="email"
                        id="bookerEmail"
                        value={bookerEmail}
                        onChange={(e) => setBookerInfo(bookerName, e.target.value, bookerPhone)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="bookerPhone">Phone *</label>
                      <input
                        type="tel"
                        id="bookerPhone"
                        value={bookerPhone}
                        onChange={(e) => setBookerInfo(bookerName, bookerEmail, e.target.value)}
                        placeholder="+1 234 567 8900"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Passenger Names */}
                <PassengerForm
                  adults={travelers.adults}
                  children={travelers.children}
                  initialDetails={passengerDetails}
                  onDetailsChange={(details: PassengerDetail[]) => setPassengerDetails(details)}
                  onValidChange={setIsPassengerFormValid}
                />
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className={styles.stepContent}>
                <h1 className={styles.title}>Review Your Booking</h1>

                <div className={styles.reviewSection}>
                  <h3>Tour Details</h3>
                  <div className={styles.reviewCard}>
                    <Image
                      src={selectedTour.image}
                      alt={selectedTour.name}
                      width={120}
                      height={80}
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div>
                      <p className={styles.reviewTourName}>{selectedTour.name}</p>
                      <p className={styles.reviewMeta}>
                        <Calendar size={14} /> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className={styles.reviewMeta}>
                        <Clock size={14} /> {selectedTour.duration}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.reviewSection}>
                  <h3>Travelers ({travelers.adults + travelers.children})</h3>
                  <div className={styles.reviewList}>
                    {passengerDetails.map((p, i) => (
                      <div key={i} className={styles.reviewItem}>
                        <span>{p.isChild ? '👶' : '👤'} {p.fullName}</span>
                        <span className={styles.reviewTag}>{p.isChild ? 'Child' : 'Adult'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.reviewSection}>
                  <h3>Contact Information</h3>
                  <div className={styles.reviewList}>
                    <div className={styles.reviewItem}>
                      <span>Name</span>
                      <span>{bookerName}</span>
                    </div>
                    <div className={styles.reviewItem}>
                      <span>Email</span>
                      <span>{bookerEmail}</span>
                    </div>
                    <div className={styles.reviewItem}>
                      <span>Phone</span>
                      <span>{bookerPhone}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.guarantees}>
                  <div className={styles.guarantee}>
                    <Shield size={20} />
                    <div>
                      <strong>Free Cancellation</strong>
                      <p>Cancel up to 30 days before for a full refund</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className={styles.stepContent}>
                <h1 className={styles.title}>Secure Payment</h1>

                <div className={styles.demoNotice}>
                  <Lock size={16} />
                  <span>Demo Mode - No real charges will be made</span>
                </div>

                <div className={styles.formSection}>
                  <h3><CreditCard size={18} /> Card Information</h3>
                  <div className={styles.formGrid}>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="expiry">Expiry Date</label>
                      <input
                        type="text"
                        id="expiry"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="cvc">CVC</label>
                      <input
                        type="text"
                        id="cvc"
                        value={cardData.cvc}
                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>

                <p className={styles.secureNotice}>
                  <Lock size={14} />
                  Your payment is secured with SSL encryption
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={styles.navigation}>
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className={styles.backBtn}>
                  <ArrowLeft size={18} />
                  Back
                </button>
              )}
              <div className={styles.spacer} />
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={styles.nextBtn}
                  disabled={!canProceed()}
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePayment}
                  className={styles.payBtn}
                  disabled={!canProceed() || isLoading}
                >
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <Lock size={18} />
                      Pay {centsToDisplayPrice(priceBreakdown.total)}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Price Calculator */}
          <div className={styles.sidebar}>
            <PriceCalculator
              breakdown={priceBreakdown}
              tourName={tourName || selectedTour.name}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className={styles.loading}><p>Loading...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
