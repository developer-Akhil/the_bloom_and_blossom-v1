-- Supabase Schema for The Bloom and Blossom
-- Custom Schema: bb_ecommerce_sc

CREATE SCHEMA IF NOT EXISTS bb_ecommerce_sc;

-- 1. Categories Table
CREATE TABLE bb_ecommerce_sc.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Products Table
CREATE TABLE bb_ecommerce_sc.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES bb_ecommerce_sc.categories(id),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_customizable BOOLEAN DEFAULT false,
  rating DECIMAL(2, 1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Users Profile (Extends Supabase Auth users)
CREATE TABLE bb_ecommerce_sc.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Wishlist Table
CREATE TABLE bb_ecommerce_sc.wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES bb_ecommerce_sc.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 5. Cart Table
CREATE TABLE bb_ecommerce_sc.cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES bb_ecommerce_sc.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  customization_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Dynamic Pricing Lookup Table
CREATE TABLE bb_ecommerce_sc.dynamic_prices (
  product_id TEXT PRIMARY KEY,
  price DECIMAL(10, 2) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Orders Table
CREATE TABLE bb_ecommerce_sc.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  order_status TEXT DEFAULT 'processing', -- processing, shipped, delivered, cancelled
  shipping_address JSONB,
  payment_id TEXT, -- KnitPay transaction ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Order Items Table
CREATE TABLE bb_ecommerce_sc.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES bb_ecommerce_sc.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES bb_ecommerce_sc.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  customization_name TEXT
);

-- 8. User Activity Table
CREATE TABLE bb_ecommerce_sc.user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES bb_ecommerce_sc.products(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- view, like, cart_add
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE bb_ecommerce_sc.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_ecommerce_sc.user_activity ENABLE ROW LEVEL SECURITY;

-- Permissions for custom schema
GRANT USAGE ON SCHEMA bb_ecommerce_sc TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA bb_ecommerce_sc TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA bb_ecommerce_sc TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA bb_ecommerce_sc TO anon, authenticated;

-- Policies
-- Categories: Anyone can read
CREATE POLICY "Categories are readable by everyone" ON bb_ecommerce_sc.categories FOR SELECT USING (true);

-- Products: Anyone can read
CREATE POLICY "Products are readable by everyone" ON bb_ecommerce_sc.products FOR SELECT USING (true);

-- Profiles: Users can read/write their own
CREATE POLICY "Users can manage their own profiles" ON bb_ecommerce_sc.profiles
  FOR ALL USING (auth.uid() = id);

-- Wishlist: Users can manage their own
CREATE POLICY "Users can manage their own wishlist" ON bb_ecommerce_sc.wishlist
  FOR ALL USING (auth.uid() = user_id);

-- Cart: Users can manage their own
CREATE POLICY "Users can manage their own cart" ON bb_ecommerce_sc.cart
  FOR ALL USING (auth.uid() = user_id);

-- Orders: Users can read/create their own
CREATE POLICY "Users can view their own orders" ON bb_ecommerce_sc.orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON bb_ecommerce_sc.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items: Users can read their own
CREATE POLICY "Users can view their own order items" ON bb_ecommerce_sc.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bb_ecommerce_sc.orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Insert Initial Categories
INSERT INTO bb_ecommerce_sc.categories (name) VALUES 
('Customised Name Bows'),
('Plain Scrunchies'),
('Printed Scrunchies'),
('Printed Bows'),
('Premium Doll Bows'),
('Jewelled Bows'),
('Alligator Clips'),
('Alligator Bows'),
('Customised Name Sunglasses');

-- 9. Automatic Profile Creation Trigger
CREATE OR REPLACE FUNCTION bb_ecommerce_sc.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO bb_ecommerce_sc.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE bb_ecommerce_sc.handle_new_user();

