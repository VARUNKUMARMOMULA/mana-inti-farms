import { Metadata } from 'next';
import AboutClient from './AboutClient';
import { BASE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Our Story | Mana Inti Farms',
  description: 'Discover the story behind Mana Inti Farms in Bowrampet, Hyderabad. Learn how we raise free-range country chicken and eggs ethically, completely antibiotic-free.',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

export default function AboutPage() {
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
        'name': 'About Us',
        'item': `${BASE_URL}/about`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutClient />
    </>
  );
}
