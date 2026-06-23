-- Migration 001: Initial schema
-- Creates all tables for users, tournaments, participants, tasks, results, standings.

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt          TEXT NOT NULL,
  display_name  TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Tournaments
CREATE TABLE IF NOT EXISTS tournaments (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  mode         TEXT NOT NULL DEFAULT '1x1' CHECK(mode IN ('1x1','2x2')),
  status       TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active','completed')),
  total_rounds INTEGER NOT NULL DEFAULT 3,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_tournaments_user ON tournaments(user_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);

-- Participants
CREATE TABLE IF NOT EXISTS tournament_participants (
  id            TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL DEFAULT 'player' CHECK(type IN ('player','team')),
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_participants_tournament ON tournament_participants(tournament_id);

-- Team members (2x2 mode)
CREATE TABLE IF NOT EXISTS participant_members (
  participant_id TEXT NOT NULL REFERENCES tournament_participants(id) ON DELETE CASCADE,
  player_name    TEXT NOT NULL,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (participant_id, player_name)
);

-- Tasks
CREATE TABLE IF NOT EXISTS tournament_tasks (
  id            TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  points        INTEGER NOT NULL DEFAULT 1,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_tasks_tournament ON tournament_tasks(tournament_id);

-- Round results
CREATE TABLE IF NOT EXISTS round_results (
  id              TEXT PRIMARY KEY,
  tournament_id   TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  round_number    INTEGER NOT NULL,
  participant_id  TEXT NOT NULL REFERENCES tournament_participants(id) ON DELETE CASCADE,
  points_earned   INTEGER NOT NULL DEFAULT 0,
  tasks_completed TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_round_results_tournament ON round_results(tournament_id);
CREATE INDEX IF NOT EXISTS idx_round_results_participant ON round_results(participant_id);

-- Final standings
CREATE TABLE IF NOT EXISTS tournament_standings (
  tournament_id  TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  participant_id TEXT NOT NULL REFERENCES tournament_participants(id) ON DELETE CASCADE,
  total_points   INTEGER NOT NULL DEFAULT 0,
  rank           INTEGER NOT NULL,
  PRIMARY KEY (tournament_id, participant_id)
);

CREATE INDEX IF NOT EXISTS idx_standings_participant ON tournament_standings(participant_id);

-- Extension templates
CREATE TABLE IF NOT EXISTS tournament_complications (
  id            TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tournament_bonus_tasks (
  id            TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  points        INTEGER NOT NULL DEFAULT 2,
  sort_order    INTEGER NOT NULL DEFAULT 0
);
