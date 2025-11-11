# NayaDisha - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Configure Google OAuth in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `sybpdloxirehafzepvda`
3. Navigate to **Authentication** → **Providers**
4. Enable **Google** provider
5. Add your Google OAuth credentials:
   - Get credentials from: https://console.cloud.google.com
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://sybpdloxirehafzepvda.supabase.co/auth/v1/callback`

### Step 2: Run the Development Server

```bash
npm run dev
```

The app will start at: http://localhost:3000

### Step 3: Test the Application

1. **Landing Page** (http://localhost:3000)
   - Select a language from dropdown
   - Click "Start Learning"

2. **Login** (http://localhost:3000/login)
   - Click "Sign in with Google"
   - Authenticate with your Google account

3. **Dashboard** (http://localhost:3000/dashboard)
   - View your confidence score and XP
   - Click "Start Learning" to go to skill path

4. **Skill Path** (http://localhost:3000/skill-path)
   - See vertical node tree
   - Click on active nodes to start lessons

5. **Lesson** (http://localhost:3000/lesson/3)
   - View split-screen content
   - Toggle between languages
   - Click "Take Quiz"

6. **Quiz** (http://localhost:3000/quiz/3)
   - Answer MCQ questions
   - Earn XP rewards
   - See completion animation

7. **AI Mentor** (http://localhost:3000/mentor)
   - Chat with AI mentor
   - Use quick suggestions
   - Get learning guidance

8. **Profile** (http://localhost:3000/profile)
   - View your stats
   - Check skill progress
   - Continue learning

## 🎨 Design Features

- **Color Scheme**: Deep Blue (#2956D9) + Yellow (#FFC947)
- **UI Style**: Clean, rounded cards with shadows
- **Typography**: Bold headings, readable body text
- **Responsive**: Works on desktop and mobile

## 🔐 Authentication

- **Login**: Google OAuth only
- **Protected Routes**: All pages except `/` and `/login`
- **Auto-redirect**: Logged-in users → dashboard, logged-out → login
- **Logout**: Available on dashboard and profile pages

## 📁 Project Structure

```
app/
├── page.tsx              # Landing page
├── login/page.tsx        # Login page
├── dashboard/page.tsx    # Dashboard
├── skill-path/page.tsx   # Skill tree
├── lesson/[id]/page.tsx  # Lesson viewer
├── quiz/[id]/page.tsx    # Quiz interface
├── mentor/page.tsx       # AI mentor chat
└── profile/page.tsx      # User profile

lib/
└── supabaseClient.js     # Supabase configuration

hooks/
└── useUser.js            # User authentication hook
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript + JavaScript

## 📝 Environment Variables

Already configured in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://sybpdloxirehafzepvda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎯 Key Features Implemented

✅ Google OAuth authentication
✅ Protected routes with auto-redirect
✅ Confidence score visualization
✅ XP progress tracking
✅ Vertical skill path with node states
✅ Bilingual lesson content
✅ Interactive quiz system
✅ AI mentor chat interface
✅ User profile with stats
✅ Consistent UI/UX across all pages

## 🔄 Next Development Steps

1. **Database Schema**
   - Create tables for users, lessons, quizzes, progress
   - Set up Row Level Security (RLS) policies

2. **Content Management**
   - Add real lesson content
   - Create quiz question bank
   - Add more language translations

3. **AI Integration**
   - Connect mentor to OpenAI/Anthropic API
   - Implement context-aware responses
   - Add conversation history

4. **Gamification**
   - Add achievement badges
   - Create leaderboards
   - Implement streak tracking

5. **Analytics**
   - Track user progress
   - Monitor engagement metrics
   - Generate learning insights

## 🐛 Troubleshooting

**Issue**: Google OAuth not working
- **Solution**: Make sure you've enabled Google provider in Supabase and added correct redirect URIs

**Issue**: Pages not loading
- **Solution**: Check that `.env.local` exists and has correct Supabase credentials

**Issue**: TypeScript errors
- **Solution**: Run `npm install` to ensure all dependencies are installed

## 📞 Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review Next.js docs: https://nextjs.org/docs
3. Check the SETUP_SUMMARY.md file for detailed configuration

---

**Happy Learning! 🎓**
