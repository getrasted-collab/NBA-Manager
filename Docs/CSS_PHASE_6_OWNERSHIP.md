# CSS Phase 6: late-correction ownership

## Completed safe ownership moves

The final two cascade slots were handled first, preserving their exact source order:

- File 45 was renamed from a generic “final fixes” module to `45-tools-settings.css`. Its contents are exclusively settings/tools rules.
- File 44 was split at its existing comment-delimited boundaries into 16 ordered page/theme modules covering gameplan, trade, rotation, free agency, staff, social, standings, shared simulation actions, and dashboard behavior.

All 16 file-44 modules remain consecutive in the manifest, in the exact order their rules previously appeared. The settings module remains after them. This changes ownership without moving a rule earlier or later in the cascade.

## Deferred mixed layers

Files 31–42 remain in their current cascade positions. Several do not have reliable ownership boundaries—especially file 42, whose rules mix dashboard, controls, themes, and individual pages without section markers. Moving those rules requires selector-level computed-style comparison, not filename-only splitting.

The next safe unit is to classify file 42 rule-by-rule into dashboard, shared controls, and page-specific groups while retaining a generated source-order map. Files 41, 38/37, 36, 35/34, 33, and 31 follow after that.

## Verification

- All 60 stylesheet imports resolve.
- Every imported stylesheet has balanced blocks.
- All 25 navigable routes rendered successfully.
- The simulation smoke test passed.
