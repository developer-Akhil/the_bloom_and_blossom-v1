-- ==============================================================================
-- The Bloom & Blossom - Unified Supabase Schema
-- Target Schema: bb_ecommerce_sc
-- ==============================================================================
-- This script contains all necessary tables, triggers, and permissions 
-- to run the storefront safely within your custom schema framework.

CREATE SCHEMA IF NOT EXISTS bb_ecommerce_sc;

-- 1. Profiles Table (Automatically synced with auth.users)
CREATE TABLE IF NOT EXISTS bb_ecommerce_sc.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  has_used_first_discount BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Admin Users Table (Custom quick-fix prototype auth)
CREATE TABLE IF NOT EXISTS bb_ecommerce_sc.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS bb_ecommerce_sc.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS bb_ecommerce_sc.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES bb_ecommerce_sc.categories(id),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_customizable BOOLEAN DEFAULT false,
  rating DECIMAL(2, 1) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Dynamic Pricing Lookup Table (Queried by the real-time context)
CREATE TABLE IF NOT EXISTS bb_ecommerce_sc.dynamic_prices (
  product_id TEXT PRIMARY KEY,
  price DECIMAL(10, 2) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Wishlist Table
CREATE TABLE IF NOT EXISTS bb_ecommerce_sc.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES bb_ecommerce_sc.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS bb_ecommerce_sc.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  guest_phone TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_applied DECIMAL(10, 2) DEFAULT 0,
  final_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  order_status TEXT DEFAULT 'processing', -- processing, shipped, delivered, cancelled
  shipping_address JSONB,
  payment_id TEXT, -- Payment gateway transaction ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS bb_ecommerce_sc.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES bb_ecommerce_sc.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES bb_ecommerce_sc.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  customization_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- Schema Permissions & Grants
-- ==============================================================================

-- Crucial: Grant access to the custom schema so the API can reach it
GRANT USAGE ON SCHEMA bb_ecommerce_sc TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA bb_ecommerce_sc TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA bb_ecommerce_sc TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA bb_ecommerce_sc TO anon, authenticated;

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE bb_ecommerce_sc.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.dynamic_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.wishlist ENABLE ROW LEVEL SECURITY;

-- Dynamic Prices: Anyone can read, only authenticated users (future: admin check) can write
CREATE POLICY "Dynamic prices are readable by everyone" ON bb_ecommerce_sc.dynamic_prices FOR SELECT USING (true);
CREATE POLICY "Dynamic prices can be updated by authenticated users in admin board" ON bb_ecommerce_sc.dynamic_prices FOR ALL USING (auth.role() = 'authenticated');

-- Admin Users: Allow anon access for login checks (since it doesn't use auth.uid)
CREATE POLICY "Admin users check" ON bb_ecommerce_sc.admin_users FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON bb_ecommerce_sc.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON bb_ecommerce_sc.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON bb_ecommerce_sc.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON bb_ecommerce_sc.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ==============================================================================
-- Triggers and Functions
-- ==============================================================================

-- Automatic Profile Creation on Auth Signup
CREATE OR REPLACE FUNCTION bb_ecommerce_sc.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO bb_ecommerce_sc.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE bb_ecommerce_sc.handle_new_user();

-- Insert the default admin user so you can log into the panel out of the box!
INSERT INTO bb_ecommerce_sc.admin_users (username, password) 
VALUES ('admin', 'bloom_admin_2024')
ON CONFLICT (username) DO NOTHING;
