# 🎓 NayaDisha - Complete Setup Guide

## 🌟 Project Overview

**NayaDisha** is an AI-powered multilingual learning platform that removes language barriers for learners. Built with Next.js 14, Supabase, and AI translation.

### Key Features
- 🌐 **Multilingual Learning** - Learn in 10+ Indian languages
- 🎮 **Gamified Experience** - XP, levels, badges
- 🧠 **AI Mentor** - Personalized guidance (freemium model)
- 📊 **Progress Tracking** - Real-time XP and skill tracking
- 🎯 **Skill Prioritization** - Focus on what matters most
- 💰 **Token System** - Pay-per-use AI mentor

---

## 📁 Project Structure

```
naya/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── choose-language/page.tsx    # Language selection
│   ├── login/page.tsx              # Auth (Email + Google)
│   ├── onboarding/page.tsx         # Skill selection
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── priority/page.tsx           # Priority skills lessons
│   ├── unpriority/page.tsx         # Later skills lessons
│   ├── game/page.tsx               # Quiz game with XP
│   ├── mentor/page.tsx             # AI Mentor chat
│   ├── profile/page.tsx            # User profile
│   ├── purchase/page.tsx           # Buy tokens
│   ├── lesson/[id]/page.tsx        # Lesson viewer
│   ├── quiz/[id]/page.tsx          # Quiz interface
│   └── api/
│       ├── translate/route.js      # LibreTranslate API
│       ├── translate/lesson/route.js
│       └── mentor/route.js         # AI Mentor logic
├── components/
│   ├── Navbar.tsx                  # Main navigation
│   └── XPProgressBar.tsx           # XP display
├── store/
│   ├── useUser.js                  # User state (Zustand)
│   └── useLanguage.js              # Language state
├── utils/
│   ├── skills.js                   # Available skills
│   └── translate.js                # Translation helpers
├── supabase/
│   └── schema.sql                  # Database schema
└── lib/
    └── supabaseClient.js           # Supabase config
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

**Packages installed:**
- `@supabase/supabase-js` - Supabase client
- `zustand` - State management
- `framer-motion` - Animations
- `@stripe/stripe-js` & `stripe` - Payments (optional)

### 2. Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire content from `supabase/schema.sql`
4. Run the SQL script

**This will create:**
- ✅ All tables (users, lessons, translations, etc.)
- ✅ Row Level Security policies
- ✅ Triggers for auto-profile creation
- ✅ Sample lessons
- ✅ Helper functions

### 3. Configure Environment Variables

Your `.env.local` already has:
```
NEXT_PUBLIC_SUPABASE_URL=https://sybpdloxirehafzepvda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Optional:** Add service role key for admin operations:
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Enable Authentication

**Email/Password** (Already enabled by default)
- No additional setup needed!

**Google OAuth** (Optional):
1. Follow `GOOGLE_OAUTH_SETUP.md`
2. Add credentials to Supabase
3. Users can login with Google

### 5. Run the Application

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🎯 User Flow

### 1. Landing Page (`/`)
- Hero section with tagline
- "Get Started" button
- Auto-redirect if logged in

### 2. Choose Language (`/choose-language`)
- Select from 10+ languages
- Saves preference for translations
- Redirects to login

### 3. Login (`/login`)
- Email/Password signup/login
- Google OAuth (if configured)
- Auto-redirect to onboarding or dashboard

### 4. Onboarding (`/onboarding`)
- **Step 1:** Select 3-5 priority skills
- **Step 2:** Select 3-5 unpriority skills
- Creates user profile
- Gives 3 free tokens
- Redirects to dashboard

### 5. Dashboard (`/dashboard`)
- XP progress bar
- Stats cards (lessons, badges, confidence)
- 4 main sections:
  - ⭐ Priority Skills
  - 📚 Learn Later
  - 🎮 Game Zone
  - 🧠 AI Mentor

### 6. Priority Page (`/priority`)
- Shows lessons for priority skills
- Displays progress and XP
- Click lesson → opens lesson viewer
- Translated to user's language

### 7. Unpriority Page (`/unpriority`)
- Shows lessons for later skills
- Option to move skills to priority
- Same lesson interface

### 8. Game Page (`/game`)
- Quiz questions
- Earn XP for correct answers
- Real-time XP updates in database
- XP animation on correct answer
- Results screen with total XP

### 9. Mentor Page (`/mentor`)
- **Free Mentor:** Rule-based suggestions
- **AI Mentor:** Costs 1 token per question
- Chat interface
- Saves conversation history
- Shows token balance
- Redirects to purchase if no tokens

### 10. Purchase Page (`/purchase`)
- 3 token packages
- Stripe integration (placeholder)
- FAQ section
- Shows current token balance

### 11. Profile Page (`/profile`)
- User info and stats
- Language preference
- Priority & unpriority skills
- Badges earned
- Edit skills option

---

## 🗄️ Database Schema

### Tables Created

**users**
- Extends Supabase auth.users
- Stores: name, email, xp, level, badges, skills, language
- Auto-created on signup via trigger

**user_tokens**
- Tracks token balance
- Default: 3 free tokens
- Updated on purchase/usage

**lessons**
- English content
- Skill tags, levels, XP rewards
- Sample lessons included

**translations**
- Caches translated lessons
- Reduces API calls
- Indexed by lesson_id + language

**user_progress**
- Tracks lesson completion
- XP earned per lesson
- Completion status

**mentor_requests**
- Saves all mentor queries
- Tracks tokens used
- Conversation history

**game_progress**
- Game level and score
- Badges earned from games

