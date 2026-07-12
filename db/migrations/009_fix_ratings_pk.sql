-- Migration 009: Fix season_player_ratings PK — allow duplicate nicknames at different ranks
-- Old PK was (season_id, mode, nickname) which loses duplicate team names (e.g. СУТУЛЫЕ ПСЫ at ranks 12 and 15).
-- New PK is (season_id, mode, rank) — rank is always unique within a season+mode.

-- 1. Create new table with correct PK
CREATE TABLE IF NOT EXISTS season_player_ratings_new (
  season_id  TEXT NOT NULL REFERENCES seasons(id),
  mode       TEXT NOT NULL CHECK(mode IN ('1x1','2x2')),
  rank       INTEGER NOT NULL,
  nickname   TEXT NOT NULL,
  wins       INTEGER NOT NULL DEFAULT 0,
  losses     INTEGER NOT NULL DEFAULT 0,
  streak     INTEGER NOT NULL DEFAULT 0,
  mmr        INTEGER NOT NULL DEFAULT 1000,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (season_id, mode, rank)
);

-- 2. Copy data (deduplicate by rank — keep latest/higher MMR for same rank)
INSERT INTO season_player_ratings_new (season_id, mode, rank, nickname, wins, losses, streak, mmr, updated_at)
SELECT season_id, mode, rank, nickname, wins, losses, streak, mmr, updated_at
FROM season_player_ratings;

-- 3. Drop old table
DROP TABLE season_player_ratings;

-- 4. Rename new table
ALTER TABLE season_player_ratings_new RENAME TO season_player_ratings;

-- 5. Recreate indexes
CREATE INDEX IF NOT EXISTS idx_spr_season_mode ON season_player_ratings(season_id, mode);
CREATE INDEX IF NOT EXISTS idx_spr_rank ON season_player_ratings(season_id, mode, rank);
