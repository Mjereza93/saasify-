# TikTok-style AI Ad Platform

This project is a boilerplate for a TikTok-style application with AI-powered ad generation.

## Project Structure

```
.
├── app
│   ├── api
│   │   └── upload
│   │       └── route.ts
│   ├── feed
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── feed
│   │   └── AdPlayer.tsx
│   └── ui
│       ├── ... (shadcn/ui components)
├── lib
│   └── supabase.ts
├── supabase
│   └── migrations
│       └── 20250813083542_create_initial_schema.sql
├── ReactNativeVideoUpload.tsx
├── SETUP.md
├── package.json
└── ...
```

## Features

- **Ad Feed:** A vertically scrollable feed of video ads, similar to TikTok.
- **Video Upload:** A system for uploading videos, which are then transcoded and stored using Backblaze B2 and Cloudflare Stream.
- **Supabase Backend:** A Supabase backend for managing users, ads, and engagement.
- **Gesture Navigation:** Swipe-up/down to navigate between videos and tap to pause/play.

## Getting Started

Follow the instructions in `SETUP.md` to get the project up and running.