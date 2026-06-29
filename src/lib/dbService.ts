import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Order, StoreSettings, DashboardStats, Review, HomepageContent, ContactMessage, MediaAsset, SocialLink } from './types';
import { generateOrderNumber } from './utils';

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  // Hero
  hero_title: 'Farm Fresh Country Eggs & Country Chicken',
  hero_subtitle: 'Order authentic free-range country eggs and country chicken from our pasture directly to your home. Chemical-free, nutrient-rich, and raised with care at Bowrampet, Hyderabad.',
  hero_bg_image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80',
  hero_circular_image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1000&auto=format&fit=crop&q=80',
  hero_chicken_image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80',
  hero_egg_image: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
  hero_button_text: 'Order Now',
  hero_button_url: '/products',
  hero_cta_text: 'Want to taste authentic, healthy country produce?',

  // About
  about_title: 'Welcome to Mana Inti Farms',
  about_subtitle: 'Our Story',
  about_content: 'Mana Inti Farms (meaning "Our Home Farms" in Telugu) was founded with a simple, powerful mission: to bring authentic, farm-fresh, chemical-free country eggs and country chicken from our pastures directly to your family\'s dining table.',
  about_image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80',
  why_choose_us_image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
  testimonial_bg_image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
  
  // Contact Section
  contact_image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
  delivery_image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80',

  // Error Pages
  error_404_image: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
  maintenance_image: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
  offline_image: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
  empty_state_image: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',

  // Promo & Banner
  promo_banner_image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&auto=format&fit=crop&q=80',
  promo_banner_text: 'Free delivery on orders above ₹1000 in Hyderabad! 🚚',
  promo_banner_active: true,
  seasonal_offer: 'Free Delivery',

  // Branding
  logo_url: '/logo.png',
  navbar_logo_url: '/logo.png',
  mobile_logo_url: '/logo.png',
  navbar_icon_url: '/logo.png',
  footer_logo_url: '/logo.png',
  favicon_url: '/favicon.ico',
  website_name: 'Mana Inti Farms',
  tagline: 'Organic & Free Range',

  // Colors
  colors: {
    primary: '#1e3f20',
    primary_hover: '#2d5a27',
    secondary: '#5c3d2e',
    accent: '#ff6f00',
    background: '#fdfbf7',
    card_bg: '#ffffff',
    text_color: '#2d2b28',
    border_color: '#f5ebd6',
    button_bg: '#1e3f20',
    button_text: '#fdfbf7',
    accent_hover: '#e6a100',
    success: '#25d366',
    warning: '#ffb300',
    error: '#d32f2f',
    navbar_bg: '#ffffff',
    footer_bg: '#1e3f20',
    badge_bg: '#ff6f00',
    link_color: '#ff6f00',
  },

  // Typography
  typography: {
    heading_font: 'Cormorant Garamond',
    body_font: 'Poppins',
    base_font_size: '16px',
    base_font_weight: 'normal',
  },

  // Layout Settings
  layout: {
    border_radius: '2xl',
    card_style: 'glass',
    hero_bg_style: 'radial',
    section_bg_style: 'plain',
  },

  // Sections
  sections: {
    hero: true,
    about: true,
    products: true,
    why_choose_us: true,
    reviews: true,
    gallery: true,
    faq: true,
    contact: true,
    footer: true,
    promo_banner: true,
    delivery_info: true,
  },

  // SEO
  seo: {
    meta_title: 'Mana Inti Farms | Farm Fresh Eggs & Country Chicken',
    meta_description: 'Order authentic Indian country chicken and farm fresh brown eggs in Hyderabad. Free-range, chemical-free, and antibiotic-free.',
  },

  // FAQs
  faqs: [
    { question: 'Are your chickens truly free-range?', answer: 'Yes, our chickens roam freely in open green pastures at our Bowrampet farm. They feed on natural grass, worms, and organic grains.' },
    { question: 'Do you use antibiotics or hormones?', answer: 'No, we believe in 100% natural growth. None of our birds are injected with hormones or fed with antibiotics.' },
    { question: 'How do you deliver?', answer: 'We harvest and dress fresh daily. Deliveries are made across Hyderabad same-day or next-day in temperature-controlled bags.' }
  ],

  // Gallery
  gallery: [
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80'
  ]
};

