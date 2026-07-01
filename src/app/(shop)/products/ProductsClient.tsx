'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/utils';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { HenIcon, BasketIcon, EggIcon } from '@/components/ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_HOMEPAGE_CONTENT } from '@/lib/dbService';

type CategoryFilter = 'all' | 'chicken' | 'eggs';

export default function ProductsClient() {
  const { products, cart, addToCart, updateCartQuantity, loading, error, homepageContent } = useStore();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const content = homepageContent || DEFAULT_HOMEPAGE_CONTENT;

  const filteredProducts = products.filter((product) => {
    if (activeCategory === 'all') return true;
    return product.category === activeCategory;
  });

  const getCartQuantity = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    return item ? item.quantity : 0;
  };

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: 'All Products', value: 'all' },
    { label: 'Country Chicken', value: 'chicken' },
    { label: 'Country Eggs', value: 'eggs' },
  ];

  // Dynamic Product JSON-LD Schema
  const productSchema = products.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'numberOfItems': products.length,
    'itemListElement': products.map((product, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': product.name,
        'image': product.image_url || 'https://manaintifarms.com/images/og-image.jpg',
        'description': product.description,
        'offers': {
          '@type': 'Offer',
          'price': product.price,
          'priceCurrency': 'INR',
          'availability': product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'priceValidUntil': `${new Date().getFullYear() + 1}-12-31`,
          'url': 'https://manaintifarms.com/products'
        }
      }
    }))
  } : null;

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-body">
      
      {/* Dynamic Product JSON-LD */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-accent font-semibold uppercase tracking-widest text-xs">Our Catalog</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-primary mt-2 mb-4 tracking-tight">
          Farm Fresh Products
        </h1>
        <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
          Ethically raised country chicken and farm-fresh organic eggs. We never stock frozen meat or old eggs. 100% fresh, 100% natural.
        </p>
      </div>

      {/* Category Filtering Tabs */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 mb-12 border-b border-cream-dark/30 pb-4 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
              activeCategory === category.value
                ? 'bg-primary text-cream shadow-sm'
                : 'bg-white border border-cream-dark/50 text-foreground/80 hover:bg-cream-dark/20'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-xl mx-auto my-8 shadow-sm">
          <p className="font-semibold mb-2">Error Loading Products</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Skeleton Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white h-96 rounded-2xl animate-pulse border border-cream-dark/25" />
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 max-w-md mx-auto"
            >
              <div className="bg-cream-dark/20 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-primary/40">
                <BasketIcon size={40} />
              </div>
              <h3 className="font-display font-bold text-2xl text-primary mb-2">No Products Available</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                We are temporarily out of stock or preparing new fresh batches. Please check back soon or contact us directly on WhatsApp.
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product) => {
                const quantityInCart = getCartQuantity(product.id);
                
                return (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border border-cream-dark/40 shadow-sm overflow-hidden flex flex-col group hover:shadow-[0_20px_40px_rgba(45,90,39,0.12)] hover:border-primary/35 transition-all duration-300 text-left hover:-translate-y-1"
                  >
                    {/* Image Area */}
                    <div className="h-48 bg-cream-dark/25 relative overflow-hidden flex items-center justify-center border-b border-cream-dark/25">
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {product.organic_badge && (
                          <span className="bg-primary text-cream text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                            Organic
                          </span>
                        )}
                        {product.stock_badge_text && (
                          <span className="bg-accent text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />

                      {/* Out of Stock overlay */}
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-20">
                          <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-md">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-grow gap-3">
                      <h3 className="font-display font-bold text-lg text-primary leading-snug group-hover:text-accent transition-colors flex items-center justify-between gap-2">
                        <span>{product.name}</span>
                        {product.category === 'chicken' ? (
                          <HenIcon size={18} className="text-accent shrink-0 filter drop-shadow-sm" />
                        ) : (
                          <EggIcon size={18} className="text-amber-500 shrink-0 filter drop-shadow-sm" />
                        )}
                      </h3>
                      
                      <p className="text-xs text-foreground/70 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>

                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-cream-dark/20">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-foreground/40 font-semibold uppercase tracking-wider">Price</span>
                          <span className="text-lg font-display font-bold text-primary">
                            {formatINR(product.price)}
                            <span className="text-xs font-body font-normal text-foreground/60">/{product.unit}</span>
                          </span>
                        </div>

                        {/* Cart Buttons */}
                        {product.in_stock && (
                          <div>
                            {quantityInCart > 0 ? (
                              <div className="flex items-center gap-2 bg-cream-dark/30 border border-cream-dark/80 rounded-full px-2 py-1 shadow-sm">
                                <button
                                  onClick={() => updateCartQuantity(product.id, quantityInCart - 1)}
                                  className="p-1 text-primary hover:bg-white rounded-full transition-colors"
                                  aria-label="Decrease Quantity"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-sm font-bold text-primary px-1 min-w-[16px] text-center">
                                  {quantityInCart}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(product.id, quantityInCart + 1)}
                                  className="p-1 text-primary hover:bg-white rounded-full transition-colors"
                                  aria-label="Increase Quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(product)}
                                className="bg-gradient-to-br from-primary to-primary-hover text-cream p-3 rounded-full shadow-md transition-all hover:scale-115 hover:shadow-lg cursor-pointer"
                                title="Add to Cart"
                              >
                                <ShoppingCart size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}

    </div>
  );
}
