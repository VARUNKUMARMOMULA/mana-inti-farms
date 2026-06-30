'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Order, OrderItem, StoreSettings, HomepageContent, SocialLink } from '../lib/types';
import { dbService } from '../lib/dbService';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextProps {
  products: Product[];
  settings: StoreSettings | null;
  homepageContent: HomepageContent | null;
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getDeliveryCharge: () => number;
  getGrandTotal: () => number;
  placeOrder: (customerDetails: {
    name: string;
    phone: string;
    address: string;
    orderType: 'delivery' | 'pickup';
    paymentMethod: 'COD' | 'UPI';
    notes: string;
  }) => Promise<{ success: boolean; order?: Order; whatsappUrl?: string; error?: string }>;
  socialLinks: SocialLink[];
  refreshData: () => Promise<void>;
  updateHomepageContent: (content: HomepageContent) => Promise<void>;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products, settings, and homepage content
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, settingsData, homepageContentData, socialLinksData] = await Promise.all([
        dbService.getProducts(),
        dbService.getSettings(),
        dbService.getHomepageContent(),
        dbService.getSocialLinks(),
      ]);
      setProducts(productsData);
      setSettings(settingsData);
      setHomepageContent(homepageContentData);
      setSocialLinks(socialLinksData);
      setError(null);
    } catch (err: any) {
      console.error('Error loading store data:', err);
      setError(err.message || 'Failed to load store data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    refreshData();
    const storedCart = localStorage.getItem('mif_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, [refreshData]);

  // Setup Supabase Realtime subscriptions for live settings and products updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!isSupabaseConfigured) return;
    
    try {
      const { supabase } = require('@/lib/supabase');
      if (!supabase) return;

      const channel = supabase
        .channel('realtime-store-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'settings',
          },
          () => {
            console.log('⚡ Realtime update: settings changed');
            refreshData();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products',
          },
          () => {
            console.log('⚡ Realtime update: products changed');
            refreshData();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'social_media_settings',
          },
          () => {
            console.log('⚡ Realtime update: social links changed');
            refreshData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.error('Failed to initialize Realtime subscription:', err);
    }
  }, [refreshData]);

  // Save cart to localStorage when it changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('mif_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product, quantity = 1) => {
    const newCart = [...cart];
    const index = newCart.findIndex((item) => item.product.id === product.id);
    
    if (index > -1) {
      newCart[index].quantity += quantity;
    } else {
      newCart.push({ product, quantity });
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.product.id !== productId);
    saveCart(newCart);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getDeliveryCharge = () => {
    if (!settings) return 0;
    const { fee, free_above } = settings.delivery_charge;
    const subtotal = getCartTotal();
    
    // If order type is pickup or cart is empty or subtotal is above free threshold
    if (subtotal === 0 || subtotal >= free_above) {
      return 0;
    }
    return fee;
  };

  const getGrandTotal = () => {
    return getCartTotal() + getDeliveryCharge();
  };

  const placeOrder = async (customerDetails: {
    name: string;
    phone: string;
    address: string;
    orderType: 'delivery' | 'pickup';
    paymentMethod: 'COD' | 'UPI';
    notes: string;
  }) => {
    try {
      if (cart.length === 0) {
        throw new Error('Your cart is empty.');
      }

      const orderItems: OrderItem[] = cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        unit: item.product.unit,
        total: item.product.price * item.quantity,
      }));

      const subtotal = getCartTotal();
      const delivery_charge = customerDetails.orderType === 'pickup' ? 0 : getDeliveryCharge();
      const total_amount = subtotal + delivery_charge;

      const orderData = {
        customer_name: customerDetails.name,
        customer_phone: customerDetails.phone,
        delivery_address: customerDetails.address,
        order_type: customerDetails.orderType,
        items: orderItems,
        total_amount,
        delivery_charge,
        payment_method: customerDetails.paymentMethod,
        notes: customerDetails.notes || null,
      };

      // 1. Store order in DB (Supabase or LocalStorage)
      const createdOrder = await dbService.createOrder(orderData);

      // 2. Generate WhatsApp formatted message
      const contactPhone = settings?.contact_details.whatsapp || '7981544848';
      const formattedPhone = contactPhone.startsWith('+') ? contactPhone : `+91${contactPhone}`;
      
      let message = `*New Order from Mana Inti Farms*\n`;
      message += `------------------------------------\n`;
      message += `*Order Number:* ${createdOrder.order_number}\n`;
      message += `*Customer Name:* ${customerDetails.name}\n`;
      message += `*Phone:* ${customerDetails.phone}\n`;
      message += `*Order Type:* ${customerDetails.orderType === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}\n`;
      if (customerDetails.orderType === 'delivery') {
        message += `*Address:* ${customerDetails.address}\n`;
      }
      message += `*Payment Method:* ${customerDetails.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI'}\n`;
      if (customerDetails.notes) {
        message += `*Notes:* ${customerDetails.notes}\n`;
      }
      message += `------------------------------------\n`;
      message += `*Items Ordered:*\n`;
      
      orderItems.forEach((item) => {
        message += `- ${item.name} (${item.quantity} x ₹${item.price}/${item.unit}) = ₹${item.total}\n`;
      });
      
      message += `------------------------------------\n`;
      message += `*Subtotal:* ₹${subtotal}\n`;
      if (customerDetails.orderType === 'delivery') {
        message += `*Delivery Charge:* ₹${delivery_charge}\n`;
      }
      message += `*Grand Total:* *₹${total_amount}*\n\n`;
      message += `Thank you for ordering fresh from Mana Inti Farms! 🌾🐔🥚`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${formattedPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;

      // 3. Clear cart
      clearCart();

      return { success: true, order: createdOrder, whatsappUrl };
    } catch (err: any) {
      console.error('Error placing order:', err.message || err);
      return { success: false, error: err.message || 'Failed to place order.' };
    }
  };

  const updateHomepageContent = async (content: HomepageContent) => {
    try {
      await dbService.updateHomepageContent(content);
      setHomepageContent(content);
    } catch (err: any) {
      console.error('Failed to update homepage content:', err);
      throw err;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        homepageContent,
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getDeliveryCharge,
        getGrandTotal,
        placeOrder,
        socialLinks,
        refreshData,
        updateHomepageContent,
      }}
    >
      <DynamicTheme />
      {children}
    </StoreContext.Provider>
  );
}

