# CSS Phase 8: specificity and import simplification

## Completed safe reduction

- Removed 76 `!important` flags from `02-shell-startup.css`.
- Each removed flag belonged to a selector/property pair with no later exact competitor in the manifest.
- Start, Team Select, and Saves screenshots remained byte-for-byte identical after removal.

## Tested and reverted

The same conservative pass was tested on `03-menu.css`, removing 78 candidate flags. All three protected menu-family screenshots changed, proving that broader or differently scoped later selectors still compete with the menu module. The menu file was restored from its preserved pre-test sources, and the screenshots returned to byte-for-byte equality.

## Deferred work

- Menu `!important` declarations remain until competing selectors are consolidated.
- Late page/theme files retain their specificity because Phase 6 ownership is not complete.
- The manifest was not reordered into architectural groups. Reordering now would change the cascade while files 31–42 still contain mixed ownership.
- No stylesheet is empty, so no file was deleted in this phase.

This phase follows the safety rule that a syntactically removable override is not considered safe unless protected screenshots remain unchanged.
