'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { HenIcon } from '../ui/Icons';
import Logo from '../ui/Logo';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

export default function Footer() {
  const { settings, homepageContent, socialLinks } = useStore();

  const phone1 = settings?.contact_details.phone_1 || '7981544848';
  const phone2 = settings?.contact_details.phone_2 || '7995986012';
  const email = settings?.contact_details.email || 'sampyadav12@gmail.com';
  const address = settings?.contact_details.address || 'Bowrampet, Hyderabad, Telangana';
  const timings = settings?.business_hours.timings || '6:00 AM - 9:00 PM';
  const days = settings?.business_hours.days || 'Monday - Sunday';

  // Map icon names to Lucide icon components
  const iconMap: Record<string, React.ComponentType<any>> = {
    facebook: (props) => (
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    instagram: (props) => (
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    youtube: (props) => (
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
      </svg>
    ),
    twitter: (props) => (
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
    linkedin: (props) => (
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    telegram: (props) => (
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
    whatsapp: (props) => (
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  };

  return (
    <footer className="bg-primary text-cream pt-16 pb-8 border-t border-primary-hover/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: About & Social */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02] w-fit">
              <Logo size={46} showText={true} textColorClass="text-cream" subColorClass="text-accent" logoUrlOverride={homepageContent?.footer_logo_url} />
            </Link>
            <p className="text-sm text-cream-dark/80 leading-relaxed font-body">
              Experience the authentic taste of premium, farm-fresh country eggs and pre-dressed country chicken. Raised ethically in Hyderabad in a natural, free-range environment. 100% organic feed and antibiotic-free.
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {socialLinks && socialLinks
                .filter((s) => s.enabled && s.url)
                .map((social) => {
                  const IconComponent = iconMap[social.icon_name.toLowerCase()];
                  if (!IconComponent) return null;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-primary-hover hover:bg-accent text-cream rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center"
                      aria-label={social.platform}
                    >
                      <IconComponent />
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Column 2: Quick & Legal Links */}
          <div className="grid grid-cols-2 gap-5 text-left">
            <div>
              <h3 className="font-display font-semibold text-lg text-accent mb-4 tracking-wide flex items-center gap-1.5">
                Explore 🌾
              </h3>
              <ul className="space-y-2.5 text-sm font-body text-cream-dark/80">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li><Link href="/products" className="hover:text-accent transition-colors">Products</Link></li>
                <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                <li><Link href="/track" className="hover:text-accent transition-colors">Track Order</Link></li>
                <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-accent mb-4 tracking-wide flex items-center gap-1.5">
                Policies 📜
              </h3>
              <ul className="space-y-2.5 text-sm font-body text-cream-dark/80">
                <li><Link href="/delivery-policy" className="hover:text-accent transition-colors">Delivery Policy</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund-policy" className="hover:text-accent transition-colors">Refund Policy</Link></li>
                <li><Link href="/admin/login" className="hover:text-accent transition-colors">Admin Login</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col gap-4 text-left">
            <h3 className="font-display font-semibold text-lg text-accent mb-1 tracking-wide flex items-center gap-1.5">
              Contact Us 📞
            </h3>
            
            <div className="flex items-start gap-3 text-sm text-cream-dark/80 font-body">
              <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            
            <div className="flex items-start gap-3 text-sm text-cream-dark/80 font-body">
              <Phone size={18} className="text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <a href={`tel:${phone1}`} className="hover:text-accent transition-colors">+91 {phone1}</a>
                <a href={`tel:${phone2}`} className="hover:text-accent transition-colors">+91 {phone2}</a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-cream-dark/80 font-body">
              <Mail size={18} className="text-accent shrink-0 mt-0.5" />
              <a href={`mailto:${email}`} className="hover:text-accent transition-colors break-all">{email}</a>
            </div>

            <div className="flex items-start gap-3 text-sm text-cream-dark/80 font-body">
              <Clock size={18} className="text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-semibold">{days}</span>
                <span>{timings}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Map Embed */}
          <div className="flex flex-col text-left">
            <h3 className="font-display font-semibold text-lg text-accent mb-4 tracking-wide flex items-center gap-1.5">
              Our Location 📍
            </h3>
            <div className="w-full h-44 rounded-xl overflow-hidden shadow-md border border-primary-hover">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15214.730303867623!2d78.36979607873499!3d17.568453412571227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8ebdf4ea9999%3A0xe5a3c106b3a0cc52!2sBowrampet%2C%20Hyderabad%2C%20Telangana%20500043!5e0!3m2!1sen!2sin!4v1719600000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mana Inti Farms Location Map"
              />
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-primary-hover/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-dark/60 font-body">
          <p>© {new Date().getFullYear()} Mana Inti Farms. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span>Made with 💚 for Healthy Living</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
