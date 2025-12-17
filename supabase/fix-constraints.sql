-- ============================================
-- FIX USERS TABLE CONSTRAINTS
-- ============================================
-- Run this script to fix ERROR 42830
-- It forces the 'users' table to have a Primary Key

BEGIN;

-- 1. Ensure 'id' is NOT NULL
ALTER TABLE public.users ALTER COLUMN id SET NOT NULL;

-- 2. Add PRIMARY KEY constraint if missing
-- We use a DO block to avoid errors if it already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'users_pkey'
    ) THEN
        ALTER TABLE public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
    END IF;
END $$;

-- 3. Now try creating the foreign keys for other tables
-- (Only create tables if they don't exist)

CREATE TABLE IF NOT EXISTS public.user_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tokens INTEGER DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT,
  xp INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  skill_unlocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

COMMIT;

-- 4. Verify
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass;
