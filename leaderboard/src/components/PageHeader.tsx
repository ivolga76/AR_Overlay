// PageHeader — consistent page header with ARC Raiders branding
// Rainbow stripe, title, optional back link

import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({ title, subtitle, backHref, backLabel }: PageHeaderProps) {
  return (
    <header className="rainbow-stripe rounded-lg overflow-hidden mb-8">
      <div className="px-6 py-8 text-center">
        {/* Back link */}
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-accent-cyan hover:text-text-primary font-heading font-bold mb-4 transition-colors"
          >
            <span>‹</span>
            {backLabel ?? 'Назад'}
          </Link>
        )}

        <p className="eyebrow mb-2">Arc Raiders Overlay</p>
        <h1 className="heading-xl text-3xl md:text-4xl text-text-primary crt-glow">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-text-muted text-sm max-w-md mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
