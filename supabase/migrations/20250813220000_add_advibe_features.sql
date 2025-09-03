-- Add geotag column to ads table
ALTER TABLE ads ADD COLUMN IF NOT EXISTS geotag JSONB;
CREATE INDEX IF NOT EXISTS ads_geotag_idx ON ads USING GIN (geotag);

-- Featured Ads table
CREATE TABLE IF NOT EXISTS featured_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  cpm DECIMAL(10, 2) NOT NULL, -- e.g., 9.00 for $9 CPM
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Editor’s Pick table
CREATE TABLE IF NOT EXISTS editors_pick (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  curated_by UUID REFERENCES auth.users(id), -- Admin who picked
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trending Ads (using a materialized view for performance)
DROP MATERIALIZED VIEW IF EXISTS trending_ads;
CREATE MATERIALIZED VIEW trending_ads AS
SELECT
  ads.id as ad_id,
  (ads.likes_count * 0.4) + (ads.views_count * 0.3) + (ads.comments_count * 0.3) AS score
FROM ads
ORDER BY score DESC
LIMIT 100;

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  daily_views_count INTEGER DEFAULT 0
);

-- Function to update rewards on ad view
CREATE OR REPLACE FUNCTION handle_ad_view_reward(user_id_in UUID)
RETURNS void AS $$
DECLARE
  last_viewed_date DATE;
  today_date DATE;
  current_daily_views INT;
BEGIN
  -- Get today's state for the user
  SELECT last_viewed_at::DATE, daily_views_count INTO last_viewed_date, current_daily_views
  FROM rewards WHERE user_id = user_id_in;

  today_date := now()::DATE;

  -- Check if this is the first view of the day or if the record doesn't exist
  IF last_viewed_date IS NULL OR last_viewed_date < today_date THEN
    -- First view of the day, reset daily count and award a point
    INSERT INTO rewards (user_id, points, daily_views_count, last_viewed_at)
    VALUES (user_id_in, 1, 1, now())
    ON CONFLICT (user_id) DO UPDATE
    SET daily_views_count = 1,
        points = rewards.points + 1,
        last_viewed_at = now();
  ELSE
    -- It's the same day, check if the daily limit has been reached
    IF current_daily_views < 50 THEN
      -- Increment daily count and award a point
      UPDATE rewards
      SET daily_views_count = daily_views_count + 1,
          points = points + 1,
          last_viewed_at = now()
      WHERE user_id = user_id_in;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS for new tables
ALTER TABLE featured_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE editors_pick ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Policies for new tables
CREATE POLICY "Public can view featured ads" ON featured_ads FOR SELECT USING (true);
CREATE POLICY "Public can view editor's picks" ON editors_pick FOR SELECT USING (true);
CREATE POLICY "Users can view their own rewards" ON rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Server can update rewards" ON rewards FOR UPDATE USING (true); -- Or more restrictive role
