'use client';

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center font-body">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-cream-dark/40 shadow-md flex flex-col items-center gap-6">
        
        {/* Offline Illustration */}
        <div className="text-accent bg-accent/5 p-5 rounded-full">
          <WifiOff size={48} className="stroke-[1.5]" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display font-bold text-3xl text-primary tracking-tight">No Internet Connection</h1>
          <span className="text-secondary font-semibold text-sm">You are currently offline</span>
        </div>

        <p className="text-sm text-foreground/70 leading-relaxed">
          It looks like your connection has flown the coop. Please check your Wi-Fi or mobile data settings and try again.
        </p>

        <button
          onClick={handleRetry}
          className="w-full bg-primary hover:bg-primary-hover text-cream py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={16} />
          <span>Retry Connection</span>
        </button>

      </div>
    </div>
  );
}
