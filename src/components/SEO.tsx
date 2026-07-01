'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { BASE_URL } from '@/lib/utils';

interface SEOLDProps {
  type: 'business' | 'products' | 'breadcrumb';
  productsList?: Product[];
  breadcrumbs?: { name: string; url: string }[];
}

export default function StructuredData({ type, productsList = [], breadcrumbs = [] }: SEOLDProps) {
  let schemaData: any = null;

  if (type === 'business') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Mana Inti Farms',
      image: `${BASE_URL}/images/og-image.jpg`,
      '@id': `${BASE_URL}/#localbusiness`,
      url: BASE_URL,
      telephone: '+917981544848',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bowrampet',
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        postalCode: '500043',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 17.5684,
        longitude: 78.3698,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '06:00',
          closes: '21:00',
        },
      ],
      sameAs: [
        'https://www.facebook.com/manaintifarms',
        'https://www.instagram.com/manaintifarms',
      ],
    };
  } else if (type === 'products' && productsList.length > 0) {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: productsList.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          '@id': `${BASE_URL}/products/#${product.id}`,
          name: product.name,
          image: product.image_url || `${BASE_URL}/images/placeholder-chicken.jpg`,
          description: product.description,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: product.price,
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.in_stock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: `${BASE_URL}/products`,
          },
        },
      })),
    };
  } else if (type === 'breadcrumb' && breadcrumbs.length > 0) {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }

  if (!schemaData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
