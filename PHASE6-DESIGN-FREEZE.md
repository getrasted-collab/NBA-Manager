# Phase 6 Design Freeze

The approved shell, dashboard, player presentation, and SimCast establish the visual reference for the remaining screens.

The screenshot files in `main/Approved/` are the locked visual references. Phase 6 extends their system to remaining screens; it must not redesign or reinterpret those approved screens.

## Frozen foundations

- **Colors:** navy/charcoal surfaces, white content, muted blue-gray supporting text, live team colors, and semantic blue/green/gold/red/purple states.
- **Card depth:** 12px card corners, bright upper edge, dark lower bevel, layered cast shadow, and restrained team-color lighting.
- **Typography:** Bebas Neue for display figures, Rajdhani for headings and numbers, and Inter/Segoe UI for body copy.
- **Buttons:** 38px minimum height, 8px corners, dark secondary surface, team-colored primary surface, visible hover/focus/disabled states.
- **Navigation:** full-width top rail, purple selected sidebar item, gold leading icon, blue trailing arrow, and compact notification badges.
- **Patterns:** faded team-colored dot texture only; patterns remain decorative and may not reduce text contrast.
- **Scrollbars:** 5px, transparent/dark track, muted team-tinted thumb, and subtle hover brightening.

## Reuse rules

1. Use tokens and primitives from `ui/styles/49-phase6-design-freeze.css`.
2. Do not redefine frozen tokens inside individual screen stylesheets.
3. Use team colors for identity and selection, not for large blocks of body text.
4. Use semantic colors only for their approved meanings.
5. Keep decorative patterns behind content and below the frozen opacity.
6. New card variants must preserve the frozen border, radius, and depth hierarchy.
7. New controls must include hover, focus-visible, active, disabled, and loading states.
8. Changes to the frozen layer require a deliberate system-wide review.

## Shared components

- `.phase6-card` — standard card surface and depth
- `.phase6-card--accent` — elevated section card with a shared accent edge
- `.phase6-card--hero` — branded hero treatment
- `.phase6-button` and `.phase6-button.primary` — secondary and primary actions
- `.phase6-nav-item` — navigation state treatment
- `.phase6-pattern-host` — approved franchise pattern
- `.phase6-scroll` — approved subtle scrollbar

Screen styles may control layout, sizing, and content composition, but must not redefine these shared visual treatments.

## Phase 6 screen order

1. Roster and rotation
2. Schedule and standings
3. Trades
4. Scouting
5. Free agency
6. Staff and player development
7. Finances
8. Social and locker room
9. League statistics, awards, and history
10. Settings and save management
