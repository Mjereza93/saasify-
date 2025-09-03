const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// This assumes you have a Supabase client configured and passed into this route.
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * @route   GET /api/overlays/:adId
 * @desc    Get all overlays for a specific ad
 * @access  Public
 */
router.get('/:adId', async (req, res) => {
  const { adId } = req.params;

  if (!adId) {
    return res.status(400).json({ error: 'Ad ID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('ad_overlays')
      .select('*')
      .eq('ad_id', adId);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching ad overlays:', error);
    res.status(500).json({ error: 'Failed to fetch ad overlays' });
  }
});

/**
 * @route   POST /api/overlays/interactions
 * @desc    Record an interaction with an ad overlay
 * @access  Private
 */
router.post('/interactions', async (req, res) => {
  const { overlay_id, ad_id, interaction_type, interaction_value } = req.body;
  const userId = req.user?.id; // Assume user ID is available from auth middleware

  if (!overlay_id || !ad_id || !interaction_type) {
    return res.status(400).json({ error: 'Missing required interaction data' });
  }

  if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase
      .from('overlay_interactions')
      .insert({
        overlay_id,
        user_id: userId,
        ad_id,
        interaction_type,
        interaction_value,
      });

    if (error) throw error;

    res.status(201).json({ message: 'Interaction recorded successfully' });
  } catch (error) {
    console.error('Error recording interaction:', error);
    res.status(500).json({ error: 'Failed to record interaction' });
  }
});

module.exports = router;
