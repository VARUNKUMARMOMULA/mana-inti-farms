'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/utils';
import { ShoppingCart, Phone, ArrowRight, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { HenIcon, BasketIcon, LeafIcon, WheatIcon, FarmIcon, EggIcon } from '@/components/ui/Icons';
import { DEFAULT_HOMEPAGE_CONTENT } from '@/lib/dbService';

export default function HomePage() {
  const { products, settings, addToCart, homepageContent } = useStore();
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const content = homepageContent || DEFAULT_HOMEPAGE_CONTENT;

  // Filter featured products for homepage (e.g. first 3 products)
  const featuredProducts = products.slice(0, 3);

  useEffect(() => {
    if (products.length > 0) {
      setLoadingProducts(false);
    }
  }, [products]);

  const whyChooseUs = [
    {
      title: 'Free Range Farm',
      description: 'Our country chickens roam freely in open pastures, enjoying natural sunlight and clean air.',
      icon: <FarmIcon className="h-8 w-8 text-primary" />,
    },
    {
      title: '100% Organic Feed',
      description: 'Fed with natural grains, wheat, and greens. Absolutely zero artificial feed or chemicals.',
      icon: <WheatIcon className="h-8 w-8 text-primary" />,
    },
    {
      title: 'No Antibiotics',
      description: 'We believe in natural health. Our livestock is 100% antibiotic and hormone-free.',
      icon: <LeafIcon className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Daily Fresh Harvest',
      description: 'Eggs are collected fresh every morning and chicken is dressed only after your order.',
      icon: <BasketIcon className="h-8 w-8 text-primary" />,
    },
  ];

  const reviews = [
    {
      name: 'Ramesh Kumar',
      location: 'Kukatpally, Hyderabad',
      rating: 5,
      comment: 'The country chicken was incredibly fresh and tasted exactly like the village chicken I used to eat in my childhood. Dressed very clean. Highly recommended!',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sravani Reddy',
      location: 'Gachibowli, Hyderabad',
      rating: 5,
      comment: 'We have been buying eggs for our kids here. The yolks are deep orange, which is a sign of true free-range eggs. Delivery is always prompt.',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Anil Yadav',
      location: 'Miyapur, Hyderabad',
      rating: 5,
      comment: 'Amazing quality! The chicken is tender, juicy, and antibiotic-free. The customer service via WhatsApp is very responsive. Keep up the good work.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
  ];

  const handleNextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Auto-play reviews
  useEffect(() => {
    const interval = setInterval(handleNextReview, 6000);
    return () => clearInterval(interval);
  }, []);

  const storeStatus = settings?.store_status || { status: 'open', message: 'Accepting Orders' };
  const contactPhone = settings?.contact_details.phone_1 || '7981544848';

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16 relative">
      
      {/* Top Promotional Banner */}
      {content.promo_banner_active && (
        <div className="w-full bg-gradient-to-r from-primary via-primary-hover to-accent text-cream text-center py-2.5 px-4 text-xs sm:text-sm font-bold relative z-30 shadow-md flex items-center justify-center gap-2 animate-fade-in">
          <span>🎉</span>
          <span>{content.promo_banner_text}</span>
        </div>
      )}
      
      {/* 1. HERO SECTION */}
      {content.sections?.hero !== false && (
        <section className="relative min-h-[85vh] flex items-center justify-center pt-6 overflow-hidden">
        {/* Background Farm Image with soft overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={content.hero_bg_image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80"}
            alt="Mana Inti Farms - Organic Pasture"
            fill
            className="object-cover opacity-15"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ffe0b2]/40 via-[#fdfbf7]/90 to-[#c8e6c9]/30" />
        </div>
        
        {/* Floating Farm-themed SVGs */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-12 left-[10%] text-primary/10 hidden md:block"
        >
          <LeafIcon size={40} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-16 left-[5%] text-accent/15 hidden md:block"
        >
          <WheatIcon size={48} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
          className="absolute top-24 right-[8%] text-primary/10 hidden md:block"
        >
          <LeafIcon size={36} />
        </motion.div>

        {/* Background Decorative Circles */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse z-0" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl z-0" />
        <div className="absolute top-10 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            
            {/* Dynamic Store Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-cream-dark shadow-sm text-xs font-semibold"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${
                storeStatus.status === 'open' ? 'bg-[#25D366] animate-pulse' : 'bg-red-500'
              }`} />
              <span className="text-secondary uppercase tracking-wider">{storeStatus.message}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight tracking-tight"
            >
              {content.hero_title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-foreground/80 font-body leading-relaxed max-w-2xl"
            >
              {content.hero_subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto mt-2"
            >
              <Link
                href={content.hero_button_url || "/products"}
                className="w-full sm:w-auto bg-primary text-cream px-8 py-3.5 rounded-full font-semibold shadow-md hover:bg-primary-hover transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{content.hero_button_text || "Order Now"}</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="/about"
                className="w-full sm:w-auto bg-white text-primary border border-cream-dark px-8 py-3.5 rounded-full font-semibold shadow-sm hover:bg-cream-dark/20 transition-all flex items-center justify-center cursor-pointer"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-cream-dark/40 w-full mt-4"
            >
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-display font-bold text-primary">100%</span>
                <span className="text-xs text-foreground/60 uppercase font-semibold font-body tracking-wider">Natural & Organic</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-display font-bold text-primary">0%</span>
                <span className="text-xs text-foreground/60 uppercase font-semibold font-body tracking-wider">Antibiotics Used</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-display font-bold text-primary">Daily</span>
                <span className="text-xs text-foreground/60 uppercase font-semibold font-body tracking-wider">Fresh Harvest</span>
              </div>
            </motion.div>

          </div>

          {/* Hero Premium Circular Image Visuals */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center min-h-[380px] lg:min-h-[460px]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-3xl z-0" />

            {/* Large Premium Circular Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden border-8 border-white hover:border-primary/25 shadow-2xl transition-all duration-500 hover:scale-[1.02] group z-10"
            >
              <Image
                src={content.hero_circular_image || "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1000&auto=format&fit=crop&q=80"}
                alt={content.image_alts?.hero_circular_image || "Mana Inti Farms Country Chicken & Eggs"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 420px"
                priority
              />

              {/* Dynamic Overlay Text inside Circle */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <span className="text-white text-xs font-bold font-body tracking-wider uppercase bg-primary/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  100% Farm Fresh
                </span>
              </div>
            </motion.div>

            {/* Floating Seasonal Offer Badge */}
            {content.seasonal_offer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-30"
              >
                <div className="bg-accent text-white font-body font-bold text-xs px-4 py-3 rounded-2xl shadow-lg border border-white flex flex-col items-center justify-center animate-bounce gap-0.5">
                  <span className="uppercase tracking-widest text-[9px] opacity-75">Offer</span>
                  <span className="leading-none text-center">{content.seasonal_offer}</span>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </section>
      )}

      {/* 2. WHY CHOOSE US */}
      {content.sections?.why_choose_us !== false && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-primary mb-4 tracking-tight">
            Why Choose Mana Inti Farms?
          </h2>
          <p className="font-body text-base text-foreground/70">
            We are dedicated to reviving traditional Indian farming values. Our products are direct-from-farm, guaranteeing the highest quality and freshness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border-2 border-[#e1ebd5]/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-start text-left gap-4 group hover:border-primary/20"
            >
              <div className="p-3 bg-gradient-to-br from-[#c8e6c9]/40 to-[#e8f5e9]/10 rounded-xl group-hover:from-primary/10 group-hover:to-primary/5 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-display font-semibold text-xl text-primary flex items-center gap-2">
                {item.title}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">🌿</span>
              </h3>
              <p className="font-body text-sm text-foreground/70 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      )}

      {/* 3. FEATURED PRODUCTS */}
      {content.sections?.products !== false && (
      <section className="bg-gradient-to-b from-[#f5ebd6]/20 via-[#ffe0b2]/5 to-[#fdfbf7] py-16 md:py-20 border-y border-cream-dark/35">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <span className="text-accent font-bold uppercase tracking-widest text-xs font-body flex items-center gap-1.5">
                <span>⭐</span> Our Bestsellers
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-primary mt-1 tracking-tight">
                Fresh From Our Pastures
              </h2>
            </div>
            <Link
              href="/products"
              className="font-body font-bold text-sm text-primary hover:text-primary-hover flex items-center gap-1 group whitespace-nowrap bg-white border border-cream-dark/60 px-5 py-2.5 rounded-full shadow-sm hover:bg-cream-dark/20 transition-all"
            >
              <span>View All Products</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white h-96 rounded-2xl animate-pulse border border-cream-dark/25" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-cream-dark/40 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all"
                >
                  {/* Product Image */}
                  <div className="h-56 bg-cream-dark/35 relative overflow-hidden p-6 border-b border-cream-dark/25 flex items-center justify-center">
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {product.organic_badge && (
                        <span className="bg-primary text-cream text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                          Organic
                        </span>
                      )}
                      {product.stock_badge_text && (
                        <span className="bg-accent text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                          {product.stock_badge_text}
                        </span>
                      )}
                    </div>
                    
                    <Image
                      src={
                        product.image_url ||
                        (product.category === 'chicken'
                          ? (content.hero_chicken_image || "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80")
                          : (content.hero_egg_image || "https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80"))
                      }
                      alt={product.seo_alt_text || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-6 flex flex-col flex-grow text-left gap-3 border-t border-cream-dark/15">
                    <h3 className="font-display font-bold text-xl text-primary leading-snug group-hover:text-accent transition-colors flex items-center justify-between gap-2">
                      <span>{product.name}</span>
                      {product.category === 'chicken' ? (
                        <HenIcon size={20} className="text-accent shrink-0 filter drop-shadow-sm animate-pulse" />
                      ) : (
                        <EggIcon size={20} className="text-amber-500 shrink-0 filter drop-shadow-sm" />
                      )}
                    </h3>
                    <p className="font-body text-xs text-foreground/70 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-cream-dark/15">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Price</span>
                        <span className="text-2xl font-display font-bold text-primary">
                          {formatINR(product.price)}
                          <span className="text-xs font-body font-normal text-foreground/60">/{product.unit}</span>
                        </span>
                      </div>
                      
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.in_stock}
                        className={`p-3 rounded-full shadow-md transition-all hover:scale-115 ${
                          product.in_stock
                            ? 'bg-gradient-to-br from-primary to-primary-hover text-cream hover:shadow-lg cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        title={product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* 4. CUSTOMER REVIEWS (SLIDER) */}
      {content.sections?.reviews !== false && (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="mb-10">
          <span className="text-accent font-semibold uppercase tracking-widest text-xs font-body">Testimonials</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-primary mt-1 tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        <div className="relative bg-white border border-cream-dark/40 rounded-3xl p-8 sm:p-12 shadow-md overflow-hidden">
          <div className="absolute top-6 left-6 text-cream-dark/40 text-7xl font-serif select-none pointer-events-none">“</div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReviewIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-[#e6a100]">
                {[...Array(reviews[activeReviewIndex].rating)].map((_, i) => (
                  <Star key={i} size={20} fill="#e6a100" />
                ))}
              </div>

              {/* Review Comment */}
              <p className="font-body text-base sm:text-lg text-foreground/80 italic leading-relaxed max-w-2xl">
                "{reviews[activeReviewIndex].comment}"
              </p>

              {/* Customer Avatar */}
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-md mb-2">
                <Image
                  src={reviews[activeReviewIndex].avatar_url}
                  alt={reviews[activeReviewIndex].name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              {/* Reviewer Details */}
              <div className="flex flex-col items-center">
                <span className="font-display font-bold text-lg text-primary">
                  {reviews[activeReviewIndex].name}
                </span>
                <span className="font-body text-xs text-foreground/50">
                  {reviews[activeReviewIndex].location}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevReview}
              className="p-2 bg-cream hover:bg-cream-dark/40 text-primary rounded-full border border-cream-dark/50 transition-colors"
              aria-label="Previous Review"
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReviewIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeReviewIndex ? 'w-6 bg-primary' : 'w-2 bg-cream-dark'
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextReview}
              className="p-2 bg-cream hover:bg-cream-dark/40 text-primary rounded-full border border-cream-dark/50 transition-colors"
              aria-label="Next Review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
      )}

      {/* 5. CALL TO ACTION */}
      {content.sections?.about !== false && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-primary rounded-3xl p-8 sm:p-16 text-cream relative overflow-hidden shadow-xl border border-primary-hover">
          {/* Background Farm Image for CTA */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&auto=format&fit=crop&q=80"
              alt="Free range country chickens"
              fill
              className="object-cover opacity-15"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-primary/95" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
            <div className="max-w-2xl">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-cream mb-4 tracking-tight leading-tight">
                {content.hero_cta_text || "Want to taste authentic, healthy country produce?"}
              </h2>
              <p className="font-body text-cream-dark/80 text-sm sm:text-base leading-relaxed">
                Our farm order cycles are harvested fresh daily. Place your order now or get in touch with us via WhatsApp to clear any queries. We deliver across Hyderabad.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0">
              <Link
                href="/products"
                className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-semibold text-center shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Order Online</span>
                <ShoppingCart size={18} />
              </Link>
              
              <a
                href={`https://wa.me/91${contactPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-cream border border-cream/30 px-8 py-4 rounded-full font-semibold text-center transition-all flex items-center justify-center gap-2"
              >
                <span>Chat on WhatsApp</span>
                <Phone size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
      )}

    </div>
  );
}
