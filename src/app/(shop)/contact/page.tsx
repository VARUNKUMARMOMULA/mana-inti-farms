import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Mana Inti Farms',
  description: 'Get in touch with Mana Inti Farms. Contact us via phone, WhatsApp, email, or visit our free-range farm in Bowrampet, Hyderabad.',
  alternates: {
    canonical: 'https://manaintifarms.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
