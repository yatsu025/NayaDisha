-- ============================================
-- ENABLE REALTIME ON TABLES
-- ============================================
-- Run this in Supabase SQL Editor

-- Note: You can also enable via UI:
-- Database → Replication → Realtime → Toggle each table

-- This script ensures RLS policies allow SELECT
-- which is required for realtime to work

-- ============================================
-- 1. USERS TABLE
-- ============================================

-- Enable RLS if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (optional)
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
-- 2. USER_TOKENS TABLE
-- ============================================

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

-- ============================================
-- 3. USER_PROGRESS TABLE
-- ============================================

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

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

-- ============================================
-- 4. MENTOR_REQUESTS TABLE
-- ============================================

ALTER TABLE mentor_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own requests" ON mentor_requests;
DROP POLICY IF EXISTS "Users can insert own requests" ON mentor_requests;

CREATE POLICY "Users can view own requests"
ON mentor_requests FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own requests"
ON mentor_requests FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 5. LESSONS TABLE (Optional - for caching)
-- ============================================

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view lessons" ON lessons;

CREATE POLICY "Anyone can view lessons"
ON lessons FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'user_tokens', 'user_progress', 'mentor_requests', 'lessons');

-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_tokens', 'user_progress', 'mentor_requests', 'lessons')
ORDER BY tablename, policyname;

-- ============================================
-- TEST QUERY (Run after enabling realtime)
-- ============================================

-- Get your user ID
SELECT id, email, xp FROM users LIMIT 5;

-- Test update (replace with your user ID)
-- UPDATE users SET xp = xp + 10 WHERE id = 'your-user-id-here';

-- ============================================
-- DONE! ✅
-- ============================================
-- Now go to: Database → Replication → Realtime
-- Enable these tables:
-- ✅ users
-- ✅ user_tokens
-- ✅ user_progress
-- ✅ mentor_requests
-- ============================================
