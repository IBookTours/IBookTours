'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Trash2,
  ShoppingCart,
  Package,
} from 'lucide-react';
import PassengerForm from '@/components/Checkout/PassengerForm';
import AddToCalendar from '@/components/AddToCalendar';
import Upsells from '@/components/Upsells';
import { createEventFromBooking } from '@/lib/calendar';
import { useCartStore, formatCartPrice, CartItem } from '@/store/cartStore';
import { useBookingStore, priceStringToCents, centsToDisplayPrice, PassengerDetail } from '@/store/bookingStore';
import {
  useBookingsStore,
  cartItemsToBookingItems,
  BookingItem,
  PassengerInfo,
} from '@/store/bookingsStore';
import { siteData } from '@/data/siteData';
import { validateEmail, validatePhone, validateName, getFieldError } from '@/utils/validation';
import styles from './checkout.module.scss';

type Step = 1 | 2 | 3 | 4;
type CheckoutMode = 'cart' | 'single';

const STEPS = [
  { id: 1, label: 'Cart', icon: ShoppingCart },
  { id: 2, label: 'Details', icon: Users },
  { id: 3, label: 'Review', icon: Check },
  { id: 4, label: 'Payment', icon: CreditCard },
] as const;

// Passenger details per cart item
interface CartItemPassengers {
  cartItemId: string;
  passengers: PassengerDetail[];
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tourId = searchParams.get('tour');

  // Cart store
  const {
    items: cartItems,
    removeItem,
    updateTravelers,
    updateDate,
    getTotal,
    clearCart,
  } = useCartStore();

