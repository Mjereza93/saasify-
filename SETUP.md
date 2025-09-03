# 🚀 Project Setup Guide

Follow these steps to set up the application.

## 1. Supabase Setup

### 1.1. Create Supabase Project
1.  Go to [supabase.com](https://supabase.com) and sign in.
2.  Click "New Project" and give it a name.
3.  Save your database password securely.
4.  Choose a region close to your users.

### 1.2. Get Project Credentials
1.  In your project dashboard, go to **Settings > API**.
2.  Copy your **Project URL** and **anon public key**.

### 1.3. Run Database Migration
1.  Go to the **SQL Editor** in your Supabase dashboard.
2.  Click **New Query**.
3.  Copy the entire content from `supabase/migrations/20250813083542_create_initial_schema.sql`.
4.  Paste the SQL and click **Run**.

### 1.4. Configure Authentication
1.  Go to **Authentication > Settings**.
2.  Set the **Site URL** to `http://localhost:3000` for local development.
3.  Add `http://localhost:3000/auth/callback` to the **Redirect URLs**.

## 2. Backblaze B2 Setup

### 2.1. Create a B2 Bucket
1.  Go to [backblaze.com](https://www.backblaze.com/b2/cloud-storage.html) and sign in.
2.  In the B2 Cloud Storage section, go to **Buckets**.
3.  Click **Create a Bucket**.
4.  Give your bucket a unique name.
5.  Make sure the bucket is **Public**.
6.  Note the **Bucket Name** and **Region** (e.g., `us-west-001`).

### 2.2. Get Application Keys
1.  Go to **App Keys**.
2.  Click **Add a New Application Key**.
3.  Give the key a name.
4.  Allow access to your new bucket.
5.  Click **Create New Key**.
6.  Copy the **keyID** (Access Key ID) and **applicationKey** (Secret Access Key).

## 3. Cloudflare Stream Setup

### 3.1. Get API Token
1.  Go to your Cloudflare dashboard.
2.  Go to **My Profile > API Tokens**.
3.  Click **Create Token**.
4.  Use the "Edit Cloudflare Stream" template.
5.  Give the token a name.
6.  Copy the generated API token.

## 4. Environment Variables

Create a `.env.local` file in the root of your project and add the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Backblaze B2
B2_REGION=<your-b2-bucket-region>
B2_BUCKET_NAME=<your-b2-bucket-name>
B2_ACCESS_KEY_ID=<your-b2-access-key-id>
B2_SECRET_ACCESS_KEY=<your-b2-secret-access-key>

# Cloudflare
CLOUDFLARE_API_TOKEN=<your-cloudflare-api-token>
```

Replace the placeholder values with your actual credentials.

## 5. Start the Application

1.  Install the dependencies: `npm install`
2.  Start the development server: `npm run dev`

Your application should now be running at `http://localhost:3000`.
You can access the ad feed at `http://localhost:3000/feed`.
