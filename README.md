# NayaDisha - Learning Platform for nontech student and a tech student.

**Tagline:** "Har student ke future ko ek nayi disha."

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- Supabase (Authentication & Database)

## Setup Complete ✓

### Environment Variables
`.env.local` has been created with Supabase credentials.

### Pages Created
- `/` - Landing page with language selector
- `/login` - Google OAuth authentication
- `/dashboard` - User dashboard with confidence score and XP progress
- `/skill-path` - Vertical skill tree with unlockable nodes
- `/lesson/[id]` - Split-screen lesson view (English + Selected language)
- `/quiz/[id]` - MCQ quiz with XP rewards
- `/mentor` - AI mentor chat interface
- `/profile` - User profile with stats and skills

### Authentication Flow
- Users must log in with Google OAuth
- Authenticated users are redirected to `/dashboard`
- Unauthenticated users are redirected to `/login`
- Logout functionality available on dashboard and profile pages

### Color Theme
- Primary Blue: `#2956D9`
- Accent Yellow: `#FFC947`
- Clean, rounded card UI throughout

### Features
- **Confidence Score**: Visual circular progress indicator
- **XP Progress**: Level-based progression system
- **Skill Path**: Vertical node tree (Completed/Active/Locked states)
- **Bilingual Lessons**: Side-by-side English and regional language content
- **Interactive Quizzes**: MCQ format with XP rewards
- **AI Mentor**: Chat interface for learning support
- **User Profile**: Stats, skills, and progress tracking

## Running the App

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Supabase Configuration

Make sure to enable Google OAuth in your Supabase project:
1. Go to Authentication > Providers
2. Enable Google provider
3. Add your OAuth credentials
4. Add authorized redirect URLs

## Next Steps
- Connect to actual Supabase database tables for user progress
- Implement real lesson content and quiz questions
- Add AI mentor integration (OpenAI/Anthropic)
- Create more language options
- Add achievement badges and leaderboards
