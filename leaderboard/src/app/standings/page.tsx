// Global Standings page — all completed tournaments leaderboard
// ISR revalidated every 60 seconds

import type { Metadata } from 'next';
import { StandingsTable } from '@/components/StandingsTable';
import { getGlobalLeaderboard } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Глобальный рейтинг — AR Overlay',
  description: 'Турнирная таблица всех завершённых турниров Arc Raiders. MMR, победы, поражения.',
  openGraph: {
    title: 'Глобальный рейтинг — Битва за Респект',
    description: 'Турнирная таблица сообщества Arc Raiders',
  },
};

export const revalidate = 60;

export default async function StandingsPage() {
  const entries = await getGlobalLeaderboard(100);

  const stats = {
    totalPlayers: new Set(entries.map((e) => e.nickname)).size,
    totalTournaments: new Set(entries.map((e) => e.tournamentId)).size,
    topMmr: entries.length > 0 ? Math.max(...entries.map((e) => e.mmr)) : 0,
  };

  return (
    <main className="flex-1">
      {/* Stats bar above the table */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="flex flex-wrap justify-center gap-8 py-4 mb-4">
          <div className="text-center">
            <span className="mono-stat text-xl text-accent-cyan font-bold">
              {stats.totalPlayers}
            </span>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">
              игроков
            </p>
          </div>
          <div className="text-center">
            <span className="mono-stat text-xl text-accent-gold font-bold">
              {stats.totalTournaments}
            </span>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">
              турниров
            </p>
          </div>
          <div className="text-center">
            <span className="mono-stat text-xl text-accent-magenta font-bold">
              {stats.topMmr}
            </span>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">
              топ MMR
            </p>
          </div>
        </div>
      </div>

      <StandingsTable
        title="Глобальный рейтинг"
        subtitle={`${stats.totalPlayers} игроков из ${stats.totalTournaments} завершённых турниров. MMR рассчитывается по очкам, победам и поражениям.`}
        entries={entries}
        lastUpdated={formatDate(new Date().toISOString())}
      />
    </main>
  );
}
