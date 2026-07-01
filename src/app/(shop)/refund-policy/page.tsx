import React from 'react';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Mana Inti Farms',
  description: 'Read our policy on order cancellations, quality concerns, replacements for broken eggs or transit damage, and refund processing timelines.',
  alternates: {
    canonical: `${BASE_URL}/refund-policy`,
  },
};

export default function RefundPolicyPage() {
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
        'name': 'Refund & Cancellation Policy',
        'item': `${BASE_URL}/refund-policy`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="py-12 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 font-body text-left">
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary mb-8 tracking-tight border-b border-cream-dark/30 pb-4">
        Cancellation & Refund Policy
      </h1>

      <div className="prose prose-stone max-w-none text-sm text-foreground/80 space-y-6 leading-relaxed">
        <p className="text-xs text-foreground/50">Last updated: June 29, 2026</p>
        
        <p>
          At Mana Inti Farms, we strive to deliver the freshest, highest quality country chicken and eggs. Because our products are fresh and perishable, we have established the following guidelines for cancellations, replacements, and refunds.
        </p>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">1. Order Cancellation</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Before Dispatch:</strong> You can cancel your order at any time before it is dispatched from our farm. To cancel, please call or WhatsApp us immediately at <strong>+91 7981544848</strong>.
            </li>
            <li>
              <strong>After Dispatch:</strong> Once the order has left our farm and is with our delivery partner, cancellations are not accepted.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">2. Quality Concerns & Damaged Items</h2>
          <p>
            We take extreme care in dressing chicken and packing eggs. However, in the rare event that:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your eggs are broken during transit.</li>
            <li>The chicken packaging is damaged or leaking.</li>
            <li>You receive the wrong item or incorrect quantity.</li>
          </ul>
          <p>
            Please inspect the items at the time of delivery. If you notice any issues, please inform the delivery partner immediately, or take a photo of the damaged items and contact us via WhatsApp within <strong>2 hours</strong> of delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">3. Replacements & Refunds</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Replacements:</strong> For verified issues (such as broken eggs or wrong items), we will arrange a free replacement on our next delivery run.
            </li>
            <li>
              <strong>Refunds:</strong> If a replacement is not possible or desired, we will issue a refund for the affected items. The refund will be credited to your UPI account (Google Pay, PhonePe, Paytm, etc.) within <strong>24 hours</strong>.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">4. Non-Returnable Items</h2>
          <p>
            Due to the perishable nature of country chicken and eggs, we do not accept physical returns of items once they have been successfully delivered and accepted. Quality issues will be resolved via replacements or refunds without requiring a return.
          </p>
        </section>
      </div>
    </div>
  </>
);
}
