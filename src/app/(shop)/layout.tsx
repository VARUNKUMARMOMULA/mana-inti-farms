import React from 'react';
import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';
import FloatingButtons from '@/components/shop/FloatingButtons';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
