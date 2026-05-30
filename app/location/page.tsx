import LocationsClient from './LocationsClient';
import { getSeoMetadata } from '@/src/lib/seo';

export async function generateMetadata() {
  return await getSeoMetadata(
    '/location',
    'Find Moving Crews Across Regina | Galaxy Movers Regina',
    'Select your Province, Region, and City to explore specialized residential, commercial, packing, and storage services in your local neighborhood.'
  );
}

export default function LocationsPage() {
  return <LocationsClient />;
}
