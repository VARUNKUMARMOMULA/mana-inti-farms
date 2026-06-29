'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center font-body">
      {/* 404 SVG Illustration */}
      <div className="w-full max-w-sm mb-8 text-primary/30">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto w-48 h-48">
          {/* Nest */}
          <path d="M40 140C60 160 140 160 160 140" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 145C70 165 130 165 150 145" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          {/* Broken Egg shells */}
          <path d="M85 100C85 85 95 75 105 75C115 75 125 85 125 100C125 120 85 120 85 100Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" />
          <path d="M92 82L98 92L103 85L110 95L115 88" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Question mark */}
          <text x="135" y="70" fill="#ff6f00" fontSize="36" fontWeight="bold" fontFamily="serif">?</text>
        </svg>
      </div>

      <h1 className="font-display font-bold text-6xl text-primary mb-2">404</h1>
      <h2 className="font-display font-bold text-2xl sm:text-3xl text-secondary mb-4">Page Not Found</h2>
      
      <p className="text-sm sm:text-base text-foreground/60 max-w-md mb-8 leading-relaxed">
        Oops! It looks like this egg has rolled out of our nest. The page you are looking for does not exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-cream px-6 py-3 rounded-full font-semibold shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto bg-white border border-cream-dark text-primary px-6 py-3 rounded-full font-semibold shadow-sm hover:bg-cream-dark/20 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}
