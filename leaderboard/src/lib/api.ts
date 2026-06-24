// ARC Raiders Tournament — API client
// Proxies requests to the Express backend (AR Overlay API)

import type {
  LeaderboardEntry,
  StandingEntry,
  TournamentDetail,
  PlayerStats,
} from './types';
import { computeMmr } from './utils';

const API_BASE = process.env.API_URL ?? 'http://localhost:3001';

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 30 },
      ...options,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `API error ${res.status}`);
    }

    return res.json();
  } catch (error) {
    // Graceful degradation during build when API is not available
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn(`[API] Fetch failed for ${path} (build-time, API unavailable):`, (error as Error).message);
    }
    throw error;
  }
}

// Safe fetch that returns empty data on failure (for build-time resilience)
async function fetchAPISafe<T>(path: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    return await fetchAPI<T>(path, options);
  } catch {
    return fallback;
  }
}

// ── Leaderboard ────────────────────────────────────────────

export async function getGlobalLeaderboard(
  limit = 100,
  mode?: string
): Promise<StandingEntry[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (mode && mode !== 'all') params.set('mode', mode);

  const data = await fetchAPISafe<{ leaderboard: LeaderboardEntry[] }>(
    `/api/leaderboard?${params}`,
    { leaderboard: [] }
  );

  return enrichStandings(data.leaderboard);
}

export async function getTournamentStandings(
  tournamentId: string
): Promise<StandingEntry[]> {
  const data = await fetchAPISafe<{
    standings: LeaderboardEntry[];
    tournament: TournamentDetail;
  }>(
    `/api/leaderboard/${tournamentId}`,
    { standings: [], tournament: null as unknown as TournamentDetail }
  );

  return enrichStandings(data.standings ?? []);
}

// ── Tournaments ────────────────────────────────────────────

export async function getTournaments(): Promise<TournamentDetail[]> {
  const data = await fetchAPISafe<{ tournaments: TournamentDetail[] }>(
    '/api/tournaments',
    { tournaments: [] }
  );
  return data.tournaments ?? [];
}

export async function getTournament(
  id: string
): Promise<TournamentDetail | null> {
  try {
    return await fetchAPI<TournamentDetail>(`/api/tournaments/${id}`);
  } catch {
    return null;
  }
}

// ── Player Profile ─────────────────────────────────────────

export async function getPlayerStats(
  playerId: string
): Promise<PlayerStats | null> {
  try {
    return await fetchAPI<PlayerStats>(`/api/players/${playerId}`);
  } catch {
    return null;
  }
}

// ── Helpers ────────────────────────────────────────────────

/**
 * Enrich raw API entries with computed MMR, wins, losses.
 * Falls back to total_points as MMR when no dedicated stats exist.
 */
function enrichStandings(entries: LeaderboardEntry[]): StandingEntry[] {
  return entries.map((entry, i) => {
    const raw = entry as LeaderboardEntry & {
      wins?: number;
      losses?: number;
    };
    const wins = raw.wins ?? 0;
    const losses = raw.losses ?? 0;
    const mmr = computeMmr(entry.total_points, wins, losses);

    return {
      rank: i + 1,
      nickname: entry.participant_name,
      mmr,
      wins,
      losses,
      totalPoints: entry.total_points,
      tournamentName: entry.tournament_name,
      tournamentId: entry.tournament_id,
      mode: entry.tournament_mode,
      isTeam: entry.participant_type === 'team',
      organizerName: entry.organizer_name,
    };
  });
}