---

## 🌐 Translation System

### How It Works

1. **User selects language** → Saved in profile
2. **Opens lesson** → Check translations table
3. **If cached** → Return translated content
4. **If not cached** → Call LibreTranslate API
5. **Save translation** → Cache for future use
6. **Display** → Show in user's language

### LibreTranslate API

**Free Public Instance:**
```
https://libretranslate.com/translate
```

**Self-hosted (Recommended for production):**
```bash
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate
```

Then update `.env.local`:
```
LIBRETRANSLATE_URL=http://localhost:5000/translate
```

---

## 🧠 AI Mentor System

### Two Types

**1. Free Mentor (Rule-based)**
- No tokens required
- Basic roadmap suggestions
- Skill analysis
- Motivation messages
- Based on user profile data

**2. AI Mentor (1 token)**
- Personalized responses
- Career guidance
- Detailed roadmaps
- Costs 1 token per question

### How It Works

```javascript
// User asks question
POST /api/mentor
{
  user_id: "uuid",
  question: "What should I learn next?"
}

// Backend checks tokens
if (tokens >= 1) {
  // Generate response
  // Deduct 1 token
  // Save to mentor_requests
  return { response, tokens_remaining }
} else {
  return { need_payment: true }
}
```

---

## 💰 Token System

### Token Economics

| Package | Tokens | Price | Value |
|---------|--------|-------|-------|
| Starter | 5 | ₹99 | ₹19.80/token |
| Popular | 15 | ₹249 | ₹16.60/token |
| Pro | 30 | ₹449 | ₹14.97/token |

### Token Usage

- **AI Mentor Question:** 1 token
- **Free Mentor:** 0 tokens
- **Lessons & Games:** Free
- **Initial Signup:** 3 free tokens

### Stripe Integration (TODO)

```javascript
// app/api/purchase/route.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  const { package_id, user_id } = await request.json()
  
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: price_id, quantity: 1 }],
    mode: 'payment',
    success_url: `${origin}/dashboard?success=true`,
    cancel_url: `${origin}/purchase?canceled=true`,
  })
  
  return { url: session.url }
}
```

---

## 🎮 Gamification

### XP System

- **Lesson Completion:** 100-200 XP
- **Quiz Correct Answer:** 50 XP
- **Game Completion:** Variable XP
- **Level Up:** Every 500 XP

### Levels

```
Level 1: 0-499 XP
Level 2: 500-999 XP
Level 3: 1000-1499 XP
...
```

### Badges (Coming Soon)

- 🏆 First Lesson Complete
- 🔥 7 Day Streak
- 🎯 Master a Skill
- 🌟 Reach Level 10
- 💯 100% Quiz Score

---

## 🔐 Security

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only see/edit their own data
- Lessons are public (read-only)
- Translations are public (cached)

### Authentication

- Supabase Auth handles security
- JWT tokens for API calls
- Secure password hashing
- OAuth 2.0 for Google

---

## 📊 Real-time Features

### Supabase Realtime

```javascript
// Subscribe to XP updates
const channel = supabase
  .channel('user_xp')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'users',
    filter: `id=eq.${userId}`
  }, (payload) => {
    // Update UI with new XP
    updateXP(payload.new.xp)
  })
  .subscribe()
```

---

## 🎨 UI/UX Design

### Color Palette

- **Primary Blue:** `#2956D9`
- **Accent Yellow:** `#FFC947`
- **Background:** `#F9FAFB`
- **Success Green:** `#10B981`
- **Error Red:** `#EF4444`

### Design Principles

- Clean, minimal interface
- Rounded corners (2xl, 3xl)
- Soft shadows
- Smooth animations (Framer Motion)
- Mobile-first responsive

---

## 🚧 TODO / Future Enhancements

### Phase 1 (Current)
- ✅ Basic authentication
- ✅ Skill selection
- ✅ Lesson system
- ✅ Translation caching
- ✅ Game with XP
- ✅ AI Mentor (rule-based)
- ✅ Token system

### Phase 2 (Next)
- [ ] Stripe payment integration
- [ ] Real AI mentor (OpenAI/Anthropic)
- [ ] More lessons and quizzes
- [ ] Badge system implementation
- [ ] Leaderboards
- [ ] Social features (share progress)

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Video lessons
- [ ] Live mentor sessions
- [ ] Community forums
- [ ] Certificates

---

## 🐛 Troubleshooting

### Common Issues

**1. Database tables not created**
- Run the SQL script in Supabase SQL Editor
- Check for errors in the output

**2. Translation not working**
- Check LibreTranslate API is accessible
- Verify LIBRETRANSLATE_URL in .env.local
- Check browser console for errors

**3. Tokens not updating**
- Check RLS policies are correct
- Verify user_tokens table exists
- Check Supabase logs

**4. XP not updating in real-time**
- Refresh the page
- Check Supabase Realtime is enabled
- Verify database trigger is working

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review Supabase logs
3. Check browser console
4. Review `supabase/schema.sql`

---

## 🎉 You're Ready!

Your NayaDisha platform is now complete with:
- ✅ Multilingual learning
- ✅ Gamification
- ✅ AI Mentor
- ✅ Token system
- ✅ Real-time updates
- ✅ Beautiful UI

**Start the app:**
```bash
npm run dev
```

**Test the flow:**
1. Visit http://localhost:3000
2. Choose language
3. Sign up
4. Complete onboarding
5. Explore dashboard
6. Try lessons, games, mentor!

---

**Built with ❤️ for learners everywhere**
