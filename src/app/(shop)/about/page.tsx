import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'Our Story | Mana Inti Farms',
  description: 'Discover the story behind Mana Inti Farms in Bowrampet, Hyderabad. Learn how we raise free-range country chicken and eggs ethically, completely antibiotic-free.',
  alternates: {
    canonical: 'https://manaintifarms.com/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
