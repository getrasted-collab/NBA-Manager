# CSS Phase 6: late-correction ownership

## Completed safe ownership moves

The final two cascade slots were handled first, preserving their exact source order:

- File 45 was renamed from a generic “final fixes” module to `45-tools-settings.css`. Its contents are exclusively settings/tools rules.
- File 44 was split at its existing comment-delimited boundaries into 16 ordered page/theme modules covering gameplan, trade, rotation, free agency, staff, social, standings, shared simulation actions, and dashboard behavior.
- File 42 was classified rule-by-rule into 48 contiguous ownership sections.
- Files 41, 38/37, 36, 35/34, 33, and 31 were classified the same way, producing explicit inline ownership boundaries while retaining their original files and cascade slots.

All classified sections and file-44 modules remain in the exact order their rules previously appeared. This documents ownership without moving a rule earlier or later in the cascade. The nine classified files are whitespace-normalized equivalent to the checkpoint source after ownership comments are excluded.

## Ownership classification completed

Ownership boundaries now cover files 31, 33–38, 41, and 42. File 37 remains identified as shared action-center/scroll behavior even where individual page selectors are required.

Physical subfiles were tested and rejected because 184 nested imports increased audit time substantially. Inline ownership sections provide the same classification without adding browser requests.

## Verification

- All 60 stylesheet imports resolve.
- Every imported stylesheet has balanced blocks.
- All 25 navigable routes rendered successfully.
- The simulation smoke test passed.
