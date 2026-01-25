'use client';

import { useState, useEffect } from 'react';
import { User, Baby, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { PassengerDetail } from '@/store/bookingStore';
import styles from './PassengerForm.module.scss';

interface PassengerFormProps {
  adults: number;
  children: number;
  initialDetails?: PassengerDetail[];
  onDetailsChange: (details: PassengerDetail[]) => void;
  onValidChange?: (isValid: boolean) => void;
}

export default function PassengerForm({
  adults,
  children,
  initialDetails = [],
  onDetailsChange,
  onValidChange,
}: PassengerFormProps) {
  const totalPassengers = adults + children;

  // Initialize passenger details
  const [passengers, setPassengers] = useState<PassengerDetail[]>(() => {
    if (initialDetails.length === totalPassengers) {
      return initialDetails;
    }

    // Create default entries
    const defaultPassengers: PassengerDetail[] = [];
    for (let i = 0; i < adults; i++) {
      defaultPassengers.push({
        fullName: initialDetails[i]?.fullName || '',
        isChild: false,
        specialRequests: initialDetails[i]?.specialRequests || '',
      });
    }
    for (let i = 0; i < children; i++) {
      const idx = adults + i;
      defaultPassengers.push({
        fullName: initialDetails[idx]?.fullName || '',
        isChild: true,
        specialRequests: initialDetails[idx]?.specialRequests || '',
      });
    }
    return defaultPassengers;
  });

  const [expandedRequests, setExpandedRequests] = useState<number | null>(null);

  // Sync with parent when travelers count changes
  useEffect(() => {
    if (passengers.length !== totalPassengers) {
      const newPassengers: PassengerDetail[] = [];
      for (let i = 0; i < adults; i++) {
        newPassengers.push(passengers[i] || { fullName: '', isChild: false, specialRequests: '' });
      }
      for (let i = 0; i < children; i++) {
        const oldIdx = adults + i;
        newPassengers.push(passengers[oldIdx] || { fullName: '', isChild: true, specialRequests: '' });
      }
      setPassengers(newPassengers);
    }
  }, [adults, children, totalPassengers]);

  // Notify parent of changes
  useEffect(() => {
    onDetailsChange(passengers);

    // Check validity
    const allNamed = passengers.every(p => p.fullName.trim().length >= 2);
    onValidChange?.(allNamed);
  }, [passengers, onDetailsChange, onValidChange]);

  const updatePassenger = (index: number, field: keyof PassengerDetail, value: string | boolean) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const toggleRequests = (index: number) => {
    setExpandedRequests(prev => prev === index ? null : index);
  };

  return (
    <div className={styles.passengerForm}>
      <div className={styles.header}>
        <h3>Traveler Details</h3>
        <p>Please enter the name of each traveler as it appears on their ID/passport</p>
      </div>

      <div className={styles.passengerList}>
        {passengers.map((passenger, index) => {
          const isAdult = index < adults;
          const passengerNumber = isAdult ? index + 1 : index - adults + 1;
          const label = isAdult ? `Adult ${passengerNumber}` : `Child ${passengerNumber}`;
          const isExpanded = expandedRequests === index;

          return (
            <div key={index} className={styles.passengerCard}>
              <div className={styles.passengerHeader}>
                <div className={styles.passengerIcon}>
                  {isAdult ? <User size={18} /> : <Baby size={18} />}
                </div>
                <span className={styles.passengerLabel}>{label}</span>
                {index === 0 && <span className={styles.primaryBadge}>Primary Contact</span>}
              </div>

              <div className={styles.passengerFields}>
                <div className={styles.field}>
                  <label htmlFor={`passenger-${index}-name`}>Full Name *</label>
                  <input
                    type="text"
                    id={`passenger-${index}-name`}
                    value={passenger.fullName}
                    onChange={(e) => updatePassenger(index, 'fullName', e.target.value)}
                    placeholder={isAdult ? 'John Doe' : 'Jane Doe'}
                    required
                    autoComplete={index === 0 ? 'name' : 'given-name'}
                    aria-required="true"
                  />
                </div>

                <button
                  type="button"
                  className={styles.requestsToggle}
                  onClick={() => toggleRequests(index)}
                  aria-expanded={isExpanded}
                >
                  <MessageSquare size={16} />
                  <span>Special Requests</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isExpanded && (
                  <div className={styles.requestsField}>
                    <textarea
                      id={`passenger-${index}-requests`}
                      value={passenger.specialRequests || ''}
                      onChange={(e) => updatePassenger(index, 'specialRequests', e.target.value)}
                      placeholder="Dietary requirements, accessibility needs, allergies..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.note}>
        <strong>Note:</strong> Names must match official travel documents.
        Children under 12 receive a 50% discount.
      </div>
    </div>
  );
}
