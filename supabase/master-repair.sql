-- ============================================
-- MASTER REPAIR SCRIPT (Fixes Everything)
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor.
-- It fixes missing columns, missing tables, policies, and syncs users.

-- 1. Fix USERS table structure (add missing columns)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 50;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS priority_skills JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS unpriority_skills JSONB DEFAULT '[]'::jsonb;

-- Ensure users.id is PRIMARY KEY (Safe check)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_pkey') THEN
    ALTER TABLE public.users ADD PRIMARY KEY (id);
  END IF;
END $$;

-- 2. Create Missing Tables (if they don't exist)

-- User Tokens
CREATE TABLE IF NOT EXISTS public.user_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tokens INTEGER DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User Progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT, -- Removing FK constraint for now to be safe
  xp INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  skill_unlocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Mentor Requests
CREATE TABLE IF NOT EXISTS public.mentor_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT,
  tokens_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sync Missing Users (Fix "No profile found")
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
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);

-- 4. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_requests ENABLE ROW LEVEL SECURITY;

-- 5. Fix Policies (Drop old ones first to avoid duplicates)

-- Users Table
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;

CREATE POLICY "Users can view own data" ON public.users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Enable insert for authenticated users" ON public.users FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- User Tokens
DROP POLICY IF EXISTS "Users can view own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update own tokens" ON public.user_tokens;

CREATE POLICY "Users can view own tokens" ON public.user_tokens FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own tokens" ON public.user_tokens FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- User Progress
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 6. Enable Realtime
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'users') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_tokens') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_tokens;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_progress') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
  END IF;
END $$;

-- 7. Verification Output
SELECT count(*) as "Total Users" FROM public.users;
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
