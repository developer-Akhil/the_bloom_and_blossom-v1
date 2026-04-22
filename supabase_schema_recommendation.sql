-- Recommended Supabase Schema for The Bloom & Blossom --

-- 1. Collections Table
CREATE TABLE collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table (Includes Categories / Product Types)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- e.g., 'Customised Name Bows', 'Alligator Clips'
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2), -- Useful for cross-out discounts
  description TEXT,
  is_customizable BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Product Images Table
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Inventory Table
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE UNIQUE,
  available_qty INT DEFAULT 0 NOT NULL,
  sold_qty INT DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'IN_STOCK', -- e.g., IN_STOCK, OUT_OF_STOCK
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Users (Customers) Table (Extends Supabase Auth Auth.users)
CREATE TABLE customers (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  has_used_first_discount BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  guest_email TEXT, -- In case of guest checkout
  guest_phone TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_applied DECIMAL(10, 2) DEFAULT 0,
  final_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, PAID, SHIPPED, DELIVERED
  payment_status TEXT DEFAULT 'UNPAID',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL, -- Keep string snapshot in case product is deleted
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  customization_details JSONB, -- For custom bows (name, options, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to automatically create customer profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.customers (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
