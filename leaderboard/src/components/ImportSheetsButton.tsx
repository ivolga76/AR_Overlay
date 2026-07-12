'use client';

import { useState } from 'react';
import { importSheets } from '@/lib/api';

export function ImportSheetsButton({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await importSheets(token);
      if (res.ok) {
        const items = Object.entries(res.result)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n');
        setResult(items);
      } else {
        setError('Ошибка импорта');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[rgba(12,13,17,0.86)] border border-[rgba(234,224,205,0.12)] rounded-lg p-6 mb-8">
      <h2 className="font-heading font-bold text-lg uppercase tracking-[0.04em] text-[#eae0cd] mb-4">
        Импорт из Google Sheets
      </h2>
      <p className="text-[#8b867b] text-sm mb-4">
        Загрузить актуальные данные рейтингов, матчей, контрактов и протоколов из Google Таблицы.
      </p>

      <button
        onClick={handleImport}
        disabled={loading}
        className={`px-6 py-3 rounded-lg font-heading font-bold text-sm uppercase tracking-[0.06em] transition-all duration-200 ${
          loading
            ? 'bg-[#2a2d35] text-[#8b867b] cursor-wait'
            : 'bg-[#00e5ff] text-[#0a0a0c] hover:bg-[#7ff4ff] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]'
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-[#0a0a0c] border-t-transparent rounded-full animate-spin" />
            Импорт...
          </span>
        ) : (
          'Импортировать из Google Sheets'
        )}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] rounded-lg">
          <p className="text-[#22c55e] font-mono text-xs whitespace-pre-wrap">{result}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-lg">
          <p className="text-[#ef4444] font-mono text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}
