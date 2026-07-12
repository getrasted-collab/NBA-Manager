# NBA Manager UI Phase 3: Shared Shell and Navigation

Phase 3 activates the opt-in game UI foundation for career routes while leaving the main menu, team selection, and save screens unchanged.

## Preserved behavior

- All route IDs, page order, and navigation event handlers are unchanged.
- The full career sidebar remains available.
- Top navigation retains Season, Team, Front Office, League, and Tools.
- The persistent next-game simulation control retains its existing action.
- Dark-mode toggle and career-menu behavior remain intact.
- Page content remains owned by existing page styles until the vertical-slice phase.

## Upgraded shell

- The career frame now uses the Phase 2 navy/charcoal surface ladder.
- The top bar has a restrained team-color broadcast line and clearer brand hierarchy.
- Top navigation uses sports typography, improved hover/focus feedback, and a visible active indicator.
- The franchise sidebar uses compact navigation rows, team-colored selection, and improved team identity.
- The next-game card has stronger matchup hierarchy and a team-themed simulation action.
- Career workspace framing adds a subtle grid and team-color ambient light without changing page layouts.
- Keyboard focus is visible across shared navigation controls.

## Activation

`render()` applies `body.game-ui-upgrade` to career routes and removes it from `start`, `team-select`, and `saves`. The class remains the boundary for all new shell styling.
