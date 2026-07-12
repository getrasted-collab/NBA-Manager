# NBA Manager UI Phase 1 Baseline

Date: 2026-07-11  
Baseline viewport: 1440 x 900  
Branch at capture: `main`

## Worktree protection

The UI upgrade begins from a worktree that already contains user changes. These files must be preserved and treated as pre-existing work:

- `ui/renderer.js`
- `ui/styles/47-social-post-interactions.css`

No legacy stylesheet is removed during the vertical-slice experiment. New upgrade work belongs in `ui/styles/48-game-ui-upgrade-sandbox.css`, behind the opt-in `.game-ui-upgrade` body class.

## Primary navigation

The career shell exposes these persistent sidebar destinations:

1. Dashboard (`dashboard`)
2. Schedule (`play`)
3. Standings (`standings`)
4. Roster (`inventory`)
5. Rotation (`rotation`)
6. Gameplan (`strategy`)
7. Trades (`trade`)
8. Free Agency (`offseason`)
9. Locker Room (`locker`)
10. Player Development (`development`)
11. Staff (`staff`)
12. Scouting (`scouting`)
13. Finances (`finances`)
14. Social (`social`)
15. League Stats (`stats`)
16. Awards (`awards`)
17. League History (`history`)
18. Settings (`settings`)

The top navigation also groups routes into Season, Team, Front Office, League, and Tools. Additional routed views include Postseason, Cap Sheet, Season Goals, Transactions, League Editor, save slots, and team selection.

## Important interaction inventory

### Career and navigation

- Start or continue a career from the main menu.
- Select a team and load, create, or delete save slots.
- Move between top-level sections and sidebar destinations.
- Return to the career menu.
- Toggle light/dark mode.
- Use the persistent next-game card to simulate the next game.

### Season

- Simulate the next game, week, scheduled game, season event, or postseason series.
- Open Simcast, change its speed, and issue coaching/preset commands.
- Change standings view and scope, including conference, division, wildcard, cup, streak, and power-ranking views.
- Advance transaction and offseason deadlines.

### Team management

- Browse all team rosters and open a player detail card.
- Waive players and sign in-season free agents.
- Edit rotation positions, minutes, roles, and lineup presets.
- Change gameplan and coaching-style settings.
- Hold player meetings and manage locker-room concerns.
- Assign development and G League actions.

### Front office

- Select trade partners, players, picks, and multi-team routes; submit trade offers.
- Hire staff and manage staff-market actions.
- Scout, watch, and compare players and prospects.
- Filter transactions and follow linked transaction details.
- Review financial controls, payroll, cap, and organizational summaries.

### League and social

- Filter league statistics, awards, and history views.
- Create, schedule, edit, publish, or cancel social posts.
- Follow accounts, react, reply, view linked games/transactions, and use direct messages.
- Mark notifications as read and filter notification categories.

## Baseline screenshots

Fresh captures are stored in `main/phase-1-baseline-2026-07-11/`. They are generated with the app's isolated visual-capture runner, which uses temporary user data and blocks network requests so it does not modify career saves.

The baseline set covers the main menu, team selection, saves, dashboard, schedule, standings, roster, rotation, gameplan, trade machine, free agency, locker room, player development, staff, scouting, finances, social, league statistics, awards, league history, transactions, and settings.

## Upgrade isolation contract

- Add new work to the sandbox stylesheet first.
- Scope every experimental selector beneath `body.game-ui-upgrade`.
- Prefer new reusable component classes over page-specific overrides.
- Do not rename existing routes or data attributes during the visual experiment.
- Do not delete or consolidate legacy CSS until the vertical slice is approved.
- Compare every milestone with this screenshot baseline before expanding its scope.
