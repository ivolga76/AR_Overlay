-- Migration 007: player MMR (Elo rating system)
-- Date: 2026-07-05
-- Adds current_mmr column to players table for persistent Elo tracking

ALTER TABLE players ADD COLUMN current_mmr INTEGER NOT NULL DEFAULT 1000;

CREATE INDEX IF NOT EXISTS idx_players_mmr ON players(current_mmr);
