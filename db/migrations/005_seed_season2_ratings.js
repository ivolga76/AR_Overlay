// Migration 005 seed: import Season 2 1x1 ratings from Google Sheets
// Source: https://docs.google.com/spreadsheets/d/1oDrIVsXs3MZnNobpvGR19el4P6zwsdDMH98vyr7xi2g
// Re-runnable: deletes old data, re-imports fresh from sheet.

const SEASON_ID = 'season-2';
const MODE = '1x1';
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1oDrIVsXs3MZnNobpvGR19el4P6zwsdDMH98vyr7xi2g/gviz/tq?tqx=out:csv&gid=0';

function parseCSV(text) {
  const rows = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        rows.push(current);
        current = '';
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && i + 1 < text.length && text[i + 1] === '\n') i++;
        rows.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  if (current !== '' || text.endsWith(',') || text.endsWith('\n')) {
    rows.push(current);
  }
  return rows;
}

function parseRatingsFromCSV(csvText) {
  const cells = parseCSV(csvText);

  // The sheet has 11 columns per row:
  // 0: empty, 1: Место, 2: Ник, 3: Победы, 4: Поражения, 5: Побед подряд,
  // 6: title/social labels, 7-10: social links, date note
  const COLS = 11;
  const players = [];
  let rank = 1;

  for (let i = COLS; i < cells.length; i += COLS) {
    const placeCell = cells[i + 1]?.trim();
    const nick = cells[i + 2]?.trim();
    const winsRaw = cells[i + 3]?.trim();
    const lossesRaw = cells[i + 4]?.trim();
    const streakRaw = cells[i + 5]?.trim();

    // Skip header row and non-player rows
    if (!nick || nick === 'Ник' || nick.startsWith('https://') || nick.startsWith('t.me/')) continue;
    // Skip social link rows
    if (placeCell === 'Telegram:' || placeCell === 'Twitch:' || placeCell === 'YouTube:'
        || placeCell === 'Discord:' || placeCell === 'Boosty:') continue;

    const wins = parseInt(winsRaw) || 0;
    const losses = parseInt(lossesRaw) || 0;
    const streak = parseInt(streakRaw) || 0;

    // MMR formula: base 1000 + wins*25 - losses*15 + streak*5
    const mmr = 1000 + wins * 25 - losses * 15 + streak * 5;

    players.push({
      rank,
      nickname: nick,
      wins,
      losses,
      streak,
      mmr: Math.max(0, mmr),
    });

    rank++;
  }

  return players;
}

export async function up(db, helpers) {
  const { query, run } = helpers;

  console.log('[migrate:005] fetching Season 2 1x1 ratings from Google Sheets...');

  let csvText;
  try {
    const response = await fetch(SHEET_CSV_URL, {
      headers: { 'Accept': 'text/csv' },
    });
    if (!response.ok) {
      console.error(`[migrate:005] HTTP ${response.status} — sheet not accessible, skipping`);
      return;
    }
    csvText = await response.text();
  } catch (err) {
    console.error(`[migrate:005] fetch failed: ${err.message} — skipping`);
    return;
  }

  const players = parseRatingsFromCSV(csvText);
  if (players.length === 0) {
    console.error('[migrate:005] no players parsed from CSV, skipping');
    return;
  }

  console.log(`[migrate:005] parsed ${players.length} players`);

  // Delete old ratings for this season+mode
  run('DELETE FROM season_player_ratings WHERE season_id = ? AND mode = ?', [SEASON_ID, MODE]);

  // Insert new ratings
  const now = new Date().toISOString();
  for (const p of players) {
    run(
      `INSERT OR REPLACE INTO season_player_ratings
       (season_id, mode, rank, nickname, wins, losses, streak, mmr, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [SEASON_ID, MODE, p.rank, p.nickname, p.wins, p.losses, p.streak, p.mmr, now]
    );
  }

  console.log(`[migrate:005] imported ${players.length} ratings for ${SEASON_ID} ${MODE}`);
}
