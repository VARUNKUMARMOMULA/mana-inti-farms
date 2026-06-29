'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What is the difference between country chicken and normal broiler chicken?',
      answer: 'Broiler chickens are raised in cages with limited movement and fed commercial feed, often with antibiotics and hormones. Country chickens (Natukodi) are raised in free-range environments, allowing them to run, graze, and feed on grains, greens, and insects. This makes their meat lean, rich in taste, and completely chemical-free.',
    },
    {
      question: 'Are your eggs and chicken 100% antibiotic-free?',
      answer: 'Yes. We do not use any antibiotics, growth promoters, or hormones in our farm. Our birds build immunity naturally by roaming in pastures and eating organic, nutritious feed.',
    },
    {
      question: 'Why are country egg yolks deep yellow/orange?',
      answer: 'The color of the yolk is determined by the diet of the hen. Our free-range hens feed on fresh grass, alfalfa, wheat, and corn, which are rich in natural carotenoids. This gives the yolks a deep yellow-orange color and makes them richer in vitamins and omega-3 fatty acids compared to pale industrial yolks.',
    },
    {
      question: 'How do you handle chicken dressing and hygiene?',
      answer: 'We maintain absolute hygiene. Chicken is dressed only after receiving your order. We clean and dress the bird under strict sanitary conditions, wrap it in food-grade packaging, and deliver it fresh on the same day. We never sell frozen or stored meat.',
    },
    {
      question: 'Which areas in Hyderabad do you deliver to?',
      answer: 'We deliver across Hyderabad, including Bowrampet, Miyapur, Kukatpally, Gachibowli, Madhapur, Kondapur, Jubilee Hills, and surrounding regions. Deliveries are made same-day or next-day depending on your order slot.',
    },
    {
      question: 'How much are the delivery charges?',
      answer: 'Our standard delivery fee is ₹50. However, we offer FREE delivery for all orders above ₹1,000.',
    },
    {
      question: 'How do I pay for my order?',
      answer: 'We support Cash on Delivery (COD) and UPI. When you place an order, you can choose either option. If you choose UPI, you can pay via Google Pay, PhonePe, or Paytm once the delivery partner arrives.',
    },
  ];

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
