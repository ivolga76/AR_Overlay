// StandingsTable — full tournament standings table
// ARC Raiders themed: dark panels, rainbow header, sticky columns
// Design reference: arcraiders.com UI aesthetics (§4) + Google Sheets template

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StandingEntry } from '@/lib/types';
import { PlayerRow } from './PlayerRow';
import { SeasonTabs, type SeasonTab } from './SeasonTabs';
import { RainbowStripe } from './RainbowStripe';

const MODE_TABS: SeasonTab[] = [
  { id: 'all', label: 'Все' },
  { id: '1x1', label: '1×1' },
  { id: '2x2', label: '2×2' },
];

interface StandingsTableProps {
  title: string;
  subtitle?: string;
  entries: StandingEntry[];
  lastUpdated?: string;
  isLoading?: boolean;
}

export function StandingsTable({
  title,
  subtitle,
  entries,
  lastUpdated,
  isLoading = false,
}: StandingsTableProps) {
  const [modeFilter, setModeFilter] = useState('all');

  const filtered = useMemo(() => {
    if (modeFilter === 'all') return entries;
    return entries.filter((e) => e.mode === modeFilter);
  }, [entries, modeFilter]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-12">
      {/* Header — rainbow stripe with heading-lg */}
      <RainbowStripe className="rounded-lg overflow-hidden mb-6 crt-scanlines">
        <div className="px-6 py-10 text-center">
          <p className="eyebrow mb-3">ТУРНИРНАЯ ТАБЛИЦА</p>
          <h1 className="heading-lg mb-1 crt-glow">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-text-muted text-sm max-w-lg mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </RainbowStripe>

      {/* Mode Tabs */}
      <div className="flex justify-end mb-5">
        <SeasonTabs tabs={MODE_TABS} active={modeFilter} onChange={setModeFilter} />
      </div>

      {/* Table header */}
      <div className="flex items-center gap-3 px-4 py-2.5 mb-1 text-[10px] uppercase tracking-[0.12em] text-text-muted font-heading font-bold">
        <div className="w-10 text-center">#</div>
        <div className="flex-1">Ник</div>
        <div className="w-16 text-right">MMR</div>
        <div className="w-20 text-right hidden sm:block">W / L</div>
        <div className="w-6" />
      </div>

      {/* Rows */}
      {isLoading ? (
        <LoadingSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <div className="dark-panel px-8 py-16 text-center">
          <p className="heading-label mb-2">Нет данных</p>
          <p className="text-text-muted text-sm">
            Завершённые турниры появятся здесь. Возвращайтесь после первого турнира.
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={modeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-1.5"
          >
            {filtered.map((entry, i) => (
              <PlayerRow
                key={`${entry.tournamentId}-${entry.nickname}`}
                entry={entry}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Footer — matches "Дата последнего обновления" from sheets */}
      {lastUpdated && (
        <div className="mt-8 text-center">
          <p className="text-[11px] text-text-muted tracking-wide">
            Дата последнего обновления: {lastUpdated}
          </p>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="dark-panel flex items-center gap-3 px-4 py-4"
        >
          <div className="skeleton w-8 h-5" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="skeleton w-40 h-4" />
            <div className="skeleton w-24 h-3" />
          </div>
          <div className="skeleton w-12 h-5" />
          <div className="skeleton w-16 h-4 hidden sm:block" />
          <div className="w-6" />
        </div>
      ))}
    </div>
  );
}
