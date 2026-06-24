// ARC Raiders Tournament — TypeScript types

export type TournamentMode = '1x1' | '2x2';
export type TournamentStatus = 'draft' | 'active' | 'completed';

/** Raw API response from /api/leaderboard */
export interface LeaderboardEntry {
  participant_id: string;
  participant_name: string;
  participant_type: 'player' | 'team';
  tournament_id: string;
  tournament_name: string;
  tournament_mode: TournamentMode;
  total_points: number;
  tournament_rank: number;
  organizer_name: string | null;
}

/** Enriched standings entry matching the Google Sheets format */
export interface StandingEntry {
  rank: number;
  nickname: string;
  mmr: number;
  wins: number;
  losses: number;
  totalPoints: number;
  tournamentName: string;
  tournamentId: string;
  mode: TournamentMode;
  isTeam: boolean;
  organizerName: string | null;
}

/** Tournament detail from /api/tournaments/:id */
export interface TournamentDetail {
  id: string;
  user_id: string;
  name: string;
  mode: TournamentMode;
  status: TournamentStatus;
  total_rounds: number;
  created_at: string;
  completed_at: string | null;
  organizer_name?: string;
}

/** Player stats from /api/players/:id */
export interface PlayerStats {
  playerId: string;
  nickname: string;
  totalTournaments: number;
  totalWins: number;
  totalLosses: number;
  peakMmr: number;
  currentMmr: number;
  history: PlayerTournamentEntry[];
}

export interface PlayerTournamentEntry {
  tournamentId: string;
  tournamentName: string;
  mode: TournamentMode;
  rank: number;
  mmr: number;
  wins: number;
  losses: number;
  completedAt: string | null;
}

/** API error */
export interface ApiError {
  error: string;
}
