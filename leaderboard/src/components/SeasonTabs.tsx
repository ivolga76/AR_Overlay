// SeasonTabs — mode/season filter tabs
// ARC Raiders style: neon cyan active, muted inactive

'use client';

import { motion } from 'framer-motion';

export type SeasonTab = {
  id: string;
  label: string;
};

interface SeasonTabsProps {
  tabs: SeasonTab[];
  active: string;
  onChange: (id: string) => void;
}

export function SeasonTabs({ tabs, active, onChange }: SeasonTabsProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-[rgba(20,20,26,0.6)] border border-[rgba(234,224,205,0.04)]">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative px-4 py-2 rounded-md text-sm font-heading font-bold uppercase tracking-wider
              transition-colors duration-200
              ${
                isActive
                  ? 'text-accent-cyan crt-glow-cyan'
                  : 'text-text-muted hover:text-text-primary'
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="season-tab-indicator"
                className="absolute inset-0 bg-[rgba(0,255,255,0.08)] rounded-md border border-[rgba(0,255,255,0.2)]"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
