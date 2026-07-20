// Season overview page — shows description and links to ratings/matches/teams
// V2: matches new dark/cream/cyan design
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { DarkPanel } from '@/components/DarkPanel';
import { FeatureCard } from '@/components/FeatureCard';
import { getSeason } from '@/lib/api';
import { formatDate } from '@/lib/utils';

function SwordsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
      <line x1="4" y1="4" x2="14" y2="14" />
      <line x1="24" y1="4" x2="14" y2="14" />
      <line x1="14" y1="14" x2="14" y2="24" />
      <line x1="10" y1="20" x2="18" y2="20" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
      <path d="M6 8l8-4 8 4v5c0 5-3 9-8 11-5-2-8-6-8-11V8z" />
      <line x1="11" y1="13" x2="13.5" y2="16" />
      <line x1="13.5" y1="16" x2="18" y2="10" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
      <rect x="5" y="3" width="18" height="22" rx="2" />
      <line x1="9" y1="8" x2="19" y2="8" />
      <line x1="9" y1="13" x2="19" y2="13" />
      <line x1="9" y1="18" x2="14" y2="18" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
      <circle cx="10" cy="8" r="3" />
      <circle cx="18" cy="8" r="3" />
      <path d="M4 22c0-3 2.5-6 6-6 1 0 1.5.5 2.5 1" />
      <path d="M24 22c0-3-2.5-6-6-6-1 0-1.5.5-2.5 1" />
      <line x1="12" y1="17" x2="16" y2="17" />
    </svg>
  );
}

interface Props { params: Promise<{ seasonId: string }> }
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seasonId } = await params;
  const data = await getSeason(seasonId);
  if (!data) return { title: 'Сезон не найден' };
  return { title: `${data.season.name} — AR Overlay`, description: data.season.description || `Турнирный сезон «${data.season.name}»` };
}

export default async function SeasonPage({ params }: Props) {
  const { seasonId } = await params;
  const data = await getSeason(seasonId);
  if (!data) notFound();
  const { season, stats } = data;

  const statClass = 'font-mono font-bold text-2xl tabular-nums';
  const labelClass = 'text-[10px] uppercase tracking-wider text-[#8b867b] mt-1 font-heading';

  return (
    <main className="flex-1">
      <PageHeader title={season.name} subtitle={season.description || undefined} backHref="/" backLabel="На главную" />

      <section className="max-w-4xl mx-auto px-4 pb-16">
        <DarkPanel className="mb-8">
          <div className="flex flex-wrap justify-center gap-8 py-4">
            <div className="text-center">
              <span className={`${statClass} text-[#00e5ff]`}>{stats.tournaments_total}</span>
              <p className={labelClass}>всего турниров</p>
            </div>
            <div className="text-center">
              <span className={`${statClass} text-[#ffb800]`}>{stats.tournaments_completed}</span>
              <p className={labelClass}>завершено</p>
            </div>
            <div className="text-center">
              <span className={`${statClass} ${season.status === 'active' ? 'text-[#22c55e]' : 'text-[#8b867b]'}`}>
                {season.status === 'active' ? 'АКТИВЕН' : 'АРХИВ'}
              </span>
              <p className={labelClass}>статус</p>
            </div>
          </div>
        </DarkPanel>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href={`/season/${seasonId}/1x1`}><FeatureCard title="Рейтинг 1×1" description="Индивидуальный рейтинг игроков в формате 1 на 1. MMR, победы, поражения." icon={<SwordsIcon />} /></Link>
          <Link href={`/season/${seasonId}/2x2`}><FeatureCard title="Рейтинг 2×2" description="Командный рейтинг в формате 2 на 2. Кооперативные сражения." icon={<ShieldIcon />} /></Link>
          <Link href={`/season/${seasonId}/matches`}><FeatureCard title="История матчей" description="Все завершённые матчи сезона. Победители, участники, даты." icon={<ListIcon />} /></Link>
          <Link href={`/season/${seasonId}/teams`}><FeatureCard title="Составы команд" description="Все команды 2×2, участвовавшие в сезоне. Составы и результаты." icon={<UsersIcon />} /></Link>
        </div>

        {season.started_at && (
          <p className="text-center text-[#8b867b] text-xs mt-8">
            Сезон начался: {formatDate(season.started_at)}
            {season.ended_at && ` · Завершён: ${formatDate(season.ended_at)}`}
          </p>
        )}
      </section>
    </main>
  );
}
