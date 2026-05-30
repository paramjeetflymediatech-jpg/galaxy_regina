import BookAppointmentClient from './BookAppointmentClient';
import { getSeoMetadata } from '@/src/lib/seo';

export async function generateMetadata() {
  return await getSeoMetadata(
    '/book-appointment',
    'Schedule Your Moving Date | Galaxy Movers Regina',
    'Secure your premium relocations crew. Choose your preferred day and time slot, and our logistics manager will verify availability within 15 minutes.'
  );
}

export default function BookAppointmentPage() {
  return <BookAppointmentClient />;
}