// --- SEED DATA FOR MOCK MODE ---
const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Premium Country Chicken (Pre-dressed)',
    description: 'Raised ethically in our free-range farm, 100% organic feed, antibiotic-free, hormone-free. Freshly dressed and packed under hygienic conditions.',
    price: 559,
    unit: 'kg',
    image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80',
    category: 'chicken',
    is_active: true,
    in_stock: true,
    organic_badge: true,
    stock_badge_text: 'Fresh Daily',
    display_order: 1,
  },
  {
    id: 'p2',
    name: 'Fresh Loose Country Eggs',
    description: 'Fresh country eggs collected daily from free-range country hens. Rich in nutrients, deep yellow-orange yolk.',
    price: 15,
    unit: 'Egg',
    image_url: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
    category: 'eggs',
    is_active: true,
    in_stock: true,
    organic_badge: true,
    stock_badge_text: 'Daily Harvest',
    display_order: 2,
  },
  {
    id: 'p3',
    name: 'Country Eggs (6 Pack)',
    description: 'Hand-picked country eggs, safely packed in a biodegradable pulp carton. Perfect for small families.',
    price: 95,
    unit: '6 Eggs',
    image_url: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
    category: 'eggs',
    is_active: true,
    in_stock: true,
    organic_badge: true,
    stock_badge_text: 'Popular',
    display_order: 3,
  },
  {
    id: 'p4',
    name: 'Country Eggs (12 Pack)',
    description: 'Hygienically packed premium country eggs. Fresh, clean, and nutrient-dense.',
    price: 185,
    unit: '12 Eggs',
    image_url: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
    category: 'eggs',
    is_active: true,
    in_stock: true,
    organic_badge: true,
    stock_badge_text: 'Best Seller',
    display_order: 4,
  },
  {
    id: 'p5',
    name: 'Country Eggs (15 Pack)',
    description: 'Economical pack of 15 premium farm-fresh country eggs.',
    price: 230,
    unit: '15 Eggs',
    image_url: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
    category: 'eggs',
    is_active: true,
    in_stock: true,
    organic_badge: true,
    stock_badge_text: 'Fresh',
    display_order: 5,
  },
  {
    id: 'p6',
    name: 'Country Eggs (20 Pack)',
    description: 'Family-sized pack of 20 premium country eggs, rich in natural proteins.',
    price: 310,
    unit: '20 Eggs',
    image_url: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
    category: 'eggs',
    is_active: true,
    in_stock: true,
    organic_badge: true,
    stock_badge_text: 'Fresh',
    display_order: 6,
  },
  {
    id: 'p7',
    name: 'Country Eggs (30 Pack)',
    description: 'Value pack of 30 premium country eggs. Collected fresh daily from our farm.',
    price: 450,
    unit: '30 Eggs',
    image_url: 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80',
    category: 'eggs',
    is_active: true,
    in_stock: true,
    organic_badge: true,
    stock_badge_text: 'Best Value',
    display_order: 7,
  },
];

const DEFAULT_SETTINGS: StoreSettings = {
  store_status: { status: 'open', message: 'Accepting Orders' },
  delivery_charge: { fee: 50, free_above: 1000 },
  contact_details: {
    phone_1: '7981544848',
    phone_2: '7995986012',
    email: 'sampyadav12@gmail.com',
    address: 'Bowrampet, Hyderabad, Telangana',
    whatsapp: '7981544848',
  },
  business_hours: {
    timings: '6:00 AM - 9:00 PM',
    days: 'Monday - Sunday',
  },
  social_links: {
    facebook: '#',
    instagram: '#',
    youtube: '#',
  },
  seo_settings: {
    title: 'Mana Inti Farms | Fresh Country Eggs & Chicken Hyderabad',
    description: 'Experience the unmatched taste of premium country eggs and pre-dressed country chicken. Raised ethically in our free-range farm, completely antibiotic-free.',
  },
};

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Ramesh Kumar',
    location: 'Kukatpally, Hyderabad',
    rating: 5,
    comment: 'The country chicken was incredibly fresh and tasted exactly like the village chicken I used to eat in my childhood. Dressed very clean. Highly recommended!',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    date: '2026-06-25',
  },
  {
    id: 'r2',
    name: 'Sravani Reddy',
    location: 'Gachibowli, Hyderabad',
    rating: 5,
    comment: 'We have been buying eggs for our kids here. The yolks are deep orange, which is a sign of true free-range eggs. Delivery is always prompt.',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    date: '2026-06-28',
  },
  {
    id: 'r3',
    name: 'Anil Yadav',
    location: 'Miyapur, Hyderabad',
    rating: 5,
    comment: 'Amazing quality! The chicken is tender, juicy, and antibiotic-free. The customer service via WhatsApp is very responsive. Keep up the good work.',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    date: '2026-06-20',
  },
];

