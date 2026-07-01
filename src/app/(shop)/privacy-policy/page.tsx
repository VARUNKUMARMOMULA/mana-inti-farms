import React from 'react';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Privacy Policy | Mana Inti Farms',
  description: 'Understand how Mana Inti Farms handles your order information, name, phone number, address, and browser cookies. Your privacy is our priority.',
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
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
        'name': 'Privacy Policy',
        'item': `${BASE_URL}/privacy-policy`,
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
        Privacy Policy
      </h1>

      <div className="prose prose-stone max-w-none text-sm text-foreground/80 space-y-6 leading-relaxed">
        <p className="text-xs text-foreground/50">Last updated: June 29, 2026</p>
        
        <p>
          At Mana Inti Farms, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Mana Inti Farms and how we use it.
        </p>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">1. Information We Collect</h2>
          <p>
            We do not require user registration to place orders. However, to fulfill your orders, we collect the following details at checkout:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your Name</li>
            <li>Contact Phone Number</li>
            <li>Delivery Address</li>
            <li>Special Order Notes or Instructions</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">2. How We Use Your Information</h2>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide, operate, and maintain our website.</li>
            <li>Fulfill and process your orders.</li>
            <li>Generate formatted WhatsApp messages to help you submit your order easily.</li>
            <li>Contact you regarding order confirmations, updates, or delivery scheduling.</li>
            <li>Understand and analyze how you use our website.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">3. Data Security</h2>
          <p>
            Your order details are stored securely in our database. We do not sell, rent, or share your personal information with third parties for marketing purposes. Your details are only accessed by our farm administrators and delivery personnel to complete your delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">4. Cookies</h2>
          <p>
            Like any other website, Mana Inti Farms uses 'cookies' or local browser storage to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited (e.g. saving your shopping cart items). This is used to optimize the users' experience.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">5. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>sampyadav12@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  </>
);
}
