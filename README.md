# VibeCodersHell

A modern development platform with clean design, powerful authentication, and seamless user experience. Built with Next.js, Tailwind CSS, and Supabase.

## ✨ Features

- 🔐 **Secure Authentication** - Email/password and Google OAuth integration
- 🎨 **Modern Design** - Clean, responsive UI built with Tailwind CSS
- ⚡ **Lightning Fast** - Optimized performance with Next.js 13
- 🔒 **Row Level Security** - Secure database with Supabase RLS
- 📱 **Mobile Responsive** - Beautiful design across all devices
- 🎯 **User-Friendly** - Intuitive navigation and user experience

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibecodershell
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Set up Supabase**
   - Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

- **Framework**: Next.js 13 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **TypeScript**: Full type safety
- **Deployment**: Vercel/Netlify ready

## 📁 Project Structure

```
├── app/                 # Next.js 13 app directory
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   ├── templates/      # Template gallery
│   └── globals.css     # Global styles
├── components/         # Reusable components
│   ├── ui/            # Base UI components
│   └── Navigation.tsx  # Main navigation
├── lib/               # Utility functions
│   ├── supabase.ts    # Supabase client & functions
│   └── auth.tsx       # Auth context
└── supabase/          # Database migrations
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Schema

The project includes a `users` table that stores:
- `user_id` (UUID, primary key)
- `email` (TEXT, unique)
- `full_name` (TEXT, optional)
- `avatar_url` (TEXT, optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🎯 Key Features

### Authentication Flow
- **Sign Up**: Create account with email/password or Google
- **Sign In**: Login with existing credentials
- **OAuth**: Google sign-in integration
- **Redirect**: Automatic redirect to dashboard after login
- **Security**: Row Level Security (RLS) policies

### Navigation
- **Sticky Header**: Persistent navigation across all pages
- **Logo**: VibeCodersHell branding
- **Links**: Home, Templates, Dashboard, Logout
- **Responsive**: Mobile-friendly hamburger menu

### User Dashboard
- **Profile Display**: User information and avatar
- **Quick Stats**: Project and activity statistics
- **Quick Actions**: Easy access to main features
- **Recent Activity**: Timeline of user actions

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables
4. Set up redirect rules for SPA

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 **Documentation**: Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- 🐛 **Issues**: Report bugs on GitHub Issues
- 💬 **Discussions**: Join our community discussions

---

Built with ❤️ for the developer community