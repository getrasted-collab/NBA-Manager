# NBA Manager

Electron desktop basketball manager prototype with a dark dashboard UI.

## Play

Double-click:

```text
Launch NBA Manager Electron.cmd
```

For browser-first editing, double-click:

```text
Launch NBA Manager Browser.cmd
```

The browser version uses the root `index.html`, shares the existing `ui/` styles and game logic, stores saves in browser `localStorage`, and loads JSON from the local `data/` folder. Edit the HTML/CSS/JavaScript there first; the Electron shell can continue using the same shared renderer later.

The app opens to the start menu. Choose:

- `Default mode`: quick career mode with games, XP, quests, roster, and cap overview
- `GM mode`: front-office focused mode with team-building and cap control
- `Saves`: open save slots if any exist

After choosing `Default mode` or `GM mode`, select one of all 30 NBA teams.

After choosing a mode, use the left sidebar:

- `main menu`: return to the start menu
- `front office`: GM command center with team overview, cap health, trade center, roster needs, and inbox
- `trade machine`: execute two-team player and draft-pick trades with deadline, eligibility, salary matching, apron, aggregation, roster-limit, no-trade-clause, frozen-pick, and Stepien Rule validation
- `games`: browse an October-April 82-game calendar and advance chronologically; selecting a future date automatically simulates every unplayed game before it
- `game strategy`: set pace, offensive focus, defensive coverage, rebounding, transition, load management, closing groups, stagger rules, minutes limits, and reusable presets
- `locker room`: manage personalities, leadership, role expectations, promises, morale history, chemistry, player meetings, complaints, trade requests, and re-signing risk
- `scouting`: maintain department strengths, scout hidden rating ranges, build a watchlist, compare players, and reveal prospect workouts, medicals, combine results, and interviews
- `transactions`: review mandatory decisions, AI trade proposals, trade-block players, market rumors, unread alerts, and a filterable league transaction ledger
- detailed player cards open from roster, cap, locker-room, scouting, free-agent, and box-score rows, showing season stats, career stats, awards, contract, injury history, team history, and draft information
- `standings`: live East and West standings with playoff seeds, play-in positions, games behind, last 10, and streaks from league-wide simulation
- `postseason`: finish the regular season, simulate the East and West Play-In tournaments, and play through a persistent best-of-seven bracket to crown an NBA champion
- `offseason`: progress through the draft lottery, limited scouting, a two-round NBA Draft, options and qualifying offers, competitive free agency, RFA matching, coaching identity, and roster finalization
- `league history`: review champions, major awards, best records, and retired players across a multi-season career
- completed games include saved player box scores for both teams with minutes, shooting, counting stats, turnovers, and plus/minus
- the season calendar includes NBA Cup group play and knockout games plus a playable five-event All-Star Weekend
- a July-to-July NBA transaction calendar tracks roster cuts, extension eligibility, December 15 trade eligibility, 10-day contracts, guarantees, the trade deadline, playoff waiver eligibility, the lottery, draft, options, and free agency
- `stats`: 2025-26 team stats and NBA league leaders loaded from local JSON
- `season awards`: track live MVP, Defensive Player, Rookie, Sixth Man, Most Improved, All-NBA, All-Defense, and All-Rookie races, then preserve winners in league history and player cards
- `season goals`: career objectives
- `cap sheet`: working contract office with yearly salaries, guarantees, options, Bird rights, RFA/UFA status, cap holds, extension eligibility, first-apron and second-apron restrictions, exception limits, and hard-cap risk
- `roster`: set five starters, bench order, and a valid 240-minute rotation that directly affects simulation strength
- AI front offices evaluate team timelines and positional needs when drafting, bidding on free agents, and completing legal opening-night rosters
- AI front offices also extend players, make legal in-season trades, use the waiver market, send proposals to the user, and explain moves through rumors and transaction logs
- players accumulate career statistics, fatigue, named injuries, recurrence risk, durability, medical status, morale, role satisfaction, development history, age-based progression or decline, and eventual retirement
- roster management includes training focuses, G League assignments, two-way conversions, staff specialists, coaching contracts, and automation stop conditions
- completed games provide tactical summaries that account for possessions, lineup talent, system fit, chemistry, fatigue, coaching, home court, and matchup counters
- GM careers track owner approval, playoff trips, championships, and offseason job offers
- long careers preserve richer season snapshots, All-NBA and defensive teams, Hall of Fame outcomes, jersey retirements, rule votes, and league evolution events
- `league editor`: admin tools for searching, creating, editing, moving, and deleting players across all 30 teams, plus dataset import validation
- `settings`: save career and open the save folder
- `settings` also supports manual career names, automatic save diagnostics, JSON backup import/export, notification controls, automation preferences, and league-rule visibility

## Save Slots

The app stores careers in local save slots. From the start menu, choose `Saves` to load, overwrite, or delete slots. From `settings`, `Save Career` updates the current slot.

## NBA Data Import

The app loads NBA reference data only from local files in `data/`:

```text
data/teams.json
data/playerStats.json
data/game-data.js
```

Install Python dependencies and refresh the files from the project root:

```text
python.cmd -m pip install -r scripts/requirements.txt
python.cmd scripts/import_nba_data.py
```

This project includes a portable Python runtime in `.python/`. You can also double-click `Import NBA Data.cmd` to refresh both JSON files.

The importer uses `nba_api` to fetch NBA teams and 2025-26 regular-season per-game player statistics. It also generates `game-data.js`, allowing a directly opened `index.html` to load stats without browser `file://` fetch errors. The app never calls NBA.com directly.

## Project Layout

```text
electron/   Electron main and preload scripts
ui/         Static app UI, styles, and game logic
node_modules/ Electron runtime and package dependencies
package.json
package-lock.json
Launch NBA Manager Electron.cmd
```
