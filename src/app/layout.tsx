import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Poppins } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { BASE_URL } from '@/lib/utils';
import Script from 'next/script';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Mana Inti Farms | Fresh Country Eggs & Chicken Hyderabad',
  description: 'Experience the unmatched taste of premium country eggs and pre-dressed country chicken. Raised ethically in our free-range farm, completely antibiotic-free.',
  keywords: ['country eggs', 'country chicken', 'organic farm', 'free range eggs', 'hyderabad', 'bowrampet', 'antibiotic free chicken', 'fresh country eggs'],
  authors: [{ name: 'Mana Inti Farms' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Mana Inti Farms | Fresh Country Eggs & Chicken Hyderabad',
    description: 'Experience the unmatched taste of premium country eggs and pre-dressed country chicken. Raised ethically in our free-range farm, completely antibiotic-free.',
    url: BASE_URL,
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
    canonical: BASE_URL,
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
        {/* Google Analytics GA4 Setup */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GKNPVBW3CD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GKNPVBW3CD');
          `}
        </Script>

        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
