import React from 'react';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Delivery Policy | Mana Inti Farms',
  description: 'Learn about our delivery zones in Hyderabad (Bowrampet, Gachibowli, Miyapur, etc.), schedules, same-day delivery slots, packaging, and free delivery options.',
  alternates: {
    canonical: `${BASE_URL}/delivery-policy`,
  },
};

export default function DeliveryPolicyPage() {
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
        'name': 'Delivery Policy',
        'item': `${BASE_URL}/delivery-policy`,
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
        Delivery Policy
      </h1>

      <div className="prose prose-stone max-w-none text-sm text-foreground/80 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">1. Delivery Zones & Areas</h2>
          <p>
            Mana Inti Farms delivers fresh country eggs and country chicken across Hyderabad. Our primary delivery areas include, but are not limited to, Bowrampet, Miyapur, Bachupally, Kukatpally, Gachibowli, Madhapur, Kondapur, Hitec City, and surrounding neighborhoods. If you are unsure if we deliver to your location, please reach out to us via WhatsApp at <strong>+91 7981544848</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">2. Delivery Schedule & Timings</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Same-Day Delivery:</strong> Orders placed before <strong>12:00 PM</strong> are eligible for same-day delivery.
            </li>
            <li>
              <strong>Next-Day Delivery:</strong> Orders placed after <strong>12:00 PM</strong> will be delivered the following morning.
            </li>
            <li>
              <strong>Delivery Slots:</strong> Deliveries are generally made between <strong>7:00 AM and 1:00 PM</strong>, as country eggs are harvested fresh in the morning and country chicken is dressed fresh.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">3. Delivery Charges</h2>
          <p>
            We charge a flat delivery fee of <strong>₹50</strong> for all standard deliveries. However, if your order value exceeds <strong>₹1,000</strong>, your delivery is completely <strong>FREE</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">4. Packaging & Hygiene</h2>
          <p>
            Hygiene is our top priority. Our country chicken is dressed in sanitary conditions, thoroughly cleaned, and packed in food-grade, leak-proof, insulated packaging to maintain freshness during transit. Eggs are hand-picked, cleaned, and packed in biodegradable pulp cartons to prevent breakage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">5. Receiving Your Order</h2>
          <p>
            Since our products are fresh and perishable, we recommend that someone is available at the delivery address to receive the order. Once delivered, country chicken should be washed and refrigerated immediately if not consumed on the same day. Eggs should be stored in a cool place or refrigerator.
          </p>
        </section>
      </div>
    </div>
  </>
);
}
