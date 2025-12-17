-- ============================================
-- SIMPLE REALTIME FIX - Only for existing tables
-- ============================================
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. USERS TABLE (Main table)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;

-- Create SELECT policy (REQUIRED for realtime!)
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

-- Create INSERT policy (for new users)
CREATE POLICY "Enable insert for authenticated users"
ON users FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- ============================================
-- 2. USERS_PROGRESS TABLE (if exists)
-- ============================================

-- Check if table exists, if yes then apply policies
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users_progress') THEN
    ALTER TABLE users_progress ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own progress" ON users_progress;
    DROP POLICY IF EXISTS "Users can insert own progress" ON users_progress;
    DROP POLICY IF EXISTS "Users can update own progress" ON users_progress;
    
    CREATE POLICY "Users can view own progress"
    ON users_progress FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
    
    CREATE POLICY "Users can insert own progress"
    ON users_progress FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
    
    CREATE POLICY "Users can update own progress"
    ON users_progress FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if RLS is enabled
SELECT 
  tablename, 
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'users_progress')
ORDER BY tablename;

-- Check existing policies
SELECT 
  tablename,
  policyname,
  cmd as "Command"
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'users_progress')
ORDER BY tablename, policyname;

-- ============================================
-- TEST QUERY
-- ============================================

-- Get your user data
SELECT id, email, xp, language FROM users LIMIT 5;

-- ============================================
-- DONE! ✅
-- ============================================
-- Now:
-- 1. Go to: Database → Replication → Realtime
-- 2. Enable "users" table (toggle ON)
-- 3. Test at: http://localhost:3000/test-realtime
-- ============================================
