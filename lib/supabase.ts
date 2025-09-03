import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Ad {
  id: string;
  user_id: string;
  video_url: string;
  thumbnail_url: string;
  title: string;
  description: string | null;
  cta_link: string | null;
  cta_text: string | null;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: Profile;
}

export interface Like {
  ad_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  ad_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles: Profile;
}

// Ad feed functions
export const getAds = async () => {
  const { data, error } = await supabase
    .from('ads')
    .select(`
      *,
      profiles (
        *
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Ad[];
};

// Engagement functions
export const likeAd = async (adId: string, userId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .insert({ ad_id: adId, user_id: userId });

  if (error) throw error;
  return data;
};

export const unlikeAd = async (adId: string, userId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .eq('ad_id', adId)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

export const addComment = async (adId: string, userId: string, comment: string) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({ ad_id: adId, user_id: userId, comment });

  if (error) throw error;
  return data;
};

export const incrementView = async (adId: string) => {
  const { error } = await supabase.rpc('increment_views', { ad_id_to_update: adId });

  if (error) throw error;
};