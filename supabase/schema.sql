-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create PRODUCTS table
create table if not exists public.products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    price numeric not null check (price >= 0),
    unit text not null, -- e.g., 'kg', 'Egg', '6 Eggs', '12 Eggs'
    image_url text, -- Path or URL to the product image
    category text not null check (category in ('chicken', 'eggs')),
    is_active boolean default true,
    in_stock boolean default true,
    organic_badge boolean default true,
    stock_badge_text text, -- e.g., 'Freshly Harvested', 'Limited Stock', 'Pre-Order'
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create ORDERS table
create table if not exists public.orders (
    id uuid default uuid_generate_v4() primary key,
    order_number text unique not null, -- e.g., MIF-10001
    customer_name text not null,
    customer_phone text not null,
    delivery_address text not null,
    order_type text not null check (order_type in ('delivery', 'pickup')),
    items jsonb not null, -- Array of { id, name, price, quantity, unit, total }
    total_amount numeric not null check (total_amount >= 0),
    delivery_charge numeric not null default 0 check (delivery_charge >= 0),
    payment_method text not null check (payment_method in ('COD', 'UPI')),
    notes text,
    status text not null default 'placed' check (status in ('placed', 'packed', 'transit', 'delivery', 'delivered', 'cancelled')),
    estimated_delivery text,
    admin_notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create SETTINGS table
create table if not exists public.settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on all tables
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

-- --- RLS POLICIES ---

-- Products Policies:
-- 1. Public can read active products
create policy "Allow public to view active products" 
on public.products for select 
using (is_active = true);

-- 2. Authenticated users (admin) can do everything
create policy "Allow authenticated admin full access to products" 
on public.products for all 
to authenticated 
using (true) 
with check (true);

-- Orders Policies:
-- 1. Public can insert orders (to place their order)
create policy "Allow public to place orders" 
on public.orders for insert 
with check (true);

-- 2. Authenticated users (admin) can view and modify all orders
create policy "Allow authenticated admin full access to orders" 
on public.orders for all 
to authenticated 
using (true) 
with check (true);

-- 3. Public can select orders (filtered by client-side query)
create policy "Allow public to select orders" 
on public.orders for select 
using (true);

-- Settings Policies:
-- 1. Public can read settings
create policy "Allow public to view settings" 
on public.settings for select 
using (true);

-- 2. Authenticated users (admin) can update settings
create policy "Allow authenticated admin full access to settings" 
on public.settings for all 
to authenticated 
using (true) 
with check (true);

-- Create CONTACT MESSAGES table
create table if not exists public.contact_messages (
    id uuid default uuid_generate_v4() primary key,
    customer_name text not null,
    customer_phone text not null,
    customer_email text not null,
    subject text not null,
    customer_message text not null,
    is_read boolean default false,
    is_important boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on contact_messages
alter table public.contact_messages enable row level security;

-- Policies for contact_messages
create policy "Allow public to insert contact messages" 
on public.contact_messages for insert 
with check (true);

create policy "Allow authenticated admin full access to contact messages" 
on public.contact_messages for all 
to authenticated 
using (true) 
with check (true);

-- --- SEED DATA ---

-- Seed Products
insert into public.products (name, description, price, unit, category, image_url, is_active, in_stock, organic_badge, stock_badge_text, display_order)
values
('Premium Country Chicken (Pre-dressed)', 'Raised ethically in our free-range farm, 100% organic feed, antibiotic-free, hormone-free. Freshly dressed and packed under hygienic conditions.', 559.00, 'kg', 'chicken', '/images/placeholder-chicken.jpg', true, true, true, 'Fresh Daily', 1),
('Fresh Loose Country Eggs', 'Fresh country eggs collected daily from free-range country hens. Rich in nutrients, deep yellow-orange yolk.', 15.00, 'Egg', 'eggs', '/images/placeholder-eggs.jpg', true, true, true, 'Daily Harvest', 2),
('Country Eggs (6 Pack)', 'Hand-picked country eggs, safely packed in a biodegradable pulp carton. Perfect for small families.', 95.00, '6 Eggs', 'eggs', '/images/placeholder-eggs-6.jpg', true, true, true, 'Popular', 3),
('Country Eggs (12 Pack)', 'Hygienically packed premium country eggs. Fresh, clean, and nutrient-dense.', 185.00, '12 Eggs', 'eggs', '/images/placeholder-eggs-12.jpg', true, true, true, 'Best Seller', 4),
('Country Eggs (15 Pack)', 'Economical pack of 15 premium farm-fresh country eggs.', 230.00, '15 Eggs', 'eggs', '/images/placeholder-eggs-15.jpg', true, true, true, 'Fresh', 5),
('Country Eggs (20 Pack)', 'Family-sized pack of 20 premium country eggs, rich in natural proteins.', 310.00, '20 Eggs', 'eggs', '/images/placeholder-eggs-20.jpg', true, true, true, 'Fresh', 6),
('Country Eggs (30 Pack)', 'Value pack of 30 premium country eggs. Collected fresh daily from our farm.', 450.00, '30 Eggs', 'eggs', '/images/placeholder-eggs-30.jpg', true, true, true, 'Best Value', 7)
on conflict do nothing;

-- Seed Settings
insert into public.settings (key, value)
values
('store_status', '{"status": "open", "message": "Accepting Orders"}'::jsonb),
('delivery_charge', '{"fee": 50, "free_above": 1000}'::jsonb),
('contact_details', '{"phone_1": "7981544848", "phone_2": "7995986012", "email": "sampyadav12@gmail.com", "address": "Bowrampet, Hyderabad, Telangana", "whatsapp": "7981544848"}'::jsonb),
('business_hours', '{"timings": "6:00 AM - 9:00 PM", "days": "Monday - Sunday"}'::jsonb),
('social_links', '{"facebook": "#", "instagram": "#", "youtube": "#"}'::jsonb),
('seo_settings', '{"title": "Mana Inti Farms | Fresh Country Eggs & Chicken Hyderabad", "description": "Experience the unmatched taste of premium country eggs and pre-dressed country chicken. Raised ethically in our free-range farm, completely antibiotic-free."}'::jsonb)
on conflict (key) do update set value = excluded.value;
-- Create MEDIA ASSETS table
create table if not exists public.media_assets (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    url text not null,
    category text not null check (category in ('branding', 'homepage', 'products', 'sections', 'system')),
    alt_text text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on media_assets
alter table public.media_assets enable row level security;

-- Policies for media_assets
create policy "Allow public to view media assets" 
on public.media_assets for select 
using (true);

create policy "Allow authenticated admin full access to media assets" 
on public.media_assets for all 
to authenticated 
using (true) 
with check (true);

-- Create SOCIAL MEDIA SETTINGS table
create table if not exists public.social_media_settings (
    id uuid default uuid_generate_v4() primary key,
    platform text not null unique,
    url text not null,
    enabled boolean default true,
    icon_name text not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on social_media_settings
alter table public.social_media_settings enable row level security;

-- Policies for social_media_settings
create policy "Allow public to view social media settings" 
on public.social_media_settings for select 
using (true);

create policy "Allow authenticated admin full access to social media settings" 
on public.social_media_settings for all 
to authenticated 
using (true) 
with check (true);

-- Seed default social settings
insert into public.social_media_settings (platform, url, enabled, icon_name)
values
('Facebook', 'https://facebook.com/manaintifarms', true, 'facebook'),
('Instagram', 'https://instagram.com/manaintifarms', true, 'instagram'),
('YouTube', 'https://youtube.com/@manaintifarms', true, 'youtube'),
('WhatsApp', 'https://wa.me/917981544848', true, 'whatsapp'),
('X (Twitter)', '', false, 'twitter'),
('LinkedIn', '', false, 'linkedin'),
('Telegram', '', false, 'telegram')
on conflict (platform) do nothing;

