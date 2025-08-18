-- Add a JSONB column to the ads table to store floating CTA configuration
ALTER TABLE ads ADD COLUMN IF NOT EXISTS floating_cta_config JSONB;

-- Create a new table to track clicks on these CTAs
CREATE TABLE IF NOT EXISTS cta_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Keep click data if user is deleted
  cta_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_cta_clicks_ad_id ON cta_clicks(ad_id);
CREATE INDEX IF NOT EXISTS idx_cta_clicks_user_id ON cta_clicks(user_id);

-- Enable RLS
ALTER TABLE cta_clicks ENABLE ROW LEVEL SECURITY;

-- Policies for the new table
-- Allow users to insert their own clicks (the API will enforce this)
CREATE POLICY "Users can record their own CTA clicks" ON cta_clicks
  FOR INSERT WITH CHECK (true);

-- Allow ad owners to view clicks on their ads
CREATE POLICY "Ad owners can view their CTA clicks" ON cta_clicks
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM ads WHERE id = ad_id)
  );
