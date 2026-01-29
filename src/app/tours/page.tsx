import { Suspense } from 'react';
import { Metadata } from 'next';
import ToursClient from './ToursClient';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Tours & Packages | IBookTours',
  description: 'Explore our curated collection of travel packages and adventure tours across the globe.',
};

function ToursLoading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default async function ToursPage() {
  const destinations = siteData.destinations;

  return (
    <Suspense fallback={<ToursLoading />}>
      <ToursClient
        destinations={destinations}
        vacationPackages={siteData.vacationPackages}
        dayTours={siteData.dayTours}
      />
    </Suspense>
  );
}
