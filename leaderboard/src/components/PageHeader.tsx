// PageHeader — consistent page header with ARC Raiders branding
// Rainbow stripe, title, back link — matches report §1 logo construction

import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({ title, subtitle, backHref, backLabel }: PageHeaderProps) {
  return (
    <header className="rainbow-stripe rounded-lg overflow-hidden mb-8 crt-scanlines">
      <div className="px-6 py-12 text-center">
        {/* Back link */}
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-cyan hover:text-text-primary font-heading font-bold mb-5 transition-colors"
          >
            <span className="text-base">‹</span>
            {backLabel ?? 'Назад'}
          </Link>
        )}

        <p className="eyebrow mb-3 tracking-[0.15em]">ТУРНИР</p>
        <h1 className="heading-lg crt-glow">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-text-muted text-sm max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
