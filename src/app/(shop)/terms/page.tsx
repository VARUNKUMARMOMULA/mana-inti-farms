import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Mana Inti Farms',
  description: 'Review the rules and guidelines for using the Mana Inti Farms website, ordering farm-fresh chicken and eggs, pricing, and payments.',
  alternates: {
    canonical: 'https://manaintifarms.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 font-body text-left">
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary mb-8 tracking-tight border-b border-cream-dark/30 pb-4">
        Terms of Service
      </h1>

      <div className="prose prose-stone max-w-none text-sm text-foreground/80 space-y-6 leading-relaxed">
        <p className="text-xs text-foreground/50">Last updated: June 29, 2026</p>
        
        <p>
          Welcome to Mana Inti Farms. These terms and conditions outline the rules and regulations for the use of Mana Inti Farms' Website.
        </p>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">1. Agreement to Terms</h2>
          <p>
            By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Mana Inti Farms' website if you do not agree to all of the terms and conditions stated on this page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">2. Ordering & Pricing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>No Registration:</strong> We allow guest checkout without requiring you to create an account. You must provide accurate delivery details.
            </li>
            <li>
              <strong>Pricing:</strong> Product prices are subject to change without prior notice, based on market availability. Prices shown at the time of placing the order will be honored.
            </li>
            <li>
              <strong>Order Confirmation:</strong> Placing an order on our site stores the order in our database. You will be redirected to WhatsApp to send the order details to our farm team for confirmation and delivery scheduling.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">3. Payments</h2>
          <p>
            We accept Cash on Delivery (COD) and UPI. For UPI payments, our delivery agent will present a QR code at the time of delivery. We do not collect online payments directly on our website at this stage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">4. Intellectual Property</h2>
          <p>
            Unless otherwise stated, Mana Inti Farms owns the intellectual property rights for all material on this website. All intellectual property rights are reserved. You must not republish, sell, rent, or sub-license material from this website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-2xl text-primary">5. Disclaimer</h2>
          <p>
            We make every effort to ensure the information on this website is correct, but we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
          </p>
        </section>
      </div>
    </div>
  );
}
