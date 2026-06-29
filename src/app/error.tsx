'use client';

import React, { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center font-body">
      {/* Sad Hen SVG Illustration */}
      <div className="w-full max-w-sm mb-8 text-primary/30">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto w-48 h-48">
          {/* Hen facing away / sad */}
          <path d="M60 130c0 15 10 25 30 25c20 0 40-10 50-20c15 10 30 5 30-15c0-15-5-30-20-38" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M120 100c1-5 2-15 4-20c1-5 4-5 6 0c2 5 2 10-1 15" stroke="currentColor" strokeWidth="3" />
          {/* Droplet (teardrop) */}
          <path d="M85 95c0 3-2 5-5 5s-5-2-5-5c0-4 5-9 5-9s5 5 5 9z" fill="#ff6f00" opacity="0.8" />
          {/* Floor */}
          <line x1="30" y1="156" x2="170" y2="156" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="font-display font-bold text-4xl sm:text-5xl text-primary mb-2">Something Went Wrong</h1>
      <h2 className="font-display font-semibold text-lg text-secondary mb-4">Internal Server Error</h2>
      
      <p className="text-sm sm:text-base text-foreground/60 max-w-md mb-8 leading-relaxed">
        Our farm hands are currently fixing an unexpected issue in our systems. Please try reloading the page or go back to the homepage.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-cream px-6 py-3 rounded-full font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={18} />
          <span>Try Again</span>
        </button>
        
        <Link
          href="/"
          className="w-full sm:w-auto bg-white border border-cream-dark text-primary px-6 py-3 rounded-full font-semibold shadow-sm hover:bg-cream-dark/20 transition-all flex items-center justify-center gap-2"
        >
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
