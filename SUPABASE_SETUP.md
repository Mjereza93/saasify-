# 🚀 Supabase Setup Guide for SaaSify AI

Follow these steps to set up your Supabase backend:

## Step 1: Create Supabase Project

1. **Go to Supabase**: Visit [supabase.com](https://supabase.com)
2. **Sign up/Login**: Create an account or sign in
3. **Create New Project**: 
   - Click "New Project"
   - Choose your organization
   - Enter project name: `saasify-ai`
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

1. **Update .env.local**: Replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Run Database Migration

1. **Go to SQL Editor**: In your Supabase dashboard, click "SQL Editor"
2. **Create New Query**: Click "New Query"
3. **Copy Migration**: Copy the entire content from `supabase/migrations/20250623194702_humble_wildflower.sql`
4. **Paste and Run**: Paste the SQL and click "Run"

## Step 5: Configure Authentication

1. **Go to Authentication**: Click "Authentication" in sidebar
2. **Settings**: Click "Settings" tab
3. **Configure**:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`
   - **Email Confirmation**: Disable for development (enable for production)

## Step 6: Test the Setup

1. **Start Development Server**: Run `npm run dev`
2. **Visit Auth Page**: Go to `http://localhost:3000/auth`
3. **Create Account**: Try signing up with a test email
4. **Check Database**: In Supabase, go to "Table Editor" and verify:
   - User appears in `auth.users`
   - Profile created in `profiles` table

## 🎉 You're Ready!

Once completed, your SaaSify AI platform will have:
- ✅ User authentication and profiles
- ✅ Complete database schema for apps, marketplace, transactions
- ✅ Row-level security policies
- ✅ Automated triggers and functions
- ✅ Analytics and review systems

## Next Steps

After Supabase is working:
1. **Stripe Integration** - Set up payment processing
2. **AI Integrations** - Connect OpenAI and Anthropic
3. **App Builder** - Make the drag-and-drop builder functional
4. **Deployment** - Set up Netlify integration

## Troubleshooting

**Common Issues:**
- **Migration fails**: Make sure you copied the entire SQL file
- **Auth not working**: Check your environment variables
- **CORS errors**: Verify your Site URL in Supabase settings
- **RLS errors**: Ensure policies are created correctly

**Need Help?**
- Check Supabase logs in the dashboard
- Verify environment variables are loaded
- Test database connection in browser console