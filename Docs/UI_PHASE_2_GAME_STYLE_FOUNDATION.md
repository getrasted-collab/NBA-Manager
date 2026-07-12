# NBA Manager UI Phase 2: Game-Style Foundation

The Phase 2 foundation lives in `ui/styles/48-game-ui-upgrade-sandbox.css`. It is inactive unless the document body has the `game-ui-upgrade` class.

## Direction

The system carries the dark start screen into the career UI with a navy/charcoal surface ladder, restrained team-color accents, sports display typography, compact controls, crisp borders, and readable numerical data. Team identity inherits the application's existing live `--team-primary`, `--team-secondary`, and `--team-contrast` values.

## Typography roles

- Display: Bebas Neue for large franchise, matchup, and result moments.
- Heading/control: Rajdhani for section headings, buttons, tabs, and labels.
- Body: Inter for descriptions, dense tables, forms, and supporting information.
- Numeric: Rajdhani with tabular lining numerals for scores, ratings, records, statistics, and currency.

## Token groups

- Surfaces: `--game-bg-*`, `--game-surface-*`, and `--game-overlay`.
- Text: `--game-text`, `--game-text-soft`, `--game-text-muted`, and `--game-text-dim`.
- Borders/focus: `--game-border-*` and `--game-focus`.
- Team identity: `--game-team`, `--game-team-secondary`, `--game-team-soft`, `--game-team-border`, and `--game-team-glow`.
- Status: success, warning, danger, info, injury, fatigue, and three morale levels.
- Layout: a 4px-based spacing scale and three control heights.
- Shape/elevation: five practical radii, pill radius, and low/card/high/team shadows.
- Motion: fast, standard, and reveal durations using one shared easing curve.

## Foundation components

- `.game-card` with default, hover/focus, selected, and disabled states.
- `.game-button` with default, primary, danger, focus, active, disabled, and loading states.
- `.game-tabs` / `.game-tab` with hover, active, focus, and disabled states.
- `.game-table` with compact headers, numeric alignment, row separators, and hover feedback.
- `.game-badge` / `.game-status` with success, warning, danger, info, injury, fatigue, and morale variants.
- `.game-alert` with informational, success, warning, and danger variants.
- `[data-game-tooltip]` for accessible hover/focus help text.
- `.game-skeleton` and `.is-loading` for loading feedback.

## Accessibility and interaction rules

- Interactive components receive a visible two-pixel focus ring.
- Semantic states use text and shape in addition to color.
- Disabled controls remain legible and visibly non-interactive.
- Tables use tabular numerals for alignment.
- Tooltips work on keyboard focus as well as hover.
- Reduced-motion preferences suppress non-essential animation.

## Adoption rule

Phase 3 may add `game-ui-upgrade` only to a controlled preview path. Existing generic classes are not globally remapped yet. Vertical-slice markup should adopt the new component classes deliberately, and each adoption should be checked against the Phase 1 screenshots.
