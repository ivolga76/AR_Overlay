// DarkPanel — semi-transparent panel with ARC Raiders styling
// Blurred background, thin border, rounded corners

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DarkPanelProps {
  children: ReactNode;
  className?: string;
  /** Add hover glow effect */
  hoverable?: boolean;
  /** Make it interactive (wraps in motion.div) */
  interactive?: boolean;
  onClick?: () => void;
}

export function DarkPanel({
  children,
  className = '',
  hoverable = false,
  interactive = false,
  onClick,
}: DarkPanelProps) {
  const baseClass = `dark-panel ${hoverable ? 'dark-panel-hover' : ''} ${className}`;

  if (interactive) {
    return (
      <motion.div
        className={baseClass}
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClass}>{children}</div>;
}
