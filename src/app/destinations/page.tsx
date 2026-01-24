import { redirect } from 'next/navigation';

// /destinations redirects to /tours
export default function DestinationsPage() {
  redirect('/tours');
}
