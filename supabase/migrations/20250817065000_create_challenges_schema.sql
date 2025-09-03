-- Create custom type for challenge types
CREATE TYPE challenge_type AS ENUM ('watch_ads', 'get_likes', 'get_views');

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type challenge_type NOT NULL,
  goal INTEGER NOT NULL,
  reward_points INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_challenges table to track user progress
CREATE TABLE IF NOT EXISTS user_challenges (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  is_complete BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, challenge_id)
);

-- Add some sample challenges
INSERT INTO challenges (name, description, type, goal, reward_points) VALUES
('Daily Watcher', 'Watch 10 ads in a single day.', 'watch_ads', 10, 50),
('Getting Popular', 'Receive 5 likes on one of your ads.', 'get_likes', 5, 100),
('Viral Sensation', 'Reach 1,000 views on one of your ads.', 'get_views', 1000, 250);

-- Enable RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view active challenges" ON challenges FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view their own challenge progress" ON user_challenges FOR SELECT USING (auth.uid() = user_id);

-- Function to update challenge progress and award points
CREATE OR REPLACE FUNCTION update_challenge_progress(
    user_id_in UUID,
    challenge_type_in challenge_type,
    progress_increment INT
)
RETURNS void AS $$
DECLARE
    challenge_record RECORD;
    user_challenge_record RECORD;
BEGIN
    -- Find all active challenges of the given type
    FOR challenge_record IN SELECT * FROM challenges WHERE type = challenge_type_in AND is_active = true
    LOOP
        -- Get the user's current progress on this challenge
        SELECT * INTO user_challenge_record FROM user_challenges
        WHERE user_id = user_id_in AND challenge_id = challenge_record.id;

        -- If the user hasn't started this challenge yet, create a record
        IF user_challenge_record IS NULL THEN
            INSERT INTO user_challenges(user_id, challenge_id, progress)
            VALUES (user_id_in, challenge_record.id, 0)
            RETURNING * INTO user_challenge_record;
        END IF;

        -- If the challenge is not yet complete, update the progress
        IF user_challenge_record.is_complete = false THEN
            UPDATE user_challenges
            SET progress = user_challenges.progress + progress_increment, updated_at = now()
            WHERE user_id = user_id_in AND challenge_id = challenge_record.id
            RETURNING * INTO user_challenge_record;

            -- Check if the challenge is now complete
            IF user_challenge_record.progress >= challenge_record.goal THEN
                UPDATE user_challenges
                SET is_complete = true, completed_at = now()
                WHERE user_id = user_id_in AND challenge_id = challenge_record.id;

                -- Award points to the user
                UPDATE rewards
                SET points = rewards.points + challenge_record.reward_points
                WHERE user_id = user_id_in;
            END IF;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
