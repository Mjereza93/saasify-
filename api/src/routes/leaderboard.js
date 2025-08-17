const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// This assumes you have a Supabase client configured and passed into this route.
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * @route   GET /api/leaderboard
 * @desc    Get the creator leaderboard rankings
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // In a production environment, this REFRESH command should be run by a
    // scheduled job (e.g., a cron job using Supabase Edge Functions)
    // to avoid a delay on the first request after a while.
    // For simplicity here, we can refresh it on request.
    await supabase.rpc('refresh_materialized_view', { view_name: 'leaderboard' });

    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('rank', { ascending: true })
      .limit(100); // Get top 100 creators

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// We need to create the RPC function for refreshing the view
// This should be in a migration file, but adding it here for context.
/*
  -- Migration file content:
  CREATE OR REPLACE FUNCTION refresh_materialized_view(view_name TEXT)
  RETURNS void AS $$
  BEGIN
      REFRESH MATERIALIZED VIEW CONCURRENTLY view_name;
  END;
  $$ LANGUAGE plpgsql;
*/

module.exports = router;
