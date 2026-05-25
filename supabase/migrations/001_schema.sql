-- ============================================================
-- Arovia Database Schema
-- Migration: 001_schema.sql
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('user', 'admin', 'doctor');
CREATE TYPE user_gender AS ENUM ('Male', 'Female', 'Other', 'Prefer not to say');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT '',
  username        TEXT UNIQUE,
  role            user_role NOT NULL DEFAULT 'user',
  phone           TEXT,
  dob             DATE,
  gender          user_gender DEFAULT 'Prefer not to say',
  profile_picture TEXT,
  blood_donor     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  address         JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRESCRIPTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS prescriptions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  filename      TEXT NOT NULL,
  original_name TEXT NOT NULL,
  storage_path  TEXT NOT NULL,
  public_url    TEXT,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOCTORS (reference data)
-- ============================================================

CREATE TABLE IF NOT EXISTS doctors (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name               TEXT NOT NULL,
  specialization     TEXT,
  sub_specialization TEXT,
  treats             TEXT,
  experience         TEXT,
  rating             NUMERIC(3,1),
  qualification      TEXT,
  hospital           TEXT,
  city               TEXT,
  state              TEXT,
  schedule_days      TEXT,
  consultation_time  TEXT,
  consultation_fee   TEXT,
  contact            TEXT,
  languages          TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role       ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active  ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_prescriptions_user_id    ON prescriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_uploaded_at ON prescriptions(uploaded_at DESC);

CREATE INDEX IF NOT EXISTS idx_doctors_name           ON doctors USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_doctors_city_state     ON doctors(city, state);
