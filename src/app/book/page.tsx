import { redirect } from 'next/navigation';

// /book redirects to /tours since booking is done per tour
export default function BookPage() {
  redirect('/tours');
}
