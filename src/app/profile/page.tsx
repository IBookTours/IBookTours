import { Metadata } from 'next';
import { getSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import UserProfileClient from './UserProfileClient';

export const metadata: Metadata = {
  title: 'My Profile | ITravel',
  description: 'View and manage your ITravel profile and bookings',
};

export default async function ProfilePage() {
  const session = await getSession();

  // This should be handled by middleware, but double-check here
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/profile');
  }

  return <UserProfileClient session={session} />;
}
