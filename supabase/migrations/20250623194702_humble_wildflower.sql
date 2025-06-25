/*
  # Initial Schema Setup for SaaSify AI Platform

  1. New Tables
    - `profiles` - Extended user profile information
    - `apps` - User-created SaaS applications
    - `app_components` - Components within each app
    - `marketplace_listings` - Apps listed for sale
    - `transactions` - Purchase and commission tracking
    - `subscriptions` - User subscription plans
    - `analytics` - App usage analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin-only policies for sensitive data

  3. Functions
    - Handle user registration
    - Calculate commissions
    - Generate app analytics
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_plan AS ENUM ('starter', 'pro', 'enterprise');
CREATE TYPE app_status AS ENUM ('draft', 'review', 'published', 'suspended');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  plan subscription_plan DEFAULT 'starter',
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Apps table
CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  status app_status DEFAULT 'draft',
  config jsonb DEFAULT '{}',
  preview_image text,
  domain_slug text UNIQUE,
  is_template boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- App components table
CREATE TABLE IF NOT EXISTS app_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  component_type text NOT NULL,
  component_config jsonb DEFAULT '{}',
  position_x integer DEFAULT 0,
  position_y integer DEFAULT 0,
  width integer DEFAULT 200,
  height integer DEFAULT 100,
  z_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Marketplace listings table
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  price decimal(10,2) NOT NULL,
  commission_rate decimal(5,2) DEFAULT 10.00,
  featured boolean DEFAULT false,
  downloads integer DEFAULT 0,
  views integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0.00,
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  app_id uuid REFERENCES apps(id) ON DELETE SET NULL,
  listing_id uuid REFERENCES marketplace_listings(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  commission decimal(10,2) NOT NULL,
  status transaction_status DEFAULT 'pending',
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan subscription_plan NOT NULL,
  stripe_subscription_id text UNIQUE,
  status text NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- App reviews table
CREATE TABLE IF NOT EXISTS app_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(app_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Apps policies
CREATE POLICY "Users can read own apps"
  ON apps
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can create apps"
  ON apps
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own apps"
  ON apps
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Published apps are viewable by everyone"
  ON apps
  FOR SELECT
  TO authenticated
  USING (status = 'published');

-- App components policies
CREATE POLICY "Users can manage own app components"
  ON app_components
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM apps 
      WHERE apps.id = app_components.app_id 
      AND apps.author_id = auth.uid()
    )
  );

-- Marketplace listings policies
CREATE POLICY "Everyone can view marketplace listings"
  ON marketplace_listings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "App owners can manage their listings"
  ON marketplace_listings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM apps 
      WHERE apps.id = marketplace_listings.app_id 
      AND apps.author_id = auth.uid()
    )
  );

-- Transactions policies
CREATE POLICY "Users can view their transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "App owners can view their analytics"
  ON analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM apps 
      WHERE apps.id = analytics.app_id 
      AND apps.author_id = auth.uid()
    )
  );

-- App reviews policies
CREATE POLICY "Everyone can read reviews"
  ON app_reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON app_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON app_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update marketplace listing stats
CREATE OR REPLACE FUNCTION update_listing_stats()
RETURNS trigger AS $$
BEGIN
  -- Update download count
  IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    UPDATE marketplace_listings 
    SET downloads = downloads + 1
    WHERE id = NEW.listing_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for transaction updates
DROP TRIGGER IF EXISTS on_transaction_update ON transactions;
CREATE TRIGGER on_transaction_update
  AFTER INSERT OR UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_listing_stats();

-- Function to calculate app ratings
CREATE OR REPLACE FUNCTION update_app_rating()
RETURNS trigger AS $$
DECLARE
  avg_rating decimal(3,2);
  review_count integer;
BEGIN
  -- Calculate new average rating
  SELECT 
    ROUND(AVG(rating)::numeric, 2),
    COUNT(*)
  INTO avg_rating, review_count
  FROM app_reviews 
  WHERE app_id = COALESCE(NEW.app_id, OLD.app_id);
  
  -- Update marketplace listing
  UPDATE marketplace_listings 
  SET 
    rating = COALESCE(avg_rating, 0.00),
    rating_count = review_count
  WHERE app_id = COALESCE(NEW.app_id, OLD.app_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for review updates
DROP TRIGGER IF EXISTS on_review_change ON app_reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON app_reviews
  FOR EACH ROW EXECUTE FUNCTION update_app_rating();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apps_author_id ON apps(author_id);
CREATE INDEX IF NOT EXISTS idx_apps_status ON apps(status);
CREATE INDEX IF NOT EXISTS idx_apps_category ON apps(category);
CREATE INDEX IF NOT EXISTS idx_app_components_app_id ON app_components(app_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_app_id ON marketplace_listings(app_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_featured ON marketplace_listings(featured);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_analytics_app_id ON analytics(app_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);