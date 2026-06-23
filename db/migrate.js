// db/migrate.js — Simple migration runner
// Supports both .sql (executed as SQL script) and .js (imports `up` function).

import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getDb, execScript, query, run, saveToDisk } from './connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, 'migrations');

function ensureMigrationsTable() {
  getDb().run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name       TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

function appliedMigrations() {
  const rows = query('SELECT name FROM _migrations ORDER BY name');
  return new Set(rows.map((r) => r.name));
}

function pendingMigrations() {
  const applied = appliedMigrations();
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql') || f.endsWith('.js'))
    .sort();

  return files.filter((f) => !applied.has(f));
}

export async function migrate() {
  ensureMigrationsTable();
  const pending = pendingMigrations();

  if (pending.length === 0) {
    console.log('[db] migrations: up to date');
    return;
  }

  for (const file of pending) {
    console.log(`[db] running migration: ${file}`);

    if (file.endsWith('.sql')) {
      const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8');
      execScript(sql);
    } else if (file.endsWith('.js')) {
      const moduleUrl = pathToFileURL(join(MIGRATIONS_DIR, file)).href;
      const mod = await import(moduleUrl);
      if (typeof mod.up === 'function') {
        await mod.up(getDb(), { query, run, execScript });
      } else {
        console.warn(`[db] migration ${file} has no up() export, skipping`);
      }
    }

    run('INSERT INTO _migrations (name) VALUES (?)', [file]);
    saveToDisk();
  }

  console.log(`[db] migrations: applied ${pending.length} new migration(s)`);
}
