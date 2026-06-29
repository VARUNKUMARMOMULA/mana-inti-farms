import type { Metadata } from 'next';
import { Cormorant_Garamond, Poppins } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';

// Load Google Fonts
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mana Inti Farms | Fresh Country Eggs & Chicken Hyderabad',
  description: 'Experience the unmatched taste of premium country eggs and pre-dressed country chicken. Raised ethically in our free-range farm, completely antibiotic-free.',
  keywords: ['country eggs', 'country chicken', 'organic farm', 'free range eggs', 'hyderabad', 'bowrampet', 'antibiotic free chicken', 'fresh country eggs'],
  authors: [{ name: 'Mana Inti Farms' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
  openGraph: {
    title: 'Mana Inti Farms | Fresh Country Eggs & Chicken Hyderabad',
    description: 'Experience the unmatched taste of premium country eggs and pre-dressed country chicken. Raised ethically in our free-range farm, completely antibiotic-free.',
    url: 'https://manaintifarms.com',
    siteName: 'Mana Inti Farms',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mana Inti Farms - Fresh Country Eggs & Chicken',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mana Inti Farms | Fresh Country Eggs & Chicken Hyderabad',
    description: 'Experience the unmatched taste of premium country eggs and pre-dressed country chicken. Raised ethically in our free-range farm, completely antibiotic-free.',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://manaintifarms.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${poppins.variable}`}>
      <body className="antialiased min-h-screen bg-cream text-foreground">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
