const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// This assumes you have a Supabase client configured and passed into this route
// For example, via app.use('/challenges', challengesRouter(supabase));
// It also assumes you have middleware that adds the user's ID to the request object, e.g., req.user.id

// Initialize Supabase client (replace with your actual client)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * @route   GET /api/challenges
 * @desc    Get all active challenges and the user's progress
 * @access  Private
 */
router.get('/', async (req, res) => {
  // Assume user ID is available on req.user from auth middleware
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // This query fetches all active challenges and LEFT JOINs the user's specific progress.
    // This way, the user sees all available challenges, and their progress if they've started them.
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        id,
        name,
        description,
        type,
        goal,
        reward_points,
        user_challenges (
          progress,
          is_complete,
          completed_at
        )
      `)
      .eq('is_active', true)
      .eq('user_challenges.user_id', userId); // Filter the join table

    if (error) {
      // The .eq on the joined table can cause an error if the user has no progress
      // on any challenges. We can handle this gracefully.
      if (error.code === 'PGRST116') { // No rows found in the joined table
        const { data: challengesOnly, error: challengesError } = await supabase
            .from('challenges')
            .select('*')
            .eq('is_active', true);
        if (challengesError) throw challengesError;
        return res.json(challengesOnly.map(c => ({ ...c, user_challenges: [] })));
      }
      throw error;
    }

    // The result will be an array of challenges, each with an array of user_challenges.
    // Since we filtered by user_id, this inner array will have at most one item.
    // We can flatten this for a cleaner API response.
    const challengesWithProgress = data.map(challenge => {
        const userProgress = challenge.user_challenges[0] || { progress: 0, is_complete: false };
        // delete challenge.user_challenges; // clean up
        return { ...challenge, ...userProgress };
    });

    res.json(challengesWithProgress);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

module.exports = router;
