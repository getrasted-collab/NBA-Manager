# CSS Phase 4: semantic token centralization

## Reconciled layers

- `01-base-tokens-reset.css` now owns shared semantic aliases and exact geometry tokens.
- `10-shared-career-ui-refinement.css` remaps semantic surfaces, text, borders, and shadows to its legacy dashboard palette.
- `23-shell-broadcast-skin.css` now defines the light broadcast semantic palette, with legacy variable names retained as compatibility aliases.
- `25-shared-scrollbars-metrics-typography.css` consumes shared spacing, radius, and control-height tokens where values matched exactly.
- `32-dashboard-reference-shell.css` consumes its existing concept palette instead of repeating those exact literals.
- `41-theme-dark-surface-repairs.css` exposes semantic dark surface, row, border, and text aliases and consumes exact dark text tokens.
- `43-theme-dark-mode-foundation.css` defines the active dark semantic palette, with the original generic variables retained as compatibility aliases.

## Token groups

- Surfaces: `--surface-page`, `--surface-card`, `--surface-card-soft`, `--surface-card-raised`
- Text: `--text-primary`, `--text-secondary`, `--text-tertiary`
- Borders: `--border-default`, `--border-dark`
- Statuses: `--status-success`, `--status-danger`, `--status-warning`
- Spacing: `--space-1` through `--space-10` for the existing exact spacing steps
- Radii: `--radius-xs`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-pill`
- Shadows: `--shadow-surface`
- Controls: `--control-height-sm`, `--control-height-md`, `--control-height-lg`

Close colors remain separate. In particular, broadcast navy `#071a64` was not merged with concept ink `#071b60`; dark text variants and similar translucent borders also remain distinct.

## Verification

- All seven stylesheets have balanced blocks and no direct custom-property self-cycles.
- All 25 navigable routes rendered successfully after the change.
- The simulation smoke test passed.
- Legacy variable names remain available, limiting the change to value indirection rather than selector behavior.