// --- LOCAL STORAGE HELPER ---
const isClient = typeof window !== 'undefined';

function getLocalData<T>(key: string, fallback: T): T {
  if (!isClient) return fallback;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

function setLocalData<T>(key: string, data: T): void {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Initialize mock database in localStorage
if (isClient && !isSupabaseConfigured) {
  const dbVersion = localStorage.getItem('mif_db_version');
  const CURRENT_VERSION = '3';

  if (dbVersion !== CURRENT_VERSION) {
    // Clear old product and content cache to force-load the new Unsplash images and dynamic content
    localStorage.removeItem('mif_products');
    localStorage.removeItem('mif_homepage_content');
    localStorage.setItem('mif_db_version', CURRENT_VERSION);
  }

  const existingProducts = localStorage.getItem('mif_products');
  if (!existingProducts) {
    localStorage.setItem('mif_products', JSON.stringify(SEED_PRODUCTS));
  }

  if (!localStorage.getItem('mif_homepage_content')) {
    localStorage.setItem('mif_homepage_content', JSON.stringify(DEFAULT_HOMEPAGE_CONTENT));
  }

  const existingAssets = localStorage.getItem('mif_media_assets');
  if (!existingAssets) {
    const defaultAssets: MediaAsset[] = [
      { id: 'ma_1', name: 'Main Website Logo', url: '/logo.png', category: 'branding', alt_text: 'Mana Inti Farms Logo', created_at: new Date().toISOString() },
      { id: 'ma_2', name: 'Hero Circular Image', url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1000&auto=format&fit=crop&q=80', category: 'homepage', alt_text: 'Fresh Country Produce', created_at: new Date().toISOString() },
      { id: 'ma_3', name: 'Hero Background Pasture', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80', category: 'homepage', alt_text: 'Bowrampet Farm Pastures', created_at: new Date().toISOString() },
      { id: 'ma_4', name: 'About Section Image', url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80', category: 'sections', alt_text: 'About Mana Inti Farms', created_at: new Date().toISOString() },
    ];
    localStorage.setItem('mif_media_assets', JSON.stringify(defaultAssets));
  }

  const existingSocial = localStorage.getItem('mif_social_links');
  if (!existingSocial) {
    const defaultSocial: SocialLink[] = [
      { id: 'sl_1', platform: 'Facebook', url: 'https://facebook.com/manaintifarms', enabled: true, icon_name: 'facebook' },
      { id: 'sl_2', platform: 'Instagram', url: 'https://instagram.com/manaintifarms', enabled: true, icon_name: 'instagram' },
      { id: 'sl_3', platform: 'YouTube', url: 'https://youtube.com/@manaintifarms', enabled: true, icon_name: 'youtube' },
      { id: 'sl_4', platform: 'WhatsApp', url: 'https://wa.me/917981544848', enabled: true, icon_name: 'whatsapp' },
      { id: 'sl_5', platform: 'X (Twitter)', url: '', enabled: false, icon_name: 'twitter' },
      { id: 'sl_6', platform: 'LinkedIn', url: '', enabled: false, icon_name: 'linkedin' },
      { id: 'sl_7', platform: 'Telegram', url: '', enabled: false, icon_name: 'telegram' },
    ];
    localStorage.setItem('mif_social_links', JSON.stringify(defaultSocial));
  }

  if (!localStorage.getItem('mif_settings')) {
    localStorage.setItem('mif_settings', JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem('mif_orders')) {
    localStorage.setItem('mif_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('mif_admin_session')) {
    localStorage.setItem('mif_admin_session', 'false');
  }
}

export const dbService = {
  isMockMode: !isSupabaseConfigured,

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    } else {
      const products = getLocalData<Product[]>('mif_products', SEED_PRODUCTS);
      return products.filter((p) => p.is_active).sort((a, b) => a.display_order - b.display_order);
    }
  },

  async getAllProductsAdmin(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    } else {
      return getLocalData<Product[]>('mif_products', SEED_PRODUCTS).sort((a, b) => a.display_order - b.display_order);
    }
  },

  async updateProduct(product: Product): Promise<Product> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          unit: product.unit,
          image_url: product.image_url,
          category: product.category,
          is_active: product.is_active,
          in_stock: product.in_stock,
          organic_badge: product.organic_badge,
          stock_badge_text: product.stock_badge_text,
          display_order: product.display_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const products = getLocalData<Product[]>('mif_products', SEED_PRODUCTS);
      const index = products.findIndex((p) => p.id === product.id);
      if (index === -1) throw new Error('Product not found');
      products[index] = { ...product, updated_at: new Date().toISOString() };
      setLocalData('mif_products', products);
      return product;
    }
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const products = getLocalData<Product[]>('mif_products', SEED_PRODUCTS);
      const newProduct: Product = {
        ...product,
        id: 'p_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      products.push(newProduct);
      setLocalData('mif_products', products);
      return newProduct;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    } else {
      const products = getLocalData<Product[]>('mif_products', SEED_PRODUCTS);
      const filtered = products.filter((p) => p.id !== id);
      setLocalData('mif_products', filtered);
    }
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } else {
      return getLocalData<Order[]>('mif_orders', []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  },

  async trackOrder(orderNumber: string, phone: string): Promise<Order | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim().toUpperCase())
        .eq('customer_phone', phone.trim())
        .maybeSingle();
      if (error) throw error;
      return data;
    } else {
      const orders = getLocalData<Order[]>('mif_orders', []);
      const found = orders.find(
        (o) => 
          o.order_number.toLowerCase() === orderNumber.trim().toLowerCase() && 
          o.customer_phone.trim() === phone.trim()
      );
      return found || null;
    }
  },

  async createOrder(orderInput: Omit<Order, 'id' | 'order_number' | 'created_at' | 'status'>): Promise<Order> {
    const order_number = generateOrderNumber();
    const created_at = new Date().toISOString();
    const newOrder: Order = {
      ...orderInput,
      id: isSupabaseConfigured ? undefined as any : 'o_' + Math.random().toString(36).substr(2, 9),
      order_number,
      status: 'placed',
      created_at,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const orders = getLocalData<Order[]>('mif_orders', []);
      orders.push(newOrder);
      setLocalData('mif_orders', orders);
      return newOrder;
    }
  },

  async updateOrderStatus(
    id: string, 
    status: Order['status'], 
    estimatedDelivery?: string | null, 
    adminNotes?: string | null
  ): Promise<Order> {
    if (isSupabaseConfigured && supabase) {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (estimatedDelivery !== undefined) updates.estimated_delivery = estimatedDelivery;
      if (adminNotes !== undefined) updates.admin_notes = adminNotes;

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const orders = getLocalData<Order[]>('mif_orders', []);
      const index = orders.findIndex((o) => o.id === id);
      if (index === -1) throw new Error('Order not found');
      orders[index].status = status;
      if (estimatedDelivery !== undefined) orders[index].estimated_delivery = estimatedDelivery;
      if (adminNotes !== undefined) orders[index].admin_notes = adminNotes;
      orders[index].updated_at = new Date().toISOString();
      setLocalData('mif_orders', orders);
      return orders[index];
    }
  },

  // --- SETTINGS ---
  async getSettings(): Promise<StoreSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      
      const settings = { ...DEFAULT_SETTINGS };
      if (data) {
        data.forEach((item: any) => {
          if (item.key in settings) {
            (settings as any)[item.key] = item.value;
          }
        });
      }
      return settings;
    } else {
      return getLocalData<StoreSettings>('mif_settings', DEFAULT_SETTINGS);
    }
  },

  async updateSetting(key: keyof StoreSettings, value: any): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) throw error;
    } else {
      const settings = getLocalData<StoreSettings>('mif_settings', DEFAULT_SETTINGS);
      (settings as any)[key] = value;
      setLocalData('mif_settings', settings);
    }
  },

  // --- ANALYTICS ---
  async getDashboardStats(): Promise<DashboardStats> {
    const orders = await this.getOrders();
    const completedOrders = orders.filter((o) => o.status === 'delivered');
    const pendingOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
    
    const revenue = completedOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const orderCount = orders.length;
    const avgOrderValue = completedOrders.length > 0 ? revenue / completedOrders.length : 0;
    
    return {
      orderCount,
      revenue,
      avgOrderValue,
      pendingOrders: pendingOrders.length,
    };
  },

  // --- REVIEWS ---
  async getReviews(): Promise<Review[]> {
    // Standard reviews are loaded statically but can be customized
    return MOCK_REVIEWS;
  },

  // --- AUTHENTICATION (ADMIN) ---
  async signInAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      // Mock credentials: admin@manaintifarms.com / admin123
      if (email === 'admin@manaintifarms.com' && password === 'admin123') {
        setLocalData('mif_admin_session', 'true');
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password. Use admin@manaintifarms.com / admin123' };
    }
  },

  async signOutAdmin(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      setLocalData('mif_admin_session', 'false');
    }
  },

  async isAdminAuthenticated(): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } else {
      return getLocalData<string>('mif_admin_session', 'false') === 'true';
    }
  },

  // --- HOMEPAGE CONTENT & MEDIA ---
  async getHomepageContent(): Promise<HomepageContent> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'homepage_content')
        .maybeSingle();
      if (error) throw error;
      return data ? data.value : DEFAULT_HOMEPAGE_CONTENT;
    } else {
      return getLocalData<HomepageContent>('mif_homepage_content', DEFAULT_HOMEPAGE_CONTENT);
    }
  },

  async updateHomepageContent(value: HomepageContent): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'homepage_content', value, updated_at: new Date().toISOString() });
      if (error) throw error;
    } else {
      setLocalData('mif_homepage_content', value);
    }
  },

  async uploadImage(file: File, bucket: string, path: string): Promise<string> {
    if (isSupabaseConfigured && supabase) {
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      return publicUrl;
    } else {
      // In Mock Mode, convert file to Base64 Data URI
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  },

  async saveContactMessage(messageInput: Omit<ContactMessage, 'id' | 'created_at' | 'is_read' | 'is_important'>): Promise<ContactMessage> {
    const created_at = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          ...messageInput,
          is_read: false,
          is_important: false,
          created_at,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const messages = getLocalData<ContactMessage[]>('mif_contact_messages', []);
      const newMessage: ContactMessage = {
        ...messageInput,
        id: 'msg_' + Math.random().toString(36).substr(2, 9),
        is_read: false,
        is_important: false,
        created_at,
      };
      messages.push(newMessage);
      setLocalData('mif_contact_messages', messages);
      return newMessage;
    }
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } else {
      return getLocalData<ContactMessage[]>('mif_contact_messages', []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  },

  async updateContactMessageStatus(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const messages = getLocalData<ContactMessage[]>('mif_contact_messages', []);
      const index = messages.findIndex((m) => m.id === id);
      if (index === -1) throw new Error('Message not found');
      messages[index] = { ...messages[index], ...updates };
      setLocalData('mif_contact_messages', messages);
      return messages[index];
    }
  },

  async deleteContactMessage(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } else {
      const messages = getLocalData<ContactMessage[]>('mif_contact_messages', []);
      const filtered = messages.filter((m) => m.id !== id);
      setLocalData('mif_contact_messages', filtered);
    }
  },

  // --- MEDIA LIBRARY / ASSETS ---
  async getMediaAssets(): Promise<MediaAsset[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('Error fetching media_assets table, falling back to empty list:', error);
        return [];
      }
      return data || [];
    } else {
      return getLocalData<MediaAsset[]>('mif_media_assets', []);
    }
  },

  async createMediaAsset(asset: Omit<MediaAsset, 'id' | 'created_at'>): Promise<MediaAsset> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('media_assets')
        .insert([asset])
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const assets = getLocalData<MediaAsset[]>('mif_media_assets', []);
      const newAsset: MediaAsset = {
        ...asset,
        id: 'ma_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      assets.push(newAsset);
      setLocalData('mif_media_assets', assets);
      return newAsset;
    }
  },

  async updateMediaAsset(id: string, updates: Partial<MediaAsset>): Promise<MediaAsset> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('media_assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const assets = getLocalData<MediaAsset[]>('mif_media_assets', []);
      const index = assets.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Asset not found');
      assets[index] = { ...assets[index], ...updates };
      setLocalData('mif_media_assets', assets);
      return assets[index];
    }
  },

  async deleteMediaAsset(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } else {
      const assets = getLocalData<MediaAsset[]>('mif_media_assets', []);
      const filtered = assets.filter((a) => a.id !== id);
      setLocalData('mif_media_assets', filtered);
    }
  },

  // --- SOCIAL MEDIA SETTINGS ---
  async getSocialLinks(): Promise<SocialLink[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('social_media_settings')
        .select('*')
        .order('platform', { ascending: true });
      if (error) {
        console.warn('Error fetching social_media_settings table, falling back to empty list:', error);
        return [];
      }
      return data || [];
    } else {
      return getLocalData<SocialLink[]>('mif_social_links', []);
    }
  },

  async updateSocialLink(id: string, updates: Partial<SocialLink>): Promise<SocialLink> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('social_media_settings')
        .update({
          url: updates.url,
          enabled: updates.enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const links = getLocalData<SocialLink[]>('mif_social_links', []);
      const index = links.findIndex((l) => l.id === id);
      if (index === -1) throw new Error('Social link not found');
      links[index] = { ...links[index], ...updates, updated_at: new Date().toISOString() };
      setLocalData('mif_social_links', links);
      return links[index];
    }
  },
};
