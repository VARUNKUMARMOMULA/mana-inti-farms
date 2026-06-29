'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowUp } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

// Simple Custom WhatsApp Icon since Lucide doesn't have it
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default function FloatingButtons() {
  const { settings, socialLinks } = useStore();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const callPhone = settings?.contact_details.phone_1 || '7981544848';

  // Find dynamic WhatsApp link from social settings
  const whatsappSocial = socialLinks?.find(s => s.icon_name.toLowerCase() === 'whatsapp');
  const isWhatsappEnabled = whatsappSocial ? whatsappSocial.enabled : true;
  const whatsappUrl = whatsappSocial?.url || `https://wa.me/917981544848?text=${encodeURIComponent(
    'Hello Mana Inti Farms, I would like to know more about your fresh farm products and place an order.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-45 flex flex-col gap-3 items-end">
      
      {/* WhatsApp Button */}
      {isWhatsappEnabled && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all border border-[#25D366]/20 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          title="Chat on WhatsApp"
        >
          <WhatsAppIcon className="h-6 w-6 text-white stroke-none" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-out text-sm font-semibold font-body whitespace-nowrap">
            WhatsApp Us
          </span>
        </motion.a>
      )}

      {/* Call Button */}
      <motion.a
        href={`tel:${callPhone}`}
        className="bg-accent text-white p-3.5 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all border border-accent/20 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        title="Call Us"
      >
        <Phone size={22} className="text-white fill-white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-out text-sm font-semibold font-body whitespace-nowrap">
          Call Now
        </span>
      </motion.a>

      {/* Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="bg-primary text-cream p-3 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center border border-primary-hover transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1, backgroundColor: '#2d5a27' }}
            whileTap={{ scale: 0.95 }}
            title="Scroll to Top"
          >
            <ArrowUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>
      
    </div>
  );
}
