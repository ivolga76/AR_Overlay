// PlayerRow — single row in the standings table
// ARC Raiders style: gold top-3, neon hover, mono MMR

import { motion } from 'framer-motion';
import type { StandingEntry } from '@/lib/types';
import { formatMmr } from '@/lib/utils';

interface PlayerRowProps {
  entry: StandingEntry;
  index: number;
}

const medals = ['🥇', '🥈', '🥉'];

export function PlayerRow({ entry, index }: PlayerRowProps) {
  const isTop3 = index < 3;
  const mmr = formatMmr(entry.mmr);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className={`
        dark-panel
        flex items-center gap-3 px-4 py-3
        cursor-default
        ${isTop3 ? 'border-[rgba(255,184,0,0.3)] bg-[rgba(255,184,0,0.03)]' : ''}
        ${!isTop3 ? 'dark-panel-hover' : ''}
      `}
      whileHover={isTop3 ? { scale: 1.015, borderColor: 'rgba(255,184,0,0.5)' } : undefined}
    >
      {/* Rank */}
      <div className="w-10 text-center flex-shrink-0">
        {isTop3 ? (
          <span className="text-xl">{medals[index]}</span>
        ) : (
          <span className="mono-stat text-sm text-text-muted">
            #{entry.rank}
          </span>
        )}
      </div>

      {/* Nickname */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="heading-lg text-base text-text-primary truncate">
            {entry.nickname}
          </span>
          {entry.isTeam && (
            <span className="text-[10px] uppercase tracking-wider text-accent-cyan font-heading font-bold">
              team
            </span>
          )}
        </div>
        <div className="text-xs text-text-muted mt-0.5 truncate">
          {entry.tournamentName}
          {entry.organizerName && (
            <span> · {entry.organizerName}</span>
          )}
        </div>
      </div>

      {/* MMR */}
      <div className="w-16 text-right flex-shrink-0">
        <span className={`mono-stat text-lg font-bold ${mmr.colorClass}`}>
          {mmr.value}
        </span>
      </div>

      {/* Wins / Losses */}
      <div className="w-20 text-right flex-shrink-0 hidden sm:block">
        <span className="mono-stat text-sm text-success">{entry.wins}W</span>
        <span className="mono-stat text-sm text-text-muted mx-1">/</span>
        <span className="mono-stat text-sm text-danger">{entry.losses}L</span>
      </div>

      {/* Chevron */}
      <div className="w-6 text-right flex-shrink-0 text-text-muted opacity-40">
        ›
      </div>
    </motion.div>
  );
}
