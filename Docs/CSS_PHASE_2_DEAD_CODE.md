# CSS Phase 2: dead-code confirmation

## Visual protection in force

CSS cleanup is checked against both user-supplied reference sets:

- `main/visual-state-2026-07-10_07-04-05/`: 20 named light-mode/page checkpoints plus dashboard dark mode, recorded from commit `89b245d`.
- `main/Dark mode/`: 32 dark-mode references, including top/bottom states and standings variants.

These 52 images are the visual source of truth. The original filenames are intentional and must not be normalized during CSS cleanup.

## Confirmation standard

A selector is confirmed dead only when all of the following are true:

1. Its class or id is absent from `index.html` and every JavaScript file under `ui/`.
2. It is not constructed from a template expression, prefix, suffix, or state-name composition.
3. It is not a generic element, attribute, pseudo-class, theme, or utility selector.
4. Removing it does not alter any of the 52 reference screens.

Grouped rules are split before removal; a dead member does not make the other members dead.

## First confirmed and removed runtime batch

The following names had no occurrence in current HTML or JavaScript and did not render on any of the 25 runtime-audited routes. Their isolated blocks and responsive references were removed:

- `profile-strip`
- `start-brand`
- `front-office-hero`
- `front-office-badge`
- `game-link-row`
- `transaction-status-card`
- `transaction-rule-pills`
- `logo-page-title`
- `page-title-team-logo`

## Candidates deliberately held back

The following also lack a direct source occurrence, but are not yet confirmed because they participate in later overrides, responsive groups, or plausible runtime composition:

- `roster-rule-card`, `roster-rule-list`
- `preset-list`, `preset-chip`
- `chemistry-meter`
- `retired-grid`
- `compact-history`
- `scorebox`
- `trade-partner-select`
- `primary-button`, `secondary-button`, `danger-button`
- `action-button`, `filter-button`
- alternate theme roots `theme-dark` and `[data-theme="dark"]`

## Next removal unit

Review the held candidates in small component families. Compare affected reference images after each family and restore any selector that produces a difference.
