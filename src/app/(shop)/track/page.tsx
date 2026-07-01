import { Metadata } from 'next';
import TrackClient from './TrackClient';

export const metadata: Metadata = {
  title: 'Track Order | Mana Inti Farms',
  robots: 'noindex, nofollow',
};

export default function TrackOrderPage() {
  return <TrackClient />;
}
