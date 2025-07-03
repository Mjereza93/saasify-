# 🚀 Supabase Setup Guide for VibeCodersHell

Follow these steps to set up your Supabase backend for the VibeCodersHell project:

## Step 1: Create Supabase Project

1. **Go to Supabase**: Visit [supabase.com](https://supabase.com)
2. **Sign up/Login**: Create an account or sign in
3. **Create New Project**: 
   - Click "New Project"
   - Choose your organization
   - Enter project name: `vibecodershell`
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"

## Step 2: Get Your Project Credentials

1. **Go to Settings**: Click the gear icon in the sidebar
2. **API Settings**: Click on "API" in the settings menu
3. **Copy Credentials**:
   - Copy your `Project URL`
   - Copy your `anon public` key (NOT the service_role key)

## Step 3: Configure Environment Variables

1. **Create .env.local file** in your project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up Database Schema

1. **Go to SQL Editor**: In your Supabase dashboard, click "SQL Editor"
2. **Create New Query**: Click "New Query"
3. **Run the following SQL** to create the users table and authentication triggers:

```sql
-- Create users table for VibeCodersHell
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (extends the users table)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for profiles table
CREATE POLICY "Profiles are viewable by users who created them" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile and user record on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update function to handle profile updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET 
    email = new.email,
    full_name = COALESCE(new.raw_user_meta_data->>'full_name', old.full_name),
    avatar_url = COALESCE(new.raw_user_meta_data->>'avatar_url', old.avatar_url),
    updated_at = NOW()
  WHERE id = new.id;
  
  UPDATE public.users
  SET 
    email = new.email,
    full_name = COALESCE(new.raw_user_meta_data->>'full_name', old.full_name),
    avatar_url = COALESCE(new.raw_user_meta_data->>'avatar_url', old.avatar_url),
    updated_at = NOW()
  WHERE id = new.id;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_user_update();
```

## Step 5: Configure Authentication Settings

1. **Go to Authentication**: Click "Authentication" in sidebar
2. **Settings**: Click "Settings" tab
3. **Configure Site URL**:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add the following:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/dashboard`

## Step 6: Set Up Google OAuth

1. **Enable Google Provider**:
   - In Authentication > Providers
   - Find "Google" and click to configure
   - Toggle "Enable sign in with Google"

2. **Get Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

3. **Configure in Supabase**:
   - Paste Google Client ID and Client Secret in Supabase
   - Save the configuration

## Step 7: Test the Setup

1. **Start Development Server**: Run `npm run dev`
2. **Visit Auth Pages**: 
   - Go to `http://localhost:3000/auth/login`
   - Go to `http://localhost:3000/auth/signup`
3. **Test Registration**: Try signing up with email and Google
4. **Check Database**: In Supabase, verify:
   - User appears in `auth.users`
   - Profile created in `profiles` and `users` tables
   - Data is properly synced

## 🎉 You're Ready!

Once completed, your VibeCodersHell platform will have:
- ✅ User authentication with email/password and Google OAuth
- ✅ Automatic profile creation
- ✅ Secure database with Row Level Security
- ✅ User data stored in `users` table with user_id, email, and created_at
- ✅ Modern, responsive authentication UI

## Production Deployment

For production deployment:
1. **Update Site URL**: Change to your production domain
2. **Add Production Redirect URLs**: Include your production callback URLs
3. **Update Google OAuth**: Add production domain to authorized origins
4. **Environment Variables**: Set production environment variables

## Troubleshooting

**Common Issues:**
- **OAuth not working**: Check redirect URLs match exactly
- **Profile not created**: Verify triggers are created correctly
- **RLS errors**: Ensure policies are set up properly
- **Google sign-in fails**: Check Google Cloud Console configuration

**Need Help?**
- Check Supabase logs in the dashboard
- Verify environment variables are loaded correctly
- Test database connection in browser console
- Ensure Google OAuth credentials are correct