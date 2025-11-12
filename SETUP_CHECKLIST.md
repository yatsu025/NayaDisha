# ✅ NayaDisha Setup Checklist

## 📦 Installation

- [x] Install dependencies: `npm install`
- [x] Supabase client installed
- [x] Zustand installed
- [x] Framer Motion installed
- [x] Stripe packages installed

## 🗄️ Database Setup

- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Copy content from `supabase/schema.sql`
- [ ] Run the SQL script
- [ ] Verify tables created:
  - [ ] users
  - [ ] user_tokens
  - [ ] lessons
  - [ ] translations
  - [ ] user_progress
  - [ ] mentor_requests
  - [ ] game_progress
- [ ] Check sample lessons inserted
- [ ] Verify RLS policies enabled
- [ ] Test trigger (signup creates profile)

## 🔐 Authentication

- [x] Email/Password enabled (default)
- [ ] Google OAuth configured (optional)
  - [ ] Google Cloud Console setup
  - [ ] OAuth credentials created
  - [ ] Redirect URI added
  - [ ] Credentials added to Supabase

## 🌐 Translation Setup

- [ ] LibreTranslate API accessible
- [ ] Test translation endpoint
- [ ] (Optional) Self-host LibreTranslate
- [ ] Update LIBRETRANSLATE_URL if needed

## 🎯 Pages Created

- [x] Landing page (`/`)
- [x] Choose language (`/choose-language`)
- [x] Login (`/login`)
- [x] Onboarding (`/onboarding`)
- [x] Dashboard (`/dashboard`)
- [x] Priority (`/priority`)
- [x] Unpriority (`/unpriority`)
- [x] Game (`/game`)
- [x] Mentor (`/mentor`)
- [x] Profile (`/profile`)
- [x] Purchase (`/purchase`)
- [x] Lesson viewer (`/lesson/[id]`)
- [x] Quiz (`/quiz/[id]`)

## 🧩 Components

- [x] Navbar
- [x] XPProgressBar
- [x] (Reusing existing components)

## 🔧 API Routes

- [x] `/api/translate` - Text translation
- [x] `/api/translate/lesson` - Lesson translation
- [x] `/api/mentor` - AI Mentor logic
- [ ] `/api/purchase` - Stripe checkout (TODO)
- [ ] `/api/stripe-webhook` - Payment webhook (TODO)

## 🎮 Features

- [x] Multilingual support (10+ languages)
- [x] Skill prioritization
- [x] XP and leveling system
- [x] Real-time XP updates
- [x] Token system
- [x] AI Mentor (rule-based)
- [x] Game with quizzes
- [x] Progress tracking
- [ ] Badge system (TODO)
- [ ] Stripe payments (TODO)

## 🧪 Testing

- [ ] Run app: `npm run dev`
- [ ] Test landing page
- [ ] Test language selection
- [ ] Test signup flow
- [ ] Test onboarding
- [ ] Test dashboard
- [ ] Test priority lessons
- [ ] Test unpriority lessons
- [ ] Test game
- [ ] Test mentor (free)
- [ ] Test mentor (paid - check token deduction)
- [ ] Test profile
- [ ] Test purchase page
- [ ] Test translation caching
- [ ] Test XP updates
- [ ] Test logout

## 📱 Responsive Design

- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)

## 🚀 Deployment (Optional)

- [ ] Deploy to Vercel
- [ ] Update Supabase redirect URLs
- [ ] Update Google OAuth redirect URLs
- [ ] Test production build
- [ ] Configure custom domain

## 📊 Monitoring

- [ ] Check Supabase logs
- [ ] Monitor API usage
- [ ] Track translation cache hits
- [ ] Monitor token usage

## 🎉 Launch

- [ ] All features working
- [ ] Database populated
- [ ] Authentication working
- [ ] Translations working
- [ ] XP system working
- [ ] Token system working
- [ ] UI polished
- [ ] Mobile responsive
- [ ] Ready for users!

---

## 🔥 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Important Files

- `supabase/schema.sql` - Database schema
- `.env.local` - Environment variables
- `NAYADISHA_COMPLETE_GUIDE.md` - Full documentation
- `GOOGLE_OAUTH_SETUP.md` - Google OAuth guide

---

**Status:** 🟢 Core features complete, ready for testing!
