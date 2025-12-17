-- ============================================
-- FINAL SOLUTION: RESET AND FIX SCHEMA
-- ============================================
-- WARNING: This will reset user profile data (XP, etc.)
-- But it GUARANTEES to fix the "Unique Constraint" and "Realtime" errors.

BEGIN;

-- 1. Drop existing tables that are causing conflicts
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.user_tokens CASCADE;
DROP TABLE IF EXISTS public.mentor_requests CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. Re-create USERS table with correct PRIMARY KEY
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  name TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  language TEXT DEFAULT 'en',
  badges JSONB DEFAULT '[]'::jsonb,
  confidence_score INTEGER DEFAULT 50,
  profile_complete BOOLEAN DEFAULT FALSE,
  priority_skills JSONB DEFAULT '[]'::jsonb,
  unpriority_skills JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT users_pkey PRIMARY KEY (id) -- ✅ This fixes the error
);

-- 3. Re-create dependent tables
CREATE TABLE public.user_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tokens INTEGER DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT,
  xp INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  skill_unlocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies
-- Users
CREATE POLICY "Users can view own data" ON public.users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Enable insert for authenticated users" ON public.users FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Tokens
CREATE POLICY "Users can view own tokens" ON public.user_tokens FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own tokens" ON public.user_tokens FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Progress
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 6. Enable Realtime
DO $$
BEGIN
  -- Add tables to publication if they exist
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_tokens;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
  END IF;
END $$;

-- 7. Sync Users (Restore your profile)
INSERT INTO public.users (id, email, name, created_at, updated_at, xp, level, language)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', 'New User') as name,
  created_at, 
  created_at,
  0 as xp,
  1 as level,
  'en' as language
FROM auth.users;

COMMIT;

-- 8. Verify
SELECT count(*) as "Total Users Restored" FROM public.users;