function DynamicTheme() {
  const { homepageContent } = useStore();
  if (!homepageContent || !homepageContent.colors) return null;

  const colors = homepageContent.colors;
  const typo = homepageContent.typography || { heading_font: 'Cormorant Garamond', body_font: 'Poppins', base_font_size: '16px', base_font_weight: 'normal' };
  const layout = homepageContent.layout || { border_radius: '2xl', card_style: 'glass' };

  // Format Google Fonts import
  const headingFontFamily = typo.heading_font.replace(/\s+/g, '+');
  const bodyFontFamily = typo.body_font.replace(/\s+/g, '+');
  const fontsImport = `@import url('https://fonts.googleapis.com/css2?family=${headingFontFamily}:wght@400;600;700&family=${bodyFontFamily}:wght@300;400;500;600;700&display=swap');`;

  // Calculate border radius values
  const radiusMap = {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    '3xl': '32px',
  };
  const baseRadius = radiusMap[layout.border_radius] || '24px';

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      ${fontsImport}
      :root {
        --primary: ${colors.primary} !important;
        --primary-hover: ${colors.primary_hover || colors.primary} !important;
        --secondary: ${colors.secondary} !important;
        --accent: ${colors.accent} !important;
        --background: ${colors.background} !important;
        --white: ${colors.card_bg || '#ffffff'} !important;
        --foreground: ${colors.text_color || '#2d2b28'} !important;
        --cream-dark: ${colors.border_color || '#f5ebd6'} !important;
        
        --font-display: '${typo.heading_font}', serif !important;
        --font-body: '${typo.body_font}', sans-serif !important;
        
        --border-radius-val: ${baseRadius} !important;
      }
      
      /* Dynamic theme custom overrides */
      body {
        background-color: var(--background) !important;
        color: var(--foreground) !important;
        font-family: var(--font-body) !important;
        font-size: ${typo.base_font_size || '16px'} !important;
        font-weight: ${
          typo.base_font_weight === 'light' ? '300' :
          typo.base_font_weight === 'medium' ? '500' :
          typo.base_font_weight === 'bold' ? '700' : '400'
        } !important;
      }
      
      h1, h2, h3, h4, h5, h6, .font-display {
        font-family: var(--font-display) !important;
      }
      
      /* Custom Border Radius */
      .rounded-xl {
        border-radius: calc(var(--border-radius-val) * 0.6) !important;
      }
      .rounded-2xl {
        border-radius: calc(var(--border-radius-val) * 0.8) !important;
      }
      .rounded-3xl {
        border-radius: var(--border-radius-val) !important;
      }
      
      /* Header & Footer Custom Backgrounds */
      header, .bg-cream\\/90 {
        background-color: ${colors.navbar_bg || '#ffffff'}f2 !important;
      }
      footer, .bg-primary {
        background-color: ${colors.footer_bg || colors.primary} !important;
      }
      
      /* Links and Badges */
      a {
        color: ${colors.link_color || colors.accent};
      }
      .bg-accent {
        background-color: ${colors.badge_bg || colors.accent} !important;
      }
      
      /* Card Styles Override */
      .glass-card, .bg-white {
        ${
          layout.card_style === 'shadow' ? `
            background-color: var(--white) !important;
            box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.08) !important;
            border: none !important;
          ` : layout.card_style === 'flat' ? `
            background-color: var(--white) !important;
            border: none !important;
            box-shadow: none !important;
          ` : layout.card_style === 'minimal' ? `
            background-color: var(--white) !important;
            border: 1px solid var(--cream-dark) !important;
            box-shadow: none !important;
          ` : `
            background-color: rgba(255, 255, 255, 0.7) !important;
            backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
            box-shadow: 0 8px 32px 0 rgba(92, 61, 46, 0.05) !important;
          `
        }
      }
      
      /* Primary and accent buttons */
      .bg-primary {
        background-color: var(--primary) !important;
      }
      .hover\\:bg-primary-hover:hover {
        background-color: var(--primary-hover) !important;
      }
      .text-primary {
        color: var(--primary) !important;
      }
      .border-primary {
        border-color: var(--primary) !important;
      }
      
      .bg-accent {
        background-color: var(--accent) !important;
      }
      .hover\\:bg-accent-hover:hover {
        background-color: ${colors.accent_hover || '#e6a100'} !important;
      }
      .text-accent {
        color: var(--accent) !important;
      }
      .border-accent {
        border-color: var(--accent) !important;
      }
      
      /* Utility Status Colors */
      .text-emerald-600, .text-emerald-700 {
        color: ${colors.success || '#25d366'} !important;
      }
      .text-rose-600, .text-rose-700 {
        color: ${colors.error || '#d32f2f'} !important;
      }
      .text-amber-600, .text-amber-700 {
        color: ${colors.warning || '#ffb300'} !important;
      }
    ` }} />
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
