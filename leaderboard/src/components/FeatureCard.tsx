// FeatureCard — 4-column grid card for "About / Features" section
// Matches arcraiders.com "An extraction adventure" etc. cards

import { type ReactNode } from 'react';
import { DarkPanel } from './DarkPanel';

interface FeatureCardProps {
  icon: string; // emoji or text icon
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <DarkPanel className="p-6 flex flex-col gap-3 text-center">
      <span className="text-3xl">{icon}</span>
      <h3 className="heading-label text-sm">{title}</h3>
      <p className="text-xs text-text-muted leading-relaxed">{description}</p>
    </DarkPanel>
  );
}
