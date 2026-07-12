# SESSION_HANDOFF — 2026-07-12

## Коммиты за день (20 total)

### Первая половина (фон + данные)
| Коммит | Что |
|--------|-----|
| `6f0e5b0` | Canvas dust particles — 180 дрейфующих частиц |
| `553d61f` | Awesome Animated Background — purple/white flow (CodePen jmbGNd) |
| `d72131d` | fix: rename animate-awesome-* → awesome-*-anim (Tailwind v4 conflict) |
| `f0481d4` | feat: 9 белых вертикальных лучей (точная копия CodePen jmbGNd) |
| `13e384a` | style: лучи ×2 медленнее, blur +200% |
| `a1f19d4` | fix: двойной подсчёт sheet_matches в leaderboard |
| `3aa55f2` | fix: #REF! в rank больше не пропускает игроков при импорте |
| `3a756e8` | feat: кнопка импорта Google Sheets в админке |
| `2b4dc26` | fix: standings показывает только active сезоны |
| `1af144a` | fix: sheet_matches как tournament history |
| `03bae78` | fix: пересчёт wins/losses после заполнения history |
| `f61022d` | feat: инфографика истории турниров (WLRing, карточки) |
| `c401682` | feat: замена истории турниров на виджеты аналитики (карты/противники) |
| `05198a` | chore: update SESSION_HANDOFF + backup script |
| `2ec40dd` | chore: force-add SESSION_HANDOFF.md |

### Вторая половина (MMR-график + фиксы данных)
| Коммит | Что |
|--------|-----|
| `4dce3a5` | **feat: retrospective Elo simulation** — MMR-график по sheet_matches |
| `2132fbc` | **style: Catmull-Rom spline** — плавный график вместо угловатого |
| `26bc00a` | **fix: leaderboard = Google Sheets** — убран Elo override, tournament merge |
| `6394341` | **fix: case-insensitive opponent matching** — виджет «противник» для GOLYB_GENADYI |
| `6a91f80` | **fix: cache: 'no-store' для player stats** — график всегда актуален |

---

## Текущее состояние

### MMR-график (новое)
- **Retrospective Elo**: симуляция по всем sheet_matches сезона (K=32, база=1000)
- Плавный Catmull-Rom сплайн (кубический Безье)
- Отображается на `/player/[playerId]` при ≥2 матчей
- Без кэша — обновляется мгновенно после импорта Sheets
- Если есть турнирные данные (mmrAfter из tournament_standings) — приоритет у них

### Лидерборд (исправлено)
- `GET /api/leaderboard?mode=1x1&season_id=season-2` — **только season_player_ratings**
- Больше не мержит tournament_standings, не переопределяет MMR из players.current_mmr
- **82 игрока 1×1, 25 команд 2×2** — 1:1 с Google Sheets

### Страница игрока
- **Динамика MMR** — сплайн-график (новый)
- **Самая частая карта** — топ-5, cyan бары
- **Самый частый противник** — топ-5, magenta, кликабельные имена
- Case-insensitive сравнение имён (фикс для GOLYB_GENADYI и др.)
- Без fetch-кэша (`cache: 'no-store'`)

### Данные (БД)
- **82 игрока** 1×1, **25 команд** 2×2 (season-2, active)
- **87 sheet_matches**, **24 sheet_teams**
- season-1: archived
- Локальные турниры удалены
- Google Sheets: `1xbsVk-O1EbyaPWoh8lNynZSrH-Y5G3ft7P4GOGW7RB8`, 11 gid
- Бэкап: `/opt/ar-overlay/.data/ar-overlay.db.bak-20260712`

### Админка
- Кнопка «Импортировать из Google Sheets» → `POST /api/import-sheets`

---

## VPS
- `ar-overlay` (3001) — healthy
- `ar-overlay-leaderboard` (3002) — healthy

---

## Pending
- `streak` в tournament_standings — не заполняется
- Страница игрока работает только для players с записью в `players` таблице (большинство из Google Sheets — только в `season_player_ratings`)
- ММР в Google Sheets ≠ Elo-ММР (разные формулы) — график показывает Elo-траекторию

---

## Ключевые файлы
| Файл | Роль |
|------|------|
| `production-server.js` | API leaderboard, retrospective Elo, player stats, import-sheets |
| `leaderboard/src/app/player/[playerId]/page.tsx` | Страница игрока: MMR-график, аналитика, статы |
| `leaderboard/src/lib/api.ts` | API-клиент, getPlayerStats (no-store), enrichStandings |
| `leaderboard/src/components/AnimatedBackground.tsx` | Фон — 9 лучей + тёмный градиент |
| `leaderboard/src/app/standings/page.tsx` | Лидерборд: getGlobalLeaderboard с mode+season_id |
| `leaderboard/src/app/globals.css` | @keyframes floatUp, .light/.x1–.x9, дизайн-система |
| `import-sheets.js` | Парсер CSV из Google Sheets |
| `db/schema.sql` | Полная схема БД |
