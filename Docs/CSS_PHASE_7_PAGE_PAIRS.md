# CSS Phase 7: legacy/current page pairs

## Completed merges

### Startup: former files 02 and startup portion of 35

- Merged into `02-shell-startup.css`.
- File 35 was separated into `35-gameplan-history-layout.css`; unrelated gameplan and league-history rules remain in their original cascade slot.
- Start, Team Select, and Saves screenshots were captured before and after the merge at 1440×900.
- All three screenshots were byte-for-byte identical.

### Menu: former files 03, 08, and 26

- Merged into `03-menu.css` in their original internal order: base menu, opening experience, light opening refresh.
- The former file-08 and file-26 imports were removed.
- Start, Team Select, and Saves screenshots were captured before and after the merge at 1440×900.
- All three screenshots were byte-for-byte identical.

## Remaining pairs

Staff, trade machine, free agency, rotation, player development, finance, league/social pages, scouting, and dashboard/shell remain separate. Each depends on late page-specific or shared correction modules and requires its own before/after route capture.

Scouting and dashboard/shell remain last because their override graphs are the most interconnected.

## Verification

- All 58 imports resolve.
- All 25 navigable routes rendered successfully.
- The simulation smoke test passed.
- The screenshot capture utility is retained at `scripts/css_visual_capture.cjs` for the remaining page-pair comparisons.
