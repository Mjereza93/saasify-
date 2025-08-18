import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { ad_id, cta_url } = await request.json();

  if (!ad_id || !cta_url) {
    return NextResponse.json({ error: 'ad_id and cta_url are required' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('cta_clicks')
      .insert({
        ad_id,
        user_id: session.user.id,
        cta_url,
      });

    if (error) throw error;

    return NextResponse.json({ message: 'CTA click tracked successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error tracking CTA click:', error);
    return NextResponse.json({ error: 'Failed to track CTA click' }, { status: 500 });
  }
}
