export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string; // e.g., 'kg', 'Egg', '6 Eggs', '12 Eggs', etc.
  image_url: string | null;
  category: 'chicken' | 'eggs';
  is_active: boolean;
  in_stock: boolean;
  organic_badge: boolean;
  stock_badge_text: string | null;
  display_order: number;
  seo_alt_text?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  total: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  order_type: 'delivery' | 'pickup';
  items: OrderItem[];
  total_amount: number;
  delivery_charge: number;
  payment_method: 'COD' | 'UPI';
  notes: string | null;
  status: 'placed' | 'packed' | 'transit' | 'delivery' | 'delivered' | 'cancelled';
  estimated_delivery?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface StoreStatus {
  status: 'open' | 'closed' | 'holiday';
  message: string;
}

export interface DeliveryCharge {
  fee: number;
  free_above: number;
}

export interface ContactDetails {
  phone_1: string;
  phone_2: string;
  email: string;
  address: string;
  whatsapp: string;
}

export interface BusinessHours {
  timings: string;
  days: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface SEOSettings {
  title: string;
  description: string;
}

export interface StoreSettings {
  store_status: StoreStatus;
  delivery_charge: DeliveryCharge;
  contact_details: ContactDetails;
  business_hours: BusinessHours;
  social_links: SocialLinks;
  seo_settings: SEOSettings;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image_url: string; // Placeholder or uploaded
  date: string;
}

export interface DashboardStats {
  orderCount: number;
  revenue: number;
  avgOrderValue: number;
  pendingOrders: number;
}

export interface HomepageContent {
  // Branding
  logo_url: string;
  navbar_logo_url?: string;
  mobile_logo_url?: string;
  navbar_icon_url?: string;
  footer_logo_url?: string;
  favicon_url?: string;
  website_name?: string;
  tagline?: string;

  // Hero Section
  hero_title: string;
  hero_subtitle: string;
  hero_bg_image: string;
  hero_circular_image?: string;
  hero_chicken_image: string;
  hero_egg_image: string;
  hero_button_text?: string;
  hero_button_url?: string;
  hero_cta_text?: string;

  // About Section
  about_title?: string;
  about_subtitle?: string;
  about_content?: string;
  about_image: string;
  why_choose_us_image?: string;
  testimonial_bg_image?: string;

  // Contact Section
  contact_image?: string;
  delivery_image?: string;

  // Error Pages
  error_404_image?: string;
  maintenance_image?: string;
  offline_image?: string;
  empty_state_image?: string;
  image_alts?: Record<string, string>;

  // Promotional Banner
  promo_banner_image: string;
  promo_banner_text: string;
  promo_banner_active: boolean;
  seasonal_offer: string;

  // Colors
  colors?: {
    primary: string;
    primary_hover?: string;
    secondary: string;
    accent: string;
    background: string;
    card_bg?: string;
    text_color?: string;
    border_color?: string;
    button_bg?: string;
    button_text?: string;
    accent_hover?: string;
    success?: string;
    warning?: string;
    error?: string;
    navbar_bg?: string;
    footer_bg?: string;
    badge_bg?: string;
    link_color?: string;
  };

  // Typography
  typography?: {
    heading_font: string;
    body_font: string;
    base_font_size?: string;
    base_font_weight?: 'light' | 'normal' | 'medium' | 'bold';
  };

  // Layout Settings
  layout?: {
    border_radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    card_style: 'minimal' | 'flat' | 'glass' | 'shadow';
    hero_bg_style?: 'grid' | 'radial' | 'plain';
    section_bg_style?: 'grid' | 'radial' | 'plain';
  };

  // Section Toggles
  sections?: {
    hero: boolean;
    about: boolean;
    products: boolean;
    why_choose_us: boolean;
    reviews: boolean;
    gallery: boolean;
    faq: boolean;
    contact: boolean;
    footer: boolean;
    promo_banner: boolean;
    delivery_info: boolean;
  };

  // SEO
  seo?: {
    meta_title: string;
    meta_description: string;
  };

  // FAQs
  faqs?: Array<{ question: string; answer: string }>;

  // Gallery
  gallery?: string[];
}

export interface ContactMessage {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  subject: string;
  customer_message: string;
  is_read: boolean;
  is_important: boolean;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  category: 'branding' | 'homepage' | 'products' | 'sections' | 'system';
  alt_text: string;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  enabled: boolean;
  icon_name: string;
  updated_at?: string;
}
