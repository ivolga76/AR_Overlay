// Global Standings page — all completed tournaments leaderboard
// ISR revalidated every 60 seconds

import type { Metadata } from 'next';
import { StandingsTable } from '@/components/StandingsTable';
import { getGlobalLeaderboard } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Глобальный рейтинг — AR Overlay',
  description: 'Турнирная таблица всех завершённых турниров Arc Raiders',
};

export const revalidate = 60;

export default async function StandingsPage() {
  const entries = await getGlobalLeaderboard(100);

  return (
    <main className="flex-1">
      <StandingsTable
        title="Глобальный рейтинг"
        subtitle="Все завершённые турниры. MMR рассчитывается по очкам, победам и поражениям."
        entries={entries}
        lastUpdated={formatDate(new Date().toISOString())}
      />
    </main>
  );
}
