import { Metadata } from 'next';
import FAQClient from './FAQClient';
import { faqs } from './faqData';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Mana Inti Farms',
  description: 'Got questions? Find answers on our farming methods, country eggs vs. broiler eggs, yolk color, hygienic chicken dressing, and same-day delivery slots in Hyderabad.',
  alternates: {
    canonical: 'https://manaintifarms.com/faq',
  },
};

export default function FAQPage() {
  // Construct FAQ JSON-LD schema for search engines
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQClient />
    </>
  );
}
