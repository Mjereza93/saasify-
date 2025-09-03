import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'trending'; // Default to trending

  let query;

  switch (type) {
    case 'featured':
      query = supabase
        .from('featured_ads')
        .select(`
          cpm,
          ad:ads (
            *,
            profiles (*)
          )
        `)
        .filter('start_date', 'lte', new Date().toISOString())
        .filter('end_date', 'gte', new Date().toISOString());
      break;
    case 'editors_pick':
      query = supabase
        .from('editors_pick')
        .select(`
          ad:ads (
            *,
            profiles (*)
          )
        `);
      break;
    case 'trending':
    default:
      // We query the materialized view for trending ads
      query = supabase
        .from('trending_ads')
        .select(`
          score,
          ad:ads (
            *,
            profiles (*)
          )
        `);
      break;
  }

  try {
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // The data structure is slightly different for each query, so we normalize it
    const ads = data.map(item => item.ad);

    return NextResponse.json(ads);
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json({ error: `Failed to fetch ${type} feed` }, { status: 500 });
  }
}
