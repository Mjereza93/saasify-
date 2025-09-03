import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english';
const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

// Simple heuristic for CTR prediction (stub for a real ML model)
function predictCtr(ad: { title: string; description: string | null }): number {
  let score = 0.01; // Base CTR
  if (ad.title.length > 30) score += 0.005;
  if (ad.description && ad.description.length > 50) score += 0.008;
  return Math.min(score, 0.1); // Cap CTR at 10%
}

async function analyzeSentiment(texts: string[]): Promise<{ label: string, score: number }> {
    if (!texts || texts.length === 0) {
        return { label: 'Neutral', score: 0 };
    }
  try {
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_TOKEN}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: texts }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Hugging Face API Error:", errorBody);
        throw new Error(`Hugging Face API failed with status: ${response.status}`);
    }

    const results = await response.json();

    // Aggregate the results
    let totalScore = 0;
    results.forEach((res: any[]) => {
        const positiveScore = res.find(r => r.label === 'POSITIVE')?.score || 0;
        const negativeScore = res.find(r => r.label === 'NEGATIVE')?.score || 0;
        totalScore += positiveScore - negativeScore;
    });

    const averageScore = totalScore / texts.length;
    let label = 'Neutral';
    if (averageScore > 0.1) label = 'Positive';
    if (averageScore < -0.1) label = 'Negative';

    return { label, score: averageScore };
  } catch (error) {
      console.error("Error in analyzeSentiment:", error);
      return { label: 'Error', score: 0 };
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { adId } = await request.json();

  if (!adId) {
    return NextResponse.json({ error: 'adId is required' }, { status: 400 });
  }

  try {
    // 1. Fetch the ad and its comments
    const { data: adData, error: adError } = await supabase.from('ads').select('title, description, comments ( comment_text )').eq('id', adId).single();
    if (adError) throw adError;

    // 2. Perform AI analysis
    const comments = adData.comments.map(c => c.comment_text);
    const sentiment = await analyzeSentiment(comments);
    const predictedCtr = predictCtr(adData);

    // 3. Save the results to our ai_ad_analytics table
    const { error: saveError } = await supabase.from('ai_ad_analytics').upsert({
      ad_id: adId,
      comment_sentiment_score: sentiment.score,
      comment_sentiment_label: sentiment.label,
      predicted_ctr: predictedCtr,
      last_analyzed_at: new Date().toISOString(),
    });

    if (saveError) throw saveError;

    return NextResponse.json({ message: 'AI analysis complete and saved.', analysis: { sentiment, predictedCtr } });
  } catch (error) {
    console.error('Error performing AI analysis:', error);
    return NextResponse.json({ error: 'Failed to perform AI analysis' }, { status: 500 });
  }
}
