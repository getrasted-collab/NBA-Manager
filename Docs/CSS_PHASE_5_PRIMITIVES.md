# CSS Phase 5: shared primitive consolidation

Shared primitives were reviewed in the requested order. Consolidation was limited to declarations with an identical selector, at-rule context, property, and computed value. The final declaration remains in its original cascade position.

| Primitive group | Earlier exact declarations removed |
| --- | ---: |
| Reset and typography | 70 |
| Buttons, inputs, and selects | 0 |
| Cards and panels | 1 |
| Tables | 0 |
| Scrollbars | 0 |
| Metrics and status indicators | 0 |
| Shell/sidebar/workspace/page sizing | 0 |
| **Total** | **71** |

The zero-count groups contain overlaps, but not exact cross-file duplicates safe to remove without moving declarations, changing selector scope, or changing cascade behavior. Shell geometry was evaluated last and left unchanged.

Six rule blocks became empty after their final redundant declaration was removed; those empty blocks were then deleted. No stylesheet became empty, and no file was moved, renamed, or deleted.

Verification:

- All 25 navigable routes rendered successfully.
- The simulation smoke test passed.
- Stylesheet block balance passed before empty-block cleanup.
