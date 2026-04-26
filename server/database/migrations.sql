-- Create the schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS bb_ecommerce_sc;

-- Grant usage to postgres, authenticated, service_role
GRANT USAGE ON SCHEMA bb_ecommerce_sc TO postgres, anon, authenticated, service_role;

-- Create the app_users table for custom email verification flow
CREATE TABLE IF NOT EXISTS bb_ecommerce_sc.app_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "isVerified" BOOLEAN DEFAULT FALSE,
  "verificationToken" TEXT,
  "tokenExpiry" TIMESTAMPTZ,
  full_name TEXT,
  phone TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- For users who already have the table:
ALTER TABLE bb_ecommerce_sc.app_users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE bb_ecommerce_sc.app_users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Grant privileges to the service_role (used by the backend API)
GRANT ALL ON TABLE bb_ecommerce_sc.app_users TO service_role;

-- Turn on row level security, but we do all auth at the Node API level
-- so we can lock it down completely from client-side manipulation.
ALTER TABLE bb_ecommerce_sc.app_users ENABLE ROW LEVEL SECURITY;

-- Deny all client side access directly (requests come from Server API wrapper)
CREATE POLICY "Deny all access to app_users from client"
ON bb_ecommerce_sc.app_users FOR ALL TO PUBLIC USING (false);
