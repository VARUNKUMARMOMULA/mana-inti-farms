'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Users, Sparkles } from 'lucide-react';
import { HenIcon, BasketIcon, LeafIcon } from '@/components/ui/Icons';
import { useStore } from '@/context/StoreContext';
import { DEFAULT_HOMEPAGE_CONTENT } from '@/lib/dbService';

export default function AboutPage() {
  const { homepageContent } = useStore();
  const content = homepageContent || DEFAULT_HOMEPAGE_CONTENT;

  const coreValues = [
    {
      title: 'Ethical & Humane',
      description: 'Our birds are never caged. They are raised in wide pastures, ensuring natural behavior, play, and zero stress.',
      icon: <Heart className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Chemical & Hormone Free',
      description: 'No antibiotics, no growth hormones, no artificial colorings in yolk. Just 100% natural, clean food.',
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Traditional Roots',
      description: 'Inspired by traditional Indian farming practices, blending rural wisdom with modern hygiene standards.',
      icon: <Users className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="py-12 sm:py-16 flex flex-col gap-16 md:gap-24 font-body">
      
      {/* 1. Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-accent font-semibold uppercase tracking-widest text-xs">Our Story</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-primary mt-2 mb-6 tracking-tight">
          Welcome to Mana Inti Farms
        </h1>
        <p className="text-base sm:text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
          Mana Inti Farms (meaning "Our Home Farms" in Telugu) was founded with a simple, powerful mission: to bring authentic, farm-fresh, chemical-free country eggs and country chicken from our pastures directly to your family's dining table.
        </p>
      </section>

      {/* 2. Brand Narrative (Grid) */}
      <section className="bg-white border-y border-cream-dark/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Visual Side */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-cream-dark/40 shadow-md">
              <Image
                src={content.about_image || "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80"}
                alt="Mana Inti Farms - Free Range Country Chickens"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 420px"
              />
              
              {/* Floating badges */}
              <div className="absolute top-4 left-4 bg-primary text-cream px-4 py-2 rounded-2xl shadow-md flex items-center gap-2 text-xs font-semibold uppercase tracking-wider z-10">
                <Sparkles size={14} className="text-accent" />
                <span>100% Natural</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-accent text-white px-4 py-2 rounded-2xl shadow-md flex items-center gap-2 text-xs font-semibold uppercase tracking-wider z-10">
                <span>Free Range</span>
              </div>
            </div>
          </div>

          {/* Narrative Text Side */}
          <div className="flex flex-col items-start text-left gap-6">
            <h2 className="font-display font-bold text-3xl text-primary tracking-tight">
              Reviving the Authentic Village Taste
            </h2>
            <p className="text-sm sm:text-base text-foreground/85 leading-relaxed">
              Modern commercial farming has compromised both taste and nutrition. Poultry is often confined to tiny cages and pumped with growth hormones and antibiotics to maximize yields. 
            </p>
            <p className="text-sm sm:text-base text-foreground/85 leading-relaxed">
              At **Mana Inti Farms** in Bowrampet, Hyderabad, we do things differently. Our country chickens are raised under the open sky, feeding on natural grass, herbs, worms, wheat, and maize. 
            </p>
            <p className="text-sm sm:text-base text-foreground/85 leading-relaxed">
              This natural lifestyle results in chicken that is lean, flavorful, and incredibly tender, and eggs that are packed with proteins, healthy fats, and rich, deep yellow-orange yolks.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Our Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-bold text-3xl text-primary mb-4 tracking-tight">
            Our Core Pillars
          </h2>
          <p className="text-sm sm:text-base text-foreground/70">
            Every practice at our farm is guided by our commitment to health, transparency, and nature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-cream-dark/40 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-all"
            >
              <div className="p-3 bg-cream-dark/20 rounded-full text-primary">
                {value.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-primary">
                {value.title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Farmers Commitment */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="bg-[#1e3f20]/5 rounded-3xl p-8 sm:p-12 border border-primary/10 flex flex-col items-center gap-6">
          <LeafIcon size={40} className="text-primary" />
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-primary tracking-tight">
            Our Freshness Guarantee
          </h2>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed italic max-w-2xl">
            "We collect our country eggs fresh every single morning. We do not store chicken in freezers. When you place an order, our poultry is freshly dressed in highly hygienic conditions and delivered directly to your doorstep on the same day. That is our promise of pure quality."
          </p>
          <div className="flex flex-col items-center mt-2">
            <span className="font-display font-bold text-lg text-primary">The Mana Inti Farms Family</span>
            <span className="text-xs uppercase tracking-widest text-secondary font-semibold">Bowrampet, Hyderabad</span>
          </div>
        </div>
      </section>

    </div>
  );
}
