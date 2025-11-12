-- NayaDisha Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  language TEXT DEFAULT 'en',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]'::jsonb,
  confidence_score INTEGER DEFAULT 50,
  profile_complete BOOLEAN DEFAULT FALSE,
  priority_skills JSONB DEFAULT '[]'::jsonb,
  unpriority_skills JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User tokens table
CREATE TABLE IF NOT EXISTS public.user_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tokens INTEGER DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Mentor requests table
CREATE TABLE IF NOT EXISTS public.mentor_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT,
  tokens_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  english_content TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  category TEXT, -- 'priority' or 'unpriority'
  skill_tag TEXT, -- e.g., 'python', 'javascript', 'data-science'
  xp_reward INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Translations table (cache)
CREATE TABLE IF NOT EXISTS public.translations (
  id SERIAL PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  translated_title TEXT,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, lang)
);

-- User progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  skill_unlocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Game progress table
CREATE TABLE IF NOT EXISTS public.game_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  game_level INTEGER DEFAULT 1,
  score INTEGER DEFAULT 0,
  badges_earned JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_tokens
CREATE POLICY "Users can view own tokens" ON public.user_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens" ON public.user_tokens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens" ON public.user_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for mentor_requests
CREATE POLICY "Users can view own mentor requests" ON public.mentor_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mentor requests" ON public.mentor_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for lessons (public read)
CREATE POLICY "Anyone can view lessons" ON public.lessons
  FOR SELECT USING (true);

-- RLS Policies for translations (public read)
CREATE POLICY "Anyone can view translations" ON public.translations
  FOR SELECT USING (true);

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for game_progress
CREATE POLICY "Users can view own game progress" ON public.game_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game progress" ON public.game_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game progress" ON public.game_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  
  INSERT INTO public.user_tokens (user_id, tokens)
  VALUES (NEW.id, 3);
  
  INSERT INTO public.game_progress (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample lessons
INSERT INTO public.lessons (id, title, english_content, level, category, skill_tag, xp_reward) VALUES
('python-basics-1', 'Introduction to Python', 'Python is a high-level, interpreted programming language known for its simplicity and readability. It is widely used in web development, data science, artificial intelligence, and automation.', 1, 'priority', 'python', 100),
('python-basics-2', 'Variables and Data Types', 'In Python, variables are used to store data. Python supports various data types including integers, floats, strings, lists, tuples, and dictionaries. You don''t need to declare variable types explicitly.', 1, 'priority', 'python', 100),
('python-basics-3', 'Control Flow', 'Control flow statements like if-else, for loops, and while loops help you control the execution of your code based on conditions and iterations.', 2, 'priority', 'python', 150),
('js-basics-1', 'Introduction to JavaScript', 'JavaScript is a versatile programming language primarily used for web development. It runs in browsers and enables interactive web pages.', 1, 'unpriority', 'javascript', 100),
('js-basics-2', 'Functions in JavaScript', 'Functions are reusable blocks of code. JavaScript supports function declarations, expressions, and arrow functions.', 2, 'unpriority', 'javascript', 150),
('data-science-1', 'Introduction to Data Science', 'Data Science combines statistics, programming, and domain knowledge to extract insights from data. Python and R are popular languages for data science.', 2, 'priority', 'data-science', 200),
('web-dev-1', 'HTML Basics', 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It defines the structure and content of web pages.', 1, 'unpriority', 'web-development', 100),
('web-dev-2', 'CSS Styling', 'CSS (Cascading Style Sheets) is used to style HTML elements. It controls layout, colors, fonts, and responsive design.', 1, 'unpriority', 'web-development', 100)
ON CONFLICT (id) DO NOTHING;

-- Function to update user XP and level
CREATE OR REPLACE FUNCTION public.update_user_xp(
  p_user_id UUID,
  p_xp_gained INTEGER
)
RETURNS void AS $$
DECLARE
  v_new_xp INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Update XP
  UPDATE public.users
  SET xp = xp + p_xp_gained,
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING xp INTO v_new_xp;
  
  -- Calculate new level (every 500 XP = 1 level)
  v_new_level := FLOOR(v_new_xp / 500) + 1;
  
  -- Update level if changed
  UPDATE public.users
  SET level = v_new_level
  WHERE id = p_user_id AND level < v_new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
