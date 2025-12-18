-- ============================================
-- ADD FIELD COLUMNS TO USERS AND BACKFILL
-- ============================================
-- Adds `priority_field` and `secondary_field` to store chosen career tracks
-- Then attempts to infer values from existing skill arrays

-- 1) Add columns if missing
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS priority_field TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS secondary_field TEXT;

-- 2) Backfill priority_field from existing skills
UPDATE public.users
SET priority_field = 'fullstack'
WHERE (priority_field IS NULL OR priority_field = '')
AND priority_skills @> '["web-development","javascript","database","ui-ux","devops"]'::jsonb;

UPDATE public.users
SET priority_field = 'android'
WHERE (priority_field IS NULL OR priority_field = '')
AND priority_skills @> '["mobile-development","java","kotlin","ui-ux","firebase"]'::jsonb;

UPDATE public.users
SET priority_field = 'datascience'
WHERE (priority_field IS NULL OR priority_field = '')
AND priority_skills @> '["python","data-science","machine-learning","database","cloud-computing"]'::jsonb;

UPDATE public.users
SET priority_field = 'cybersecurity'
WHERE (priority_field IS NULL OR priority_field = '')
AND priority_skills @> '["cybersecurity","networking","linux","python","cloud-computing"]'::jsonb;

-- 3) Backfill secondary_field from existing skills
UPDATE public.users
SET secondary_field = 'android'
WHERE (secondary_field IS NULL OR secondary_field = '')
AND unpriority_skills @> '["mobile-development","java","kotlin","ui-ux","firebase"]'::jsonb;

UPDATE public.users
SET secondary_field = 'fullstack'
WHERE (secondary_field IS NULL OR secondary_field = '')
AND unpriority_skills @> '["web-development","javascript","database","ui-ux","devops"]'::jsonb;

UPDATE public.users
SET secondary_field = 'datascience'
WHERE (secondary_field IS NULL OR secondary_field = '')
AND unpriority_skills @> '["python","data-science","machine-learning","database","cloud-computing"]'::jsonb;

UPDATE public.users
SET secondary_field = 'cybersecurity'
WHERE (secondary_field IS NULL OR secondary_field = '')
AND unpriority_skills @> '["cybersecurity","networking","linux","python","cloud-computing"]'::jsonb;

-- 4) Verification
SELECT id, email, priority_field, secondary_field FROM public.users LIMIT 10;

