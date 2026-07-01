import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { BASE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Mana Inti Farms | Fresh Country Eggs & Chicken Hyderabad',
  description: 'Experience the unmatched taste of premium country eggs and pre-dressed country chicken. Raised ethically in our free-range farm in Bowrampet, completely antibiotic-free.',
  alternates: {
    canonical: BASE_URL,
  },
};

export default function HomePage() {
  // Construct LocalBusiness JSON-LD schema for search engines
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Mana Inti Farms',
    'image': `${BASE_URL}/images/og-image.jpg`,
    'telephone': '+917981544848',
    'email': 'sampyadav12@gmail.com',
    'url': BASE_URL,
    'priceRange': '$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Bowrampet',
      'addressLocality': 'Hyderabad',
      'addressRegion': 'Telangana',
      'postalCode': '500043',
      'addressCountry': 'IN',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 17.5684,
      'longitude': 78.3698,
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      'opens': '06:00',
      'closes': '21:00',
    },
    'sameAs': [
      'https://www.facebook.com/manaintifarms',
      'https://www.instagram.com/manaintifarms',
    ],
  };

  // Construct Organization JSON-LD schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Mana Inti Farms',
    'url': BASE_URL,
    'logo': `${BASE_URL}/favicon.ico`,
    'sameAs': [
      'https://www.facebook.com/manaintifarms',
      'https://www.instagram.com/manaintifarms',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomeClient />
    </>
  );
}
