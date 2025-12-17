-- ============================================
-- CHECK & FIX USERS TABLE
-- ============================================

-- Step 1: Check if users table has any data
SELECT id, email, name, xp, language FROM users;

-- Step 2: Check auth users (Supabase Auth)
SELECT id, email, created_at FROM auth.users;

-- Step 3: If users table is empty but auth.users has data,
-- we need to create a trigger to auto-create profile

-- ============================================
-- CREATE TRIGGER FOR AUTO PROFILE CREATION
-- ============================================

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, language, xp