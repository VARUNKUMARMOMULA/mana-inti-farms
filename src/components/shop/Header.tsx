'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { HenIcon } from '../ui/Icons';
import Logo from '../ui/Logo';

export default function Header() {
  const pathname = usePathname();
  const { cart, settings } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add scroll event listener to change header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Track Order', href: '/track' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const contactPhone = settings?.contact_details.phone_1 || '7981544848';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-cream/90 backdrop-blur-md border-b border-cream-dark/50 shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
            <Logo size={46} showText={true} />
          </Link>


          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-body font-medium text-sm transition-colors hover:text-primary ${
                  isActive(link.href) ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Buttons (Cart, Call, Mobile Menu) */}
          <div className="flex items-center gap-4">
            
            {/* Call Button (Desktop) */}
            <a
              href={`tel:${contactPhone}`}
              className="hidden lg:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover bg-cream-dark/30 hover:bg-cream-dark/60 px-4 py-2 rounded-full border border-cream-dark transition-all"
            >
              <Phone size={16} className="text-accent" />
              <span>+91 {contactPhone}</span>
            </a>

            {/* Cart Icon */}
            <Link
              href="/order"
              className="relative p-2.5 text-primary hover:text-primary-hover bg-white hover:bg-cream-dark/20 rounded-full border border-cream-dark/50 shadow-sm transition-all hover:scale-105"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white font-body text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-cream animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-primary md:hidden rounded-full border border-cream-dark/50 bg-white hover:bg-cream-dark/20 transition-all"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-cream border-b border-cream-dark/80 shadow-xl py-6 px-4 animate-slide-up">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-body font-semibold text-lg py-2 border-b border-cream-dark/30 transition-colors ${
                  isActive(link.href) ? 'text-primary pl-2 border-l-4 border-l-accent' : 'text-foreground/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 flex flex-col gap-3">
              <a
                href={`tel:${contactPhone}`}
                className="flex items-center justify-center gap-2 bg-primary text-cream py-3 rounded-xl font-medium shadow-md hover:bg-primary-hover transition-all"
              >
                <Phone size={18} />
                Call Us: +91 {contactPhone}
              </a>
              
              <Link
                href="/order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl font-medium shadow-md hover:bg-accent-hover transition-all"
              >
                <ShoppingCart size={18} />
                View Cart ({cartItemCount})
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
