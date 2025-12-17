-- ============================================
-- SYNC USERS SCRIPT
-- ============================================
-- Run this script to fix "No profile found" errors.
-- It ensures every user in Authentication (auth.users)
-- has a corresponding profile in the Database (public.users).

-- 1. Insert missing users from auth.users to public.users
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

-- 2. Verify the fix
SELECT count(*) as "Total Users in Auth" FROM auth.users;
SELECT count(*) as "Total Users in Public Table" FROM public.users;

-- 3. Show the fixed users
SELECT * FROM public.users ORDER BY created_at DESC LIMIT 5;
