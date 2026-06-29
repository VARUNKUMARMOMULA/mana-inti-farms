'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center font-body text-left">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-cream-dark/40 shadow-md flex flex-col items-center gap-6">
        
        {/* Hatching Chick SVG */}
        <div className="text-primary/30 w-36 h-36">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Cracked Egg */}
            <path d="M20 60C20 80 35 90 50 90C65 90 80 80 80 60C80 50 75 45 70 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 60C25 58 32 63 36 58C40 54 44 60 48 56C52 52 56 58 60 54C65 50 70 54 75 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Little Chick head peeking out */}
            <circle cx="50" cy="42" r="14" fill="#e6a100" />
            {/* Chick eyes */}
            <circle cx="45" cy="40" r="1.5" fill="black" />
            <circle cx="55" cy="40" r="1.5" fill="black" />
            {/* Chick beak */}
            <path d="M48 44l2 3l2-3H48z" fill="#ff6f00" />
          </svg>
        </div>

        <div className="text-center flex flex-col gap-2">
          <span className="text-accent font-bold uppercase tracking-widest text-xs">Hatching Soon</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary tracking-tight">New Features</h1>
        </div>

        <p className="text-sm text-foreground/70 text-center leading-relaxed">
          We are busy incubating some exciting new features for Mana Inti Farms, including online payment integrations, customer accounts, and subscription plans!
        </p>

        {/* Subscription Form */}
        {subscribed ? (
          <div className="bg-[#1e3f20]/5 border border-primary/20 text-primary text-xs p-4 rounded-xl text-center w-full">
            🎉 Thank you! We will notify you as soon as we launch.
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="w-full flex flex-col gap-3">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-dark/85 bg-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-cream py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Notify Me</span>
              <Send size={14} />
            </button>
          </form>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline mt-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Homepage</span>
        </Link>

      </div>
    </div>
  );
}
