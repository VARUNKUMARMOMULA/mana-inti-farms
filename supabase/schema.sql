-- =========================================================================
-- 1. PRE-REQUISITES (Enable Extensions)
-- =========================================================================
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 2. CREATE OR ALIGN TABLES (Non-destructive: skips existing, adds missing)
-- =========================================================================

-- Products Table
create table if not exists public.products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    price numeric not null check (price >= 0),
    unit text not null,
    image_url text,
    category text not null check (category in ('chicken', 'eggs')),
    is_active boolean default true,
    in_stock boolean default true,
    organic_badge boolean default true,
    stock_badge_text text,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Align Products Columns (adds any missing columns without deleting existing data)
alter table public.products add column if not exists name text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists price numeric;
alter table public.products add column if not exists unit text;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists category text;
alter table public.products add column if not exists is_active boolean default true;
alter table public.products add column if not exists in_stock boolean default true;
alter table public.products add column if not exists organic_badge boolean default true;
alter table public.products add column if not exists stock_badge_text text;
alter table public.products add column if not exists display_order integer default 0;
alter table public.products add column if not exists seo_alt_text text;

-- Orders Table
create table if not exists public.orders (
    id uuid default uuid_generate_v4() primary key,
    order_number text unique not null,
    customer_name text not null,
    customer_phone text not null,
    delivery_address text not null,
    order_type text not null check (order_type in ('delivery', 'pickup')),
    items jsonb not null,
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

-- Align Orders Columns
alter table public.orders add column if not exists order_number text;
alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists customer_phone text;
alter table public.orders add column if not exists delivery_address text;
alter table public.orders add column if not exists order_type text;
alter table public.orders add column if not exists items jsonb;
alter table public.orders add column if not exists total_amount numeric;
alter table public.orders add column if not exists delivery_charge numeric;
alter table public.orders add column if not exists payment_method text;
alter table public.orders add column if not exists notes text;
alter table public.orders add column if not exists status text;
alter table public.orders add column if not exists estimated_delivery text;
alter table public.orders add column if not exists admin_notes text;

-- Settings Table
create table if not exists public.settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Contact Messages Table
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

-- Align Contact Messages Columns
alter table public.contact_messages add column if not exists customer_name text;
alter table public.contact_messages add column if not exists customer_phone text;
alter table public.contact_messages add column if not exists customer_email text;
alter table public.contact_messages add column if not exists subject text;
alter table public.contact_messages add column if not exists customer_message text;
alter table public.contact_messages add column if not exists is_read boolean default false;
alter table public.contact_messages add column if not exists is_important boolean default false;

-- Media Assets Table
create table if not exists public.media_assets (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    url text not null,
    category text not null check (category in ('branding', 'homepage', 'products', 'sections', 'system')),
    alt_text text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Align Media Assets Columns
alter table public.media_assets add column if not exists name text;
alter table public.media_assets add column if not exists url text;
alter table public.media_assets add column if not exists category text;
alter table public.media_assets add column if not exists alt_text text;

-- Social Media Settings Table
create table if not exists public.social_media_settings (
    id uuid default uuid_generate_v4() primary key,
    platform text not null unique,
    url text not null,
    enabled boolean default true,
    icon_name text not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Align Social Media Settings Columns
alter table public.social_media_settings add column if not exists platform text;
alter table public.social_media_settings add column if not exists url text;
alter table public.social_media_settings add column if not exists enabled boolean default true;
alter table public.social_media_settings add column if not exists icon_name text;


-- =========================================================================
-- 3. STORAGE BUCKET CREATION (For Image Uploads)
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('mif-assets', 'mif-assets', true)
on conflict (id) do nothing;


-- =========================================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =========================================================================
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.media_assets enable row level security;
alter table public.social_media_settings enable row level security;


-- =========================================================================
-- 5. CREATE SECURITY POLICIES (Drop existing & recreate to ensure correctness)
-- =========================================================================

-- Products Policies
drop policy if exists "Allow public to view active products" on public.products;
create policy "Allow public to view active products" on public.products 
    for select using (is_active = true);

drop policy if exists "Allow authenticated admin full access to products" on public.products;
create policy "Allow authenticated admin full access to products" on public.products 
    for all to authenticated using (true) with check (true);

-- Orders Policies
drop policy if exists "Allow public to place orders" on public.orders;
create policy "Allow public to place orders" on public.orders 
    for insert with check (true);

drop policy if exists "Allow public to select orders" on public.orders;
create policy "Allow public to select orders" on public.orders 
    for select using (true);

drop policy if exists "Allow authenticated admin full access to orders" on public.orders;
create policy "Allow authenticated admin full access to orders" on public.orders 
    for all to authenticated using (true) with check (true);

-- Settings Policies
drop policy if exists "Allow public to view settings" on public.settings;
create policy "Allow public to view settings" on public.settings 
    for select using (true);

drop policy if exists "Allow authenticated admin full access to settings" on public.settings;
create policy "Allow authenticated admin full access to settings" on public.settings 
    for all to authenticated using (true) with check (true);

-- Contact Messages Policies
drop policy if exists "Allow public to insert contact messages" on public.contact_messages;
create policy "Allow public to insert contact messages" on public.contact_messages 
    for insert with check (true);

drop policy if exists "Allow authenticated admin full access to contact messages" on public.contact_messages;
create policy "Allow authenticated admin full access to contact messages" on public.contact_messages 
    for all to authenticated using (true) with check (true);

-- Media Assets Policies
drop policy if exists "Allow public to view media assets" on public.media_assets;
create policy "Allow public to view media assets" on public.media_assets 
    for select using (true);

drop policy if exists "Allow authenticated admin full access to media assets" on public.media_assets;
create policy "Allow authenticated admin full access to media assets" on public.media_assets 
    for all to authenticated using (true) with check (true);

-- Social Settings Policies
drop policy if exists "Allow public to view social media settings" on public.social_media_settings;
create policy "Allow public to view social media settings" on public.social_media_settings 
    for select using (true);

drop policy if exists "Allow authenticated admin full access to social media settings" on public.social_media_settings;
create policy "Allow authenticated admin full access to social media settings" on public.social_media_settings 
    for all to authenticated using (true) with check (true);

-- Storage (mif-assets) Policies
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects 
    for select using (bucket_id = 'mif-assets');

drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload" on storage.objects 
    for insert to authenticated with check (bucket_id = 'mif-assets');

drop policy if exists "Authenticated Update" on storage.objects;
create policy "Authenticated Update" on storage.objects 
    for update to authenticated with check (bucket_id = 'mif-assets');

drop policy if exists "Authenticated Delete" on storage.objects;
create policy "Authenticated Delete" on storage.objects 
    for delete to authenticated using (bucket_id = 'mif-assets');


-- =========================================================================
-- 6. INDEXES FOR PERFORMANCE
-- =========================================================================
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);


-- =========================================================================
-- 7. SEED INITIAL SYSTEM SETTINGS (Non-destructive: skips if already customized)
-- =========================================================================
insert into public.settings (key, value)
values
('store_status', '{"status": "open", "message": "Accepting Orders"}'::jsonb),
('delivery_charge', '{"fee": 50, "free_above": 1000}'::jsonb),
('contact_details', '{"phone_1": "7981544848", "phone_2": "7995986012", "email": "sampyadav12@gmail.com", "address": "Bowrampet, Hyderabad, Telangana", "whatsapp": "7981544848"}'::jsonb),
('business_hours', '{"timings": "6:00 AM - 9:00 PM", "days": "Monday - Sunday"}'::jsonb),
('social_links', '{"facebook": "#", "instagram": "#", "youtube": "#"}'::jsonb),
('seo_settings', '{"title": "Mana Inti Farms | Fresh Country Eggs & Chicken Hyderabad", "description": "Experience the unmatched taste of premium country eggs and pre-dressed country chicken. Raised ethically in our free-range farm, completely antibiotic-free."}'::jsonb)
on conflict (key) do nothing;

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


-- =========================================================================
-- 8. INSERT REQUIRED PRODUCTION PRODUCTS (Non-destructive)
-- =========================================================================
insert into public.products (id, name, description, price, unit, image_url, category, is_active, in_stock, organic_badge, stock_badge_text, display_order)
values
-- 1. Country Eggs (6 Pack)
('e25641d3-3287-473f-8d9a-2251e5d35e01', 
 'Country Eggs (6 Pack)', 
 'Fresh farm-raised country eggs collected daily. Rich in protein, naturally nutritious, and ideal for everyday meals.', 
 90, 
 'Pack', 
 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80', 
 'eggs', 
 true, 
 true, 
 true, 
 'Organic', 
 1),

-- 2. Country Eggs (12 Pack)
('e25641d3-3287-473f-8d9a-2251e5d35e02', 
 'Country Eggs (12 Pack)', 
 'Family pack of fresh country eggs with excellent taste, nutrition, and freshness.', 
 180, 
 'Pack', 
 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80', 
 'eggs', 
 true, 
 true, 
 true, 
 'Organic', 
 2),

-- 3. Premium Country Eggs
('e25641d3-3287-473f-8d9a-2251e5d35e03', 
 'Premium Country Eggs', 
 'Premium-quality handpicked country eggs from healthy free-range hens with rich yolks and superior taste.', 
 220, 
 'Dozen', 
 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80', 
 'eggs', 
 true, 
 true, 
 true, 
 'Premium', 
 3),

-- 4. Organic Eggs
('e25641d3-3287-473f-8d9a-2251e5d35e04', 
 'Organic Eggs', 
 'Certified organic eggs produced without harmful chemicals or antibiotics.', 
 250, 
 'Dozen', 
 'https://images.unsplash.com/photo-1582722472209-8007cf993d14?w=600&auto=format&fit=crop&q=80', 
 'eggs', 
 true, 
 true, 
 true, 
 'Organic', 
 4),

-- 5. Country Chicken (Whole)
('e25641d3-3287-473f-8d9a-2251e5d35e05', 
 'Country Chicken (Whole)', 
 'Naturally raised country chicken with tender meat and authentic farm-fresh flavor.', 
 650, 
 'Whole Chicken', 
 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80', 
 'chicken', 
 true, 
 true, 
 true, 
 'Farm Fresh', 
 5),

-- 6. Country Chicken (Cut Pieces)
('e25641d3-3287-473f-8d9a-2251e5d35e06', 
 'Country Chicken (Cut Pieces)', 
 'Freshly cut country chicken, cleaned and packed hygienically for convenient cooking.', 
 700, 
 'kg', 
 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80', 
 'chicken', 
 true, 
 true, 
 true, 
 'Fresh', 
 6),

-- 7. Fresh Country Chicken
('e25641d3-3287-473f-8d9a-2251e5d35e07', 
 'Fresh Country Chicken', 
 'Premium fresh country chicken sourced daily from trusted local farms.', 
 680, 
 'kg', 
 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80', 
 'chicken', 
 true, 
 true, 
 true, 
 'Fresh', 
 7)
on conflict (id) do nothing;


-- =========================================================================
-- 9. REFRESH SCHEMA CACHE
-- =========================================================================
NOTIFY pgrst, 'reload schema';
