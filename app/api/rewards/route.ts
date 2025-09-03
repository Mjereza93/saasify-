import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session }, } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('rewards')
    .select('points, daily_views_count')
    .eq('user_id', session.user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error fetching rewards:', error);
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
  }

  return NextResponse.json(data || { points: 0, daily_views_count: 0 });
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session }, } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase.rpc('handle_ad_view_reward', {
    user_id_in: session.user.id,
  });

  if (error) {
    console.error('Error handling ad view reward:', error);
    return NextResponse.json({ error: 'Failed to process ad view' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Reward processed successfully' });
}