  // Booking store (for single tour legacy mode)
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
    reset: resetBooking,
  } = useBookingStore();

  // Bookings store for saving completed bookings
  const { addBooking } = useBookingsStore();

  // Determine checkout mode
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>('cart');
  const [selectedTour, setSelectedTour] = useState<typeof siteData.destinations[0] | null>(null);

  // Multi-item passenger details
  const [cartPassengers, setCartPassengers] = useState<CartItemPassengers[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isPassengerFormValid, setIsPassengerFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingIds, setBookingIds] = useState<string[]>([]);
  const [savedEmail, setSavedEmail] = useState('');
  const [isInitialized, setIsInitialized] = useState(false); // Prevents hydration mismatch

  // Card form state
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize checkout mode and data - runs only on client to prevent hydration mismatch
  useEffect(() => {
    if (tourId) {
      // Single tour mode from URL
      setCheckoutMode('single');
      const tour = siteData.destinations.find((d) => d.id === tourId)
        || siteData.destinations.find((d) => d.featured)
        || siteData.destinations[0];

      if (tour) {
        setSelectedTour(tour);
        const priceInCents = priceStringToCents(tour.price || '€299');
        setTour(tour.id, tour.name, tour.image, tour.duration || '3 Days', priceInCents);
      }
      setIsInitialized(true);
    } else if (cartItems.length > 0) {
      // Cart mode
      setCheckoutMode('cart');
      // Initialize passenger details for each cart item
      const initialPassengers = cartItems.map((item) => ({
        cartItemId: item.cartItemId,
        passengers: Array(item.travelers.adults + item.travelers.children)
          .fill(null)
          .map((_, i) => ({
            fullName: '',
            isChild: i >= item.travelers.adults,
          })),
      }));
      setCartPassengers(initialPassengers);
      setIsInitialized(true);
    } else {
      // No items, redirect to tours
      router.push('/tours');
    }
  }, [tourId, cartItems.length, setTour, router]);

  // Calculate totals
  const cartTotal = getTotal();
  const priceBreakdown = getPriceBreakdown();
  const displayTotal = checkoutMode === 'cart' ? cartTotal : priceBreakdown.total;

  // Validate all passenger forms for cart mode
  const validateAllPassengers = useCallback(() => {
    const errors: Record<string, string> = {};

    // Validate booker info with actual regex validation
    if (!validateName(bookerName)) {
      errors.name = getFieldError('name', bookerName) || 'Please enter a valid name';
    }
    if (!validateEmail(bookerEmail)) {
      errors.email = getFieldError('email', bookerEmail) || 'Please enter a valid email address';
    }
    if (!validatePhone(bookerPhone)) {
      errors.phone = getFieldError('phone', bookerPhone) || 'Please enter a valid phone number (10+ digits)';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return false;
    }

    if (checkoutMode === 'single') {
      return isPassengerFormValid;
    }

    // Cart mode: check all items have valid passenger names
    const allValid = cartPassengers.every((item) =>
      item.passengers.every((p) => validateName(p.fullName))
    );
    return allValid;
  }, [checkoutMode, isPassengerFormValid, bookerEmail, bookerPhone, bookerName, cartPassengers]);

  // Step navigation
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        if (checkoutMode === 'cart') {
          return cartItems.length > 0 && cartItems.every((item) => item.date.length > 0);
        }
        return selectedDate.length > 0 && travelers.adults >= 1;
      case 2:
        return validateAllPassengers();
      case 3:
        return true;
      case 4:
        return cardData.number.replace(/\s/g, '').length >= 16 && cardData.expiry.length >= 5 && cardData.cvc.length >= 3;
      default:
        return false;
    }
  }, [currentStep, checkoutMode, cartItems, selectedDate, travelers, validateAllPassengers, cardData]);

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

  // Update passengers for a cart item
  const updateCartItemPassengers = (cartItemId: string, passengers: PassengerDetail[]) => {
    setCartPassengers((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, passengers } : item
      )
    );
  };

  // Handle payment submission
  const handlePayment = async () => {
    setIsLoading(true);
    setSavedEmail(bookerEmail);

    try {
      const itemsToBook = checkoutMode === 'cart'
        ? cartItems.map((item) => ({
            tourId: item.id,
            tourName: item.name,
            date: item.date,
            travelers: item.travelers,
            price: useCartStore.getState().getItemPrice(item.cartItemId),
          }))
        : [{
            tourId: selectedTour?.id,
            tourName,
            date: selectedDate,
            travelers,
            price: priceBreakdown.total,
          }];

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: displayTotal,
          currency: 'eur',
          items: itemsToBook,
          metadata: {
            bookerName,
            bookerEmail,
            bookerPhone,
            itemCount: itemsToBook.length,
          },
        }),
      });

      if (!response.ok) throw new Error('Payment failed');

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Build booking items with passenger info
      let bookingItems: BookingItem[];

      if (checkoutMode === 'cart') {
        // Build passengers map from cartPassengers
        const passengersByItem: Record<string, PassengerInfo[]> = {};
        cartPassengers.forEach((cp) => {
          passengersByItem[cp.cartItemId] = cp.passengers.map((p) => ({
            firstName: p.fullName.split(' ')[0] || '',
            lastName: p.fullName.split(' ').slice(1).join(' ') || '',
            email: bookerEmail,
            phone: bookerPhone,
          }));
        });

        bookingItems = cartItemsToBookingItems(cartItems, passengersByItem);
      } else {
        // Single tour booking
        bookingItems = [{
          id: `item-${Date.now()}`,
          type: 'day-tour',
          name: tourName || selectedTour?.name || '',
          image: selectedTour?.image || '',
          duration: selectedTour?.duration || '',
          location: selectedTour?.location || '',
          travelDate: selectedDate,
          travelers,
          passengers: passengerDetails.map((p) => ({
            firstName: p.fullName.split(' ')[0] || '',
            lastName: p.fullName.split(' ').slice(1).join(' ') || '',
            email: bookerEmail,
            phone: bookerPhone,
          })),
          pricePerPerson: priceBreakdown.adultPrice,
          totalPrice: priceBreakdown.total,
        }];
      }

      // Save booking to bookings store
      const savedBooking = addBooking({
        userEmail: bookerEmail,
        items: bookingItems,
        status: 'confirmed',
        paymentStatus: 'paid',
        totalAmount: displayTotal,
        currency: 'EUR',
        contactInfo: {
          firstName: bookerName.split(' ')[0] || '',
          lastName: bookerName.split(' ').slice(1).join(' ') || '',
          email: bookerEmail,
          phone: bookerPhone,
        },
      });

      // Use the confirmation number from the saved booking
      setBookingIds([savedBooking.confirmationNumber]);
      setIsSuccess(true);

      // Clear cart and booking store
      if (checkoutMode === 'cart') {
        clearCart();
      }
      resetBooking();
    } catch {
      setFormErrors({ payment: 'Payment failed. Please check your card details and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Cart item traveler controls
  const updateCartItemTravelers = (cartItemId: string, type: 'adults' | 'children', delta: number) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (!item) return;

    const newCount = item.travelers[type] + delta;
    if (type === 'adults' && newCount >= 1 && newCount <= 10) {
      updateTravelers(cartItemId, newCount, item.travelers.children);
      // Update passenger details array
      const totalTravelers = newCount + item.travelers.children;
      setCartPassengers((prev) =>
        prev.map((p) => {
          if (p.cartItemId !== cartItemId) return p;
          const newPassengers = Array(totalTravelers)
            .fill(null)
            .map((_, i) => p.passengers[i] || { fullName: '', isChild: i >= newCount });
          return { ...p, passengers: newPassengers };
        })
      );
    } else if (type === 'children' && newCount >= 0 && newCount <= 10) {
      updateTravelers(cartItemId, item.travelers.adults, newCount);
      // Update passenger details array
      const totalTravelers = item.travelers.adults + newCount;
      setCartPassengers((prev) =>
        prev.map((p) => {
          if (p.cartItemId !== cartItemId) return p;
          const newPassengers = Array(totalTravelers)
            .fill(null)
            .map((_, i) => p.passengers[i] || { fullName: '', isChild: i >= item.travelers.adults });
          return { ...p, passengers: newPassengers };
        })
      );
    }
  };

  // Single tour traveler controls (legacy)
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
    const bookedItems = checkoutMode === 'cart'
      ? cartItems.map((item) => ({
          name: item.name,
          date: item.date,
          location: item.location,
          duration: item.duration,
          type: item.type,
        }))
      : [{
          name: selectedTour?.name || '',
          date: selectedDate,
          location: selectedTour?.location || '',
          duration: selectedTour?.duration || '',
          type: 'day-tour',
        }];

    return (
      <div className={styles.checkout}>
        <div className={styles.container}>
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <CheckCircle size={64} />
            </div>
            <h1>Booking{bookingIds.length > 1 ? 's' : ''} Confirmed!</h1>
            <p>Thank you for booking with ITravel</p>

            <div className={styles.bookingDetails}>
              {bookingIds.map((id, i) => (
                <div key={id} className={styles.bookingItem}>
                  <p><strong>Booking ID:</strong> {id}</p>
                  {bookedItems[i] && (
                    <>
                      <p><strong>Tour:</strong> {bookedItems[i].name}</p>
                      {bookedItems[i].date && (
                        <AddToCalendar
                          event={createEventFromBooking({
                            name: bookedItems[i].name,
                            location: bookedItems[i].location,
                            date: bookedItems[i].date,
                            duration: bookedItems[i].duration,
                            type: bookedItems[i].type,
                          })}
                          variant="button"
                          size="md"
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
              <p className={styles.emailNote}>
                Confirmation email{bookingIds.length > 1 ? 's have' : ' has'} been sent to <strong>{savedEmail}</strong>
              </p>
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

  // Empty cart redirect
  if (checkoutMode === 'cart' && cartItems.length === 0 && !isSuccess) {
    return (
      <div className={styles.checkout}>
        <div className={styles.container}>
          <div className={styles.emptyCart}>
            <ShoppingCart size={64} className={styles.emptyIcon} />
            <h2>Your cart is empty</h2>
            <p>Add some tours to your cart to continue</p>
            <Link href="/tours" className={styles.primaryBtn}>
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Wait for client-side initialization to prevent hydration mismatch
  if (!isInitialized) {
    return (
      <div className={styles.checkout}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner} />
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutMode === 'single' && !selectedTour) {
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
            {/* Step 1: Cart Review / Select Date & Travelers */}
            {currentStep === 1 && (
              <div className={styles.stepContent}>
                <h1 className={styles.title}>
                  {checkoutMode === 'cart' ? 'Review Your Cart' : 'Select Your Trip Details'}
                </h1>

                {checkoutMode === 'cart' ? (
                  // Cart Mode - Multiple Items
                  <div className={styles.cartItems}>
                    {cartItems.map((item, index) => (
                      <div key={item.cartItemId} className={styles.cartItem}>
                        <div className={styles.cartItemHeader}>
                          <div className={styles.cartItemImage}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={120}
                              height={80}
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div className={styles.cartItemInfo}>
                            <span className={styles.cartItemType}>
                              <Package size={12} />
                              {item.type === 'vacation-package' ? 'Vacation Package' : 'Day Tour'}
                            </span>
                            <h3>{item.name}</h3>
                            <p className={styles.cartItemMeta}>
                              <MapPin size={14} /> {item.location} • <Clock size={14} /> {item.duration}
                            </p>
                          </div>
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => removeItem(item.cartItemId)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className={styles.cartItemDetails}>
                          {/* Date Selection */}
                          <div className={styles.cartItemField}>
                            <label><Calendar size={16} /> Travel Date</label>
                            <input
                              type="date"
                              value={item.date}
                              onChange={(e) => updateDate(item.cartItemId, e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className={styles.dateInput}
                            />
                          </div>

                          {/* Travelers */}
                          <div className={styles.cartItemField}>
                            <label><Users size={16} /> Travelers</label>
                            <div className={styles.travelerControls}>
                              <div className={styles.travelerControl}>
                                <span>Adults</span>
                                <div className={styles.counter}>
                                  <button
                                    type="button"
                                    onClick={() => updateCartItemTravelers(item.cartItemId, 'adults', -1)}
                                    disabled={item.travelers.adults <= 1}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span>{item.travelers.adults}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateCartItemTravelers(item.cartItemId, 'adults', 1)}
                                    disabled={item.travelers.adults >= 10}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                              <div className={styles.travelerControl}>
                                <span>Children</span>
                                <div className={styles.counter}>
                                  <button
                                    type="button"
                                    onClick={() => updateCartItemTravelers(item.cartItemId, 'children', -1)}
                                    disabled={item.travelers.children <= 0}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span>{item.travelers.children}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateCartItemTravelers(item.cartItemId, 'children', 1)}
                                    disabled={item.travelers.children >= 10}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={styles.cartItemPrice}>
                            {formatCartPrice(useCartStore.getState().getItemPrice(item.cartItemId))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single Tour Mode (Legacy)
                  <>
                    {/* Tour Card */}
                    <div className={styles.tourCard}>
                      <div className={styles.tourImage}>
                        <Image
                          src={selectedTour!.image}
                          alt={selectedTour!.name}
                          width={600}
                          height={300}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className={styles.tourInfo}>
                        <span className={styles.tourLocation}>
                          <MapPin size={14} /> {selectedTour!.location}
                        </span>
                        <h2 className={styles.tourName}>{selectedTour!.name}</h2>
                        <p className={styles.tourDescription}>{selectedTour!.description}</p>
                        <div className={styles.tourMeta}>
                          <span><Clock size={16} /> {selectedTour!.duration}</span>
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
                  </>
                )}
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
                        onChange={(e) => {
                          setBookerInfo(e.target.value, bookerEmail, bookerPhone);
                          if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
                        }}
                        placeholder="John Doe"
                        required
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={!!formErrors.name}
                        aria-describedby={formErrors.name ? 'name-error' : undefined}
                        className={formErrors.name ? styles.inputError : ''}
                      />
                      {formErrors.name && (
                        <span id="name-error" className={styles.fieldError} role="alert">
                          {formErrors.name}
                        </span>
                      )}
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="bookerEmail">Email *</label>
                      <input
                        type="email"
                        id="bookerEmail"
                        value={bookerEmail}
                        onChange={(e) => {
                          setBookerInfo(bookerName, e.target.value, bookerPhone);
                          if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        placeholder="john@example.com"
                        required
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={!!formErrors.email}
                        aria-describedby={formErrors.email ? 'email-error' : undefined}
                        className={formErrors.email ? styles.inputError : ''}
                      />
                      {formErrors.email && (
                        <span id="email-error" className={styles.fieldError} role="alert">
                          {formErrors.email}
                        </span>
                      )}
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="bookerPhone">Phone *</label>
                      <input
                        type="tel"
                        id="bookerPhone"
                        value={bookerPhone}
                        onChange={(e) => {
                          setBookerInfo(bookerName, bookerEmail, e.target.value);
                          if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        placeholder="+1 234 567 8900"
                        required
                        autoComplete="tel"
                        aria-required="true"
                        aria-invalid={!!formErrors.phone}
                        aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                        className={formErrors.phone ? styles.inputError : ''}
                      />
                      {formErrors.phone && (
                        <span id="phone-error" className={styles.fieldError} role="alert">
                          {formErrors.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {checkoutMode === 'cart' ? (
                  // Multi-item passenger forms
                  <div className={styles.multiItemPassengers}>
                    {/* Item Tabs */}
                    <div className={styles.itemTabs}>
                      {cartItems.map((item, index) => (
                        <button
                          key={item.cartItemId}
                          type="button"
                          className={`${styles.itemTab} ${activeItemIndex === index ? styles.itemTabActive : ''}`}
                          onClick={() => setActiveItemIndex(index)}
                        >
                          <span className={styles.itemTabNumber}>{index + 1}</span>
                          <span className={styles.itemTabName}>{item.name}</span>
                          <span className={styles.itemTabCount}>
                            {item.travelers.adults + item.travelers.children} travelers
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Active Item Passenger Form */}
                    {cartItems[activeItemIndex] && cartPassengers[activeItemIndex] && (
                      <div className={styles.passengerSection}>
                        <h3>Passengers for {cartItems[activeItemIndex].name}</h3>
                        <div className={styles.passengerList}>
                          {cartPassengers[activeItemIndex].passengers.map((passenger, pIndex) => (
                            <div key={pIndex} className={styles.passengerField}>
                              <label>
                                {passenger.isChild ? `Child ${pIndex - cartItems[activeItemIndex].travelers.adults + 1}` : `Adult ${pIndex + 1}`} *
                              </label>
                              <input
                                type="text"
                                value={passenger.fullName}
                                onChange={(e) => {
                                  const newPassengers = [...cartPassengers[activeItemIndex].passengers];
                                  newPassengers[pIndex] = { ...newPassengers[pIndex], fullName: e.target.value };
                                  updateCartItemPassengers(cartItems[activeItemIndex].cartItemId, newPassengers);
                                }}
                                placeholder="Full name as on ID"
                                required
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Single tour passenger form
                  <PassengerForm
                    adults={travelers.adults}
                    children={travelers.children}
                    initialDetails={passengerDetails}
                    onDetailsChange={(details: PassengerDetail[]) => setPassengerDetails(details)}
                    onValidChange={setIsPassengerFormValid}
                  />
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className={styles.stepContent}>
                <h1 className={styles.title}>Review Your Booking</h1>

                {checkoutMode === 'cart' ? (
                  // Multi-item review
                  <div className={styles.reviewItems}>
                    {cartItems.map((item, index) => (
                      <div key={item.cartItemId} className={styles.reviewSection}>
                        <h3>Booking {index + 1}: {item.name}</h3>
                        <div className={styles.reviewCard}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={70}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div className={styles.reviewCardInfo}>
                            <p className={styles.reviewTourName}>{item.name}</p>
                            <p className={styles.reviewMeta}>
                              <Calendar size={14} /> {new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className={styles.reviewMeta}>
                              <Clock size={14} /> {item.duration}
                            </p>
                            <p className={styles.reviewMeta}>
                              <Users size={14} /> {item.travelers.adults} adult{item.travelers.adults !== 1 ? 's' : ''}{item.travelers.children > 0 ? `, ${item.travelers.children} child${item.travelers.children !== 1 ? 'ren' : ''}` : ''}
                            </p>
                          </div>
                          <div className={styles.reviewCardPrice}>
                            {formatCartPrice(useCartStore.getState().getItemPrice(item.cartItemId))}
                          </div>
                        </div>

                        {/* Passengers for this item */}
                        {cartPassengers[index] && (
                          <div className={styles.reviewPassengers}>
                            <h4>Travelers</h4>
                            <div className={styles.reviewList}>
                              {cartPassengers[index].passengers.map((p, i) => (
                                <div key={i} className={styles.reviewItem}>
                                  <span>{p.isChild ? '👶' : '👤'} {p.fullName}</span>
                                  <span className={styles.reviewTag}>{p.isChild ? 'Child' : 'Adult'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single tour review
                  <>
                    <div className={styles.reviewSection}>
                      <h3>Tour Details</h3>
                      <div className={styles.reviewCard}>
                        <Image
                          src={selectedTour!.image}
                          alt={selectedTour!.name}
                          width={120}
                          height={80}
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div>
                          <p className={styles.reviewTourName}>{selectedTour!.name}</p>
                          <p className={styles.reviewMeta}>
                            <Calendar size={14} /> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className={styles.reviewMeta}>
                            <Clock size={14} /> {selectedTour!.duration}
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
                  </>
                )}

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

                {/* Upsells - suggest additional tours */}
                {checkoutMode === 'cart' && cartItems.length > 0 && (
                  <Upsells
                    currentTourId={cartItems[0].id}
                    maxItems={2}
                  />
                )}
                {checkoutMode === 'single' && selectedTour && (
                  <Upsells
                    currentTourId={selectedTour.id}
                    maxItems={2}
                  />
                )}
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
                        autoComplete="cc-number"
                        aria-required="true"
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
                        autoComplete="cc-exp"
                        aria-required="true"
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
                        autoComplete="cc-csc"
                        aria-required="true"
                      />
                    </div>
                  </div>
                </div>

                <p className={styles.secureNotice}>
                  <Lock size={14} />
                  Your payment is secured with SSL encryption
                </p>

                {formErrors.payment && (
                  <div className={styles.paymentError} role="alert">
                    {formErrors.payment}
                  </div>
                )}
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
                      Pay {formatCartPrice(displayTotal)}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className={styles.sidebar}>
            <div className={styles.orderSummary}>
              <h3>Order Summary</h3>

              {checkoutMode === 'cart' ? (
                // Cart summary
                <>
                  <div className={styles.summaryItems}>
                    {cartItems.map((item) => (
                      <div key={item.cartItemId} className={styles.summaryItem}>
                        <div className={styles.summaryItemInfo}>
                          <p className={styles.summaryItemName}>{item.name}</p>
                          <p className={styles.summaryItemMeta}>
                            {item.travelers.adults + item.travelers.children} traveler{(item.travelers.adults + item.travelers.children) !== 1 ? 's' : ''}
                            {item.date && ` • ${new Date(item.date).toLocaleDateString()}`}
                          </p>
                        </div>
                        <p className={styles.summaryItemPrice}>
                          {formatCartPrice(useCartStore.getState().getItemPrice(item.cartItemId))}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className={styles.summaryDivider} />

                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatCartPrice(cartTotal)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>

                  <div className={styles.summaryDivider} />

                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>{formatCartPrice(cartTotal)}</span>
                  </div>
                </>
              ) : (
                // Single tour summary
                <>
                  <div className={styles.summaryItems}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryItemInfo}>
                        <p className={styles.summaryItemName}>{tourName || selectedTour?.name}</p>
                        <p className={styles.summaryItemMeta}>
                          {travelers.adults + travelers.children} traveler{(travelers.adults + travelers.children) !== 1 ? 's' : ''}
                          {selectedDate && ` • ${new Date(selectedDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.summaryDivider} />

                  <div className={styles.summaryRow}>
                    <span>{travelers.adults} Adult{travelers.adults !== 1 ? 's' : ''}</span>
                    <span>{centsToDisplayPrice(priceBreakdown.adultTotal)}</span>
                  </div>
                  {travelers.children > 0 && (
                    <div className={styles.summaryRow}>
                      <span>{travelers.children} Child{travelers.children !== 1 ? 'ren' : ''}</span>
                      <span>{centsToDisplayPrice(priceBreakdown.childTotal)}</span>
                    </div>
                  )}

                  <div className={styles.summaryDivider} />

                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>{centsToDisplayPrice(priceBreakdown.total)}</span>
                  </div>
                </>
              )}

              <div className={styles.summaryGuarantees}>
                <p><Shield size={14} /> Best Price Guarantee</p>
                <p><Lock size={14} /> Secure Payment</p>
              </div>
            </div>
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
