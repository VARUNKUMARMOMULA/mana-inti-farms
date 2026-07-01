import { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { BASE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Fresh Country Eggs & Chicken | Mana Inti Farms',
  description: 'Order 100% natural, antibiotic-free free-range country eggs and freshly dressed country chicken (Natukodi) online. Delivered fresh to your home in Hyderabad.',
  alternates: {
    canonical: `${BASE_URL}/products`,
  },
};

export default function ProductsPage() {
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
        'name': 'Products',
        'item': `${BASE_URL}/products`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductsClient />
    </>
  );
}
