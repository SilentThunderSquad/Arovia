-- ============================================================
-- Arovia Database Safeguards
-- Migration: 004_username_safeguards.sql
-- ============================================================

-- 1. Create visibility enum type if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'profile_visibility') THEN
    CREATE TYPE profile_visibility AS ENUM ('public', 'private', 'unlisted');
  END IF;
END $$;

-- 2. Add visibility column to profiles
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS visibility profile_visibility NOT NULL DEFAULT 'public';

-- 3. Create username_history table
CREATE TABLE IF NOT EXISTS username_history (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  old_username  TEXT NOT NULL,
  released_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure old_username is unique to prevent any future takeovers
CREATE UNIQUE INDEX IF NOT EXISTS idx_username_history_old_username ON username_history(old_username);
CREATE INDEX IF NOT EXISTS idx_username_history_user_id ON username_history(user_id);

-- 4. Enable RLS on username_history
ALTER TABLE username_history ENABLE ROW LEVEL SECURITY;

-- Create policies for username_history
CREATE POLICY "username_history: users read own"
  ON username_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "username_history: admins read all"
  ON username_history FOR SELECT
  USING (get_my_role() = 'admin');

-- 5. Trigger Function to track username changes
CREATE OR REPLACE FUNCTION track_username_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If username changed and was not null
  IF (OLD.username IS DISTINCT FROM NEW.username) AND (OLD.username IS NOT NULL) AND (OLD.username <> '') THEN
    INSERT INTO username_history (user_id, old_username, released_at)
    VALUES (OLD.id, LOWER(TRIM(OLD.username)), NOW())
    ON CONFLICT (old_username) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on profiles
CREATE OR REPLACE TRIGGER on_username_changed
  BEFORE UPDATE OF username ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION track_username_changes();

-- 6. Update profiles RLS select policies
-- Drop old select policy to avoid conflicts
DROP POLICY IF EXISTS "profiles: users read own" ON profiles;
DROP POLICY IF EXISTS "profiles: public read" ON profiles;

-- Users can read their own profile (any visibility)
CREATE POLICY "profiles: users read own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Public read only allows public or unlisted profiles
CREATE POLICY "profiles: public read"
  ON profiles FOR SELECT
  USING (visibility = 'public' OR visibility = 'unlisted');
