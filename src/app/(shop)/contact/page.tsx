import { Metadata } from 'next';
import ContactClient from './ContactClient';
import { BASE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact Us | Mana Inti Farms',
  description: 'Get in touch with Mana Inti Farms. Contact us via phone, WhatsApp, email, or visit our free-range farm in Bowrampet, Hyderabad.',
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
};

export default function ContactPage() {
  // Construct BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': BASE_URL,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Contact Us',
        'item': `${BASE_URL}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactClient />
    </>
  );
}
