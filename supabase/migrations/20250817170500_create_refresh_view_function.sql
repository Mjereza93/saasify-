-- This function allows refreshing any materialized view by name.
-- It's a helper to be called from the API or a scheduled job.
CREATE OR REPLACE FUNCTION refresh_materialized_view(view_name TEXT)
RETURNS void AS $$
BEGIN
    -- The 'CONCURRENTLY' option allows the view to be used while it's being refreshed.
    -- This requires the view to have a UNIQUE index.
    -- For simplicity, we'll omit it, but for production, you would add a UNIQUE index
    -- on user_id to the leaderboard view and use REFRESH MATERIALIZED VIEW CONCURRENTLY.
    EXECUTE 'REFRESH MATERIALIZED VIEW ' || quote_ident(view_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
