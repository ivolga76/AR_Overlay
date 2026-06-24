// RainbowStripe — ARC Raiders signature diagonal rainbow overlay
// Used as a decorative section separator or header background

import { type ReactNode } from 'react';

interface RainbowStripeProps {
  children?: ReactNode;
  className?: string;
  /** Show as a top border stripe instead of overlay */
  variant?: 'overlay' | 'border-bottom';
}

export function RainbowStripe({
  children,
  className = '',
  variant = 'overlay',
}: RainbowStripeProps) {
  if (variant === 'border-bottom') {
    return (
      <div className={`rainbow-border-bottom ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`rainbow-stripe ${className}`}>
      {children}
    </div>
  );
}

/** Horizontal rainbow separator line */
export function RainbowDivider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-[2px] w-full ${className}`}
      style={{
        background:
          'linear-gradient(90deg, #0080ff, #00cc44, #e83030, #ffcc00)',
      }}
    />
  );
}
