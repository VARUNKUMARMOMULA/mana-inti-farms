'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { FAQItem, faqs } from './faqData';

export default function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 font-body text-left">
      
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-accent font-semibold uppercase tracking-widest text-xs">Got Questions?</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-primary mt-2 mb-4 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-foreground/70 leading-relaxed max-w-xl mx-auto">
          Find answers to common queries about our farming practices, products, delivery, and payments.
        </p>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white border border-cream-dark/40 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              {/* Question Trigger */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-cream-dark/10 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3.5 text-primary">
                  <HelpCircle size={20} className="text-accent shrink-0 mt-0.5" />
                  <span className="font-display font-bold text-lg sm:text-xl leading-snug">
                    {faq.question}
                  </span>
                </div>
                <div className="text-primary shrink-0">
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Answer Panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-1 border-t border-cream-dark/20 text-sm text-foreground/80 leading-relaxed pl-10">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}
