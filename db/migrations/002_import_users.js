// Migration 002: Import existing users and sessions from JSON files
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', '.data');

export async function up(db, helpers) {
  const { run } = helpers;

  // Import users
  const usersFile = join(DATA_DIR, 'users.json');
  if (existsSync(usersFile)) {
    const users = JSON.parse(readFileSync(usersFile, 'utf8'));
    let imported = 0;
    for (const u of users) {
      const existing = db.exec('SELECT id FROM users WHERE id = ?', { bind: [u.id] });
      if (existing.length > 0 && existing[0].values.length > 0) continue;

      run(
        `INSERT INTO users (id, email, password_hash, salt, display_name, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [u.id, u.email, u.passwordHash, u.salt, u.displayName || null, u.createdAt || new Date().toISOString()]
      );
      imported++;
    }
    console.log(`[migrate:002] imported ${imported} user(s)`);
  } else {
    console.log('[migrate:002] no users.json found, skipping');
  }

  // Import sessions
  const sessionsFile = join(DATA_DIR, 'sessions.json');
  if (existsSync(sessionsFile)) {
    const sessions = JSON.parse(readFileSync(sessionsFile, 'utf8'));
    let imported = 0;
    for (const s of sessions) {
      const existing = db.exec('SELECT token FROM sessions WHERE token = ?', { bind: [s.token] });
      if (existing.length > 0 && existing[0].values.length > 0) continue;

      run(
        'INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)',
        [s.token, s.userId, s.createdAt || new Date().toISOString()]
      );
      imported++;
    }
    console.log(`[migrate:002] imported ${imported} session(s)`);
  } else {
    console.log('[migrate:002] no sessions.json found, skipping');
  }
}
