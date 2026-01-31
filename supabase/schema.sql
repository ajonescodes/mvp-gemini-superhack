-- PromptPlay Sports Database Schema
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'superfan')),
  xp_total INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- Matchups table
CREATE TABLE IF NOT EXISTS matchups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  matchup_date DATE NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'processing', 'complete')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Predictions table (with upsert support via UNIQUE constraint)
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  matchup_id UUID REFERENCES matchups(id),
  category TEXT NOT NULL,
  selection TEXT NOT NULL,
  tier_weight DECIMAL DEFAULT 1.0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, matchup_id, category)
);
CREATE INDEX IF NOT EXISTS idx_predictions_matchup_category ON predictions(matchup_id, category);

-- Generated scripts table (with outcomes for XP calc)
CREATE TABLE IF NOT EXISTS generated_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matchup_id UUID REFERENCES matchups(id),
  script_json JSONB NOT NULL,
  outcomes JSONB NOT NULL,
  video_url_trailer TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to increment user XP
CREATE OR REPLACE FUNCTION increment_xp(target_user_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE users SET xp_total = xp_total + amount WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Seed Data: Super Bowl LX matchup
INSERT INTO matchups (home_team, away_team, matchup_date, status)
VALUES ('Seattle Seahawks', 'New England Patriots', '2026-02-08', 'open')
ON CONFLICT DO NOTHING;
