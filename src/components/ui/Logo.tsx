'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HenIcon } from './Icons';
import { useStore } from '@/context/StoreContext';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColorClass?: string;
  subColorClass?: string;
  logoUrlOverride?: string;
}

export default function Logo({ 
  size = 40, 
  className = '', 
  showText = false,
  textColorClass = 'text-primary',
  subColorClass = 'text-secondary',
  logoUrlOverride
}: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const { homepageContent } = useStore();
  
  const logoSrc = logoUrlOverride || homepageContent?.navbar_icon_url || homepageContent?.logo_url || '/logo.png';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="relative overflow-hidden rounded-full bg-white shadow-sm border border-cream-dark/50 flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {!imageError ? (
          <Image
            src={logoSrc}
            alt="Mana Inti Farms Logo"
            fill
            className="object-cover p-0.5"
            sizes={`${size}px`}
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <div className="bg-primary text-cream w-full h-full flex items-center justify-center">
            <HenIcon size={size * 0.6} />
          </div>
        )}
      </div>
      
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-display font-bold text-xl sm:text-2xl tracking-wide leading-tight ${textColorClass}`}>
            {homepageContent?.website_name || 'Mana Inti Farms'}
          </span>
          <span className={`text-[9px] uppercase tracking-widest font-bold -mt-0.5 ${subColorClass}`}>
            {homepageContent?.tagline || 'Organic & Free Range'}
          </span>
        </div>
      )}
    </div>
  );
}
