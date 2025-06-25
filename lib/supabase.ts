import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'starter' | 'pro' | 'enterprise';
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface App {
  id: string;
  name: string;
  description: string | null;
  author_id: string;
  category: string;
  status: 'draft' | 'review' | 'published' | 'suspended';
  config: any;
  preview_image: string | null;
  domain_slug: string | null;
  is_template: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  author?: Profile;
  marketplace_listing?: MarketplaceListing;
  components?: AppComponent[];
}

export interface AppComponent {
  id: string;
  app_id: string;
  component_type: string;
  component_config: any;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  z_index: number;
  created_at: string;
}

export interface MarketplaceListing {
  id: string;
  app_id: string;
  price: number;
  commission_rate: number;
  featured: boolean;
  downloads: number;
  views: number;
  rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  app?: App;
}

export interface Transaction {
  id: string;
  buyer_id: string | null;
  seller_id: string | null;
  app_id: string | null;
  listing_id: string | null;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripe_payment_intent_id: string | null;
  created_at: string;
  completed_at: string | null;
  // Relations
  buyer?: Profile;
  seller?: Profile;
  app?: App;
  listing?: MarketplaceListing;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'starter' | 'pro' | 'enterprise';
  stripe_subscription_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppReview {
  id: string;
  app_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  // Relations
  user?: Profile;
}

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return profile as Profile;
};

export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// App management functions
export const createApp = async (appData: Partial<App>) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('apps')
    .insert({
      ...appData,
      author_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as App;
};

export const getUserApps = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('apps')
    .select(`
      *,
      marketplace_listing:marketplace_listings(*)
    `)
    .eq('author_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data as App[];
};

export const getPublishedApps = async () => {
  const { data, error } = await supabase
    .from('apps')
    .select(`
      *,
      author:profiles(full_name),
      marketplace_listing:marketplace_listings(*)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as App[];
};

// Marketplace functions
export const createMarketplaceListing = async (appId: string, price: number) => {
  const { data, error } = await supabase
    .from('marketplace_listings')
    .insert({
      app_id: appId,
      price,
    })
    .select()
    .single();

  if (error) throw error;
  return data as MarketplaceListing;
};

export const getFeaturedApps = async () => {
  const { data, error } = await supabase
    .from('marketplace_listings')
    .select(`
      *,
      app:apps(
        *,
        author:profiles(full_name)
      )
    `)
    .eq('featured', true)
    .order('downloads', { ascending: false })
    .limit(6);

  if (error) throw error;
  return data as MarketplaceListing[];
};

// Analytics functions
export const trackAppView = async (appId: string) => {
  const user = await getCurrentUser();
  
  const { error } = await supabase
    .from('analytics')
    .insert({
      app_id: appId,
      event_type: 'view',
      user_id: user?.id || null,
    });

  if (error) console.error('Failed to track view:', error);
};

export const getAppAnalytics = async (appId: string) => {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('app_id', appId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Admin functions (require admin role)
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Profile[];
};

export const getAllTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      buyer:profiles!buyer_id(full_name, email),
      seller:profiles!seller_id(full_name, email),
      app:apps(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
};