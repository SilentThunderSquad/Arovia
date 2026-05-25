-- ============================================================
-- Arovia RLS Policies
-- Migration: 002_rls.sql
-- ============================================================

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors       ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER: get authenticated user's role
-- ============================================================

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================

-- Users can read their own profile
CREATE POLICY "profiles: users read own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "profiles: admins read all"
  ON profiles FOR SELECT
  USING (get_my_role() = 'admin');

-- Profiles are inserted by trigger (service role)
CREATE POLICY "profiles: service role insert"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Users can update their own profile (non-privileged fields)
CREATE POLICY "profiles: users update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile (including role/is_active)
CREATE POLICY "profiles: admins update any"
  ON profiles FOR UPDATE
  USING (get_my_role() = 'admin');

-- Users can delete their own profile
CREATE POLICY "profiles: users delete own"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Admins can delete any profile
CREATE POLICY "profiles: admins delete any"
  ON profiles FOR DELETE
  USING (get_my_role() = 'admin');

-- ============================================================
-- PRESCRIPTIONS POLICIES
-- ============================================================

CREATE POLICY "prescriptions: users read own"
  ON prescriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "prescriptions: admins read all"
  ON prescriptions FOR SELECT
  USING (get_my_role() = 'admin');

CREATE POLICY "prescriptions: users insert own"
  ON prescriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "prescriptions: users delete own"
  ON prescriptions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "prescriptions: admins delete any"
  ON prescriptions FOR DELETE
  USING (get_my_role() = 'admin');

-- ============================================================
-- DOCTORS POLICIES (public read, admin write)
-- ============================================================

CREATE POLICY "doctors: public read"
  ON doctors FOR SELECT
  USING (true);

CREATE POLICY "doctors: admins insert"
  ON doctors FOR INSERT
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "doctors: admins update"
  ON doctors FOR UPDATE
  USING (get_my_role() = 'admin');

CREATE POLICY "doctors: admins delete"
  ON doctors FOR DELETE
  USING (get_my_role() = 'admin');
