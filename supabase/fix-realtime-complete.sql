-- ============================================
-- COMPLETE REALTIME FIX SCRIPT
-- ============================================
-- Run this ENTIRE script in your Supabase SQL Editor
-- This will:
-- 1. Enable Row Level Security (RLS)
-- 2. Create policies so you can READ (Select) and UPDATE your own data
-- 3. Enable Realtime on the tables explicitly

-- ============================================
-- 1. USERS TABLE
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;

-- Create SELECT policy (CRITICAL for Realtime)
CREATE POLICY "Users can view own data"
ON users FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Create UPDATE policy
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Create INSERT policy
CREATE POLICY "Enable insert for authenticated users"
ON users FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Enable Realtime for 'users' table safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'users'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE users;
  END IF;
END $$;

-- ============================================
-- 2. USER_PROGRESS TABLE (if it exists)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_progress') THEN
    -- Enable RLS
    ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
    
    -- Drop policies
    DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
    
    -- Create policies
    CREATE POLICY "Users can view own progress"
    ON user_progress FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
    
    CREATE POLICY "Users can insert own progress"
    ON user_progress FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
    
    CREATE POLICY "Users can update own progress"
    ON user_progress FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

    -- Enable Realtime
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
      AND tablename = 'user_progress'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE user_progress;
    END IF;
  END IF;
END $$;

-- ============================================
-- 3. USER_TOKENS TABLE (if it exists)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_tokens') THEN
    ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own tokens" ON user_tokens;
    DROP POLICY IF EXISTS "Users can update own tokens" ON user_tokens;
    
    CREATE POLICY "Users can view own tokens"
    ON user_tokens FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
    
    CREATE POLICY "Users can update own tokens"
    ON user_tokens FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

    -- Enable Realtime
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
      AND tablename = 'user_tokens'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE user_tokens;
    END IF;
  END IF;
END $$;

-- ============================================
-- 4. VERIFICATION
-- ============================================

-- List tables with Realtime enabled
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
