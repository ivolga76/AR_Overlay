// Home page — tournament standings hub
// ARC Raiders themed landing with season cards

import Link from 'next/link';
import { RainbowStripe } from '@/components/RainbowStripe';
import { DarkPanel } from '@/components/DarkPanel';
import { getTournaments } from '@/lib/api';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function HomePage() {
  const tournaments = await getTournaments();
  const completed = tournaments.filter((t) => t.status === 'completed');

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-12">
        <RainbowStripe className="rounded-lg overflow-hidden">
          <div className="px-6 py-16 text-center">
            <p className="eyebrow mb-3">Arc Raiders Overlay</p>
            <h1 className="heading-xl text-4xl md:text-5xl text-text-primary crt-glow mb-4">
              Битва за Респект
            </h1>
            <p className="text-text-muted text-lg max-w-md mx-auto mb-8">
              Турнирная таблица сообщества Arc Raiders.
              Следи за рейтингом игроков и команд.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/standings"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                  bg-accent-cyan text-bg-primary font-heading font-bold uppercase text-sm tracking-wider
                  hover:shadow-[0_0_24px_rgba(0,255,255,0.3)] transition-shadow"
              >
                Глобальный рейтинг
              </Link>
              {completed.length > 0 && (
                <span className="inline-flex items-center gap-2 px-4 py-3 text-sm text-text-muted">
                  <span className="live-dot" />
                  {completed.length} турнир
                  {completed.length % 10 === 1 && completed.length % 100 !== 11
                    ? ''
                    : completed.length % 10 >= 2 &&
                      completed.length % 10 <= 4 &&
                      !(completed.length % 100 >= 12 && completed.length % 100 <= 14)
                    ? 'а'
                    : 'ов'}{' '}
                  завершено
                </span>
              )}
            </div>
          </div>
        </RainbowStripe>
      </section>

      {/* Tournament Cards */}
      {completed.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <hr className="neon-divider flex-1" />
            <span className="eyebrow flex-shrink-0">Завершённые турниры</span>
            <hr className="neon-divider flex-1" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {completed.slice(0, 6).map((t) => (
              <Link key={t.id} href={`/standings/${t.id}`}>
                <DarkPanel hoverable interactive className="p-5 cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="heading-lg text-base text-text-primary truncate">
                        {t.name}
                      </h3>
                      <p className="text-xs text-text-muted mt-1">
                        {t.mode === '1x1' ? '1×1' : '2×2'}
                        {t.completed_at && (
                          <span>
                            {' · '}
                            {new Date(t.completed_at).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-accent-cyan text-lg flex-shrink-0">→</span>
                  </div>
                </DarkPanel>
              </Link>
            ))}
          </div>

          {completed.length > 6 && (
            <div className="text-center mt-4">
              <Link
                href="/standings"
                className="text-xs uppercase tracking-wider text-accent-cyan hover:text-text-primary font-heading font-bold transition-colors"
              >
                Все турниры ({completed.length}) →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="text-center py-8 border-t border-[rgba(234,224,205,0.04)]">
        <p className="text-xs text-text-muted">
          AR Overlay · Arc Raiders community tool ·{' '}
          <a
            href="https://github.com/ivolga76/AR_Overlay"
            className="text-accent-cyan hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
