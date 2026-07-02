-- ============================================================
-- Migration 005: Season-level player ratings
-- Date: 2026-07-03
-- Stores manually curated season standings imported from
-- Google Sheets (organizer-maintained leaderboard).
-- ============================================================

CREATE TABLE IF NOT EXISTS season_player_ratings (
  season_id  TEXT NOT NULL REFERENCES seasons(id),
  mode       TEXT NOT NULL CHECK(mode IN ('1x1','2x2')),
  rank       INTEGER NOT NULL,
  nickname   TEXT NOT NULL,
  wins       INTEGER NOT NULL DEFAULT 0,
  losses     INTEGER NOT NULL DEFAULT 0,
  streak     INTEGER NOT NULL DEFAULT 0,
  mmr        INTEGER NOT NULL DEFAULT 1000,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (season_id, mode, nickname)
);

CREATE INDEX IF NOT EXISTS idx_spr_season_mode ON season_player_ratings(season_id, mode);
CREATE INDEX IF NOT EXISTS idx_spr_rank ON season_player_ratings(season_id, mode, rank);
