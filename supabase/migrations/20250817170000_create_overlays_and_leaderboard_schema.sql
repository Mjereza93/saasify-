-- Create custom type for overlay types
CREATE TYPE overlay_type AS ENUM ('cta', 'poll');

-- Create ad_overlays table
CREATE TABLE IF NOT EXISTS ad_overlays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE NOT NULL,
  type overlay_type NOT NULL,
  config JSONB NOT NULL,
  start_time_seconds INTEGER NOT NULL,
  end_time_seconds INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create overlay_interactions table
CREATE TABLE IF NOT EXISTS overlay_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  overlay_id UUID REFERENCES ad_overlays(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Keep interaction even if user is deleted
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL, -- e.g., 'click', 'vote'
  interaction_value TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add a placeholder revenue column to profiles for leaderboard calculation
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_revenue DECIMAL(10, 2) DEFAULT 0.00;

-- Create leaderboard materialized view
-- This view calculates a score for each creator and ranks them.
-- It should be refreshed periodically (e.g., with a cron job).
DROP MATERIALIZED VIEW IF EXISTS leaderboard;
CREATE MATERIALIZED VIEW leaderboard AS
WITH user_stats AS (
  SELECT
    p.id as user_id,
    p.username,
    p.avatar_url,
    p.total_revenue,
    COALESCE(SUM(a.views_count), 0) as total_views,
    COALESCE(SUM(a.likes_count), 0) as total_likes
  FROM
    profiles p
  LEFT JOIN
    ads a ON p.id = a.user_id
  GROUP BY
    p.id
)
SELECT
  user_id,
  username,
  avatar_url,
  total_views,
  total_likes,
  total_revenue,
  -- Leaderboard Score Formula: 0.4*views + 0.3*likes + 0.3*revenue
  (0.4 * total_views) + (0.3 * total_likes) + (0.3 * total_revenue) AS score,
  ROW_NUMBER() OVER (ORDER BY (0.4 * total_views) + (0.3 * total_likes) + (0.3 * total_revenue) DESC) as rank
FROM
  user_stats
ORDER BY
  score DESC;

-- Enable RLS
ALTER TABLE ad_overlays ENABLE ROW LEVEL SECURITY;
ALTER TABLE overlay_interactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view ad overlays" ON ad_overlays FOR SELECT USING (true);
CREATE POLICY "Users can create overlays for their own ads" ON ad_overlays FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM ads WHERE id = ad_id));

CREATE POLICY "Users can record their own interactions" ON overlay_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can view interactions" ON overlay_interactions FOR SELECT USING (true); -- Or make it more restrictive
