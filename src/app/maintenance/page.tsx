'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function MaintenancePage() {
  const { settings, socialLinks } = useStore();
  
  const phone = settings?.contact_details.phone_1 || '7981544848';
  const whatsappSocial = socialLinks?.find(s => s.icon_name.toLowerCase() === 'whatsapp');
  const whatsappUrl = whatsappSocial?.url || 'https://wa.me/917981544848';

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center font-body text-left">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-cream-dark/40 shadow-md flex flex-col items-center gap-6">
        
        {/* Maintenance Illustration (SVG) */}
        <div className="text-primary/30 w-36 h-36">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Barn outline */}
            <path d="M10 50L50 15L90 50V85H10V50Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Gear (wrench icon/maintenance) */}
            <circle cx="50" cy="55" r="12" stroke="#ff6f00" strokeWidth="3" />
            <path d="M50 38v5M50 67v5M33 55h5M67 55h5" stroke="#ff6f00" strokeWidth="3" strokeLinecap="round" />
            <path d="M38 43l4 4M58 63l4 4M38 67l4-4M58 43l4-4" stroke="#ff6f00" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <div className="text-center flex flex-col gap-2">
          <span className="text-accent font-bold uppercase tracking-widest text-xs">Pardon the Dust</span>
          <h1 className="font-display font-bold text-3xl text-primary tracking-tight">Farm Maintenance</h1>
        </div>

        <p className="text-sm text-foreground/70 text-center leading-relaxed">
          We are currently updating our digital farm store to bring you an even smoother ordering experience. We will be back online shortly!
        </p>

        {/* Contact info during maintenance */}
        <div className="w-full border-t border-cream-dark/30 pt-6 flex flex-col gap-4 text-xs">
          <p className="text-center font-semibold text-foreground/50 uppercase tracking-wider">
            Need to place an order immediately?
          </p>
          
          <div className="flex flex-col gap-3">
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 bg-primary text-cream py-2.5 rounded-xl font-semibold shadow-sm hover:bg-primary-hover transition-all"
            >
              <Phone size={14} />
              <span>Call Us: {phone}</span>
            </a>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl font-semibold shadow-sm hover:bg-[#20ba5a] transition-all"
            >
              <span>Order via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
