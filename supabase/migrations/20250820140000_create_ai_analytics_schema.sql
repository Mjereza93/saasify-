-- Create a new table to store AI-generated analytics for ads
CREATE TABLE IF NOT EXISTS ai_ad_analytics (
  ad_id UUID PRIMARY KEY REFERENCES ads(id) ON DELETE CASCADE,
  comment_sentiment_score NUMERIC(4, 3), -- e.g., 0.987, -0.543
  comment_sentiment_label TEXT, -- e.g., 'Positive', 'Negative', 'Neutral'
  predicted_ctr NUMERIC(5, 4), -- e.g., 0.0250 for 2.50%
  last_analyzed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create a function to update the timestamp automatically
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ai_ad_analytics_updated_at
BEFORE UPDATE ON ai_ad_analytics
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- Enable RLS
ALTER TABLE ai_ad_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for the new table
-- Allow ad owners to view the analytics for their own ads
CREATE POLICY "Ad owners can view their AI analytics" ON ai_ad_analytics
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM ads WHERE id = ad_id)
  );

-- Allow server-side processes to update analytics (e.g., a trusted role)
CREATE POLICY "Server can update AI analytics" ON ai_ad_analytics
  FOR INSERT, UPDATE USING (true); -- In production, you'd restrict this to a service_role
