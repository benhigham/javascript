---
'@benhigham/eslint-config': patch
---

Relax three vitest rules that proved destructive or high-ceremony on a real app test suite (surfaced while adopting the config in a static Next app).

- **`prefer-called-with` (off):** its autofix rewrites `toHaveBeenCalled()` to `toHaveBeenCalledWith()` — "called with _zero_ arguments" — silently breaking every assertion on a mock that was called with arguments, and it forbids the legitimate "was it called at all" assertion on spies where the arguments aren't the point.
- **`require-mock-type-parameters` (off):** forces a type argument on every `vi.fn()`, including mocks immediately cast to a target type (where the parameter is erased), and isn't reliably auto-fixable in practice.
- **`prefer-expect-assertions` (off):** mandates `expect.assertions(n)` bookkeeping on async/callback/loop tests — a maintenance burden that rarely catches a real bug.

These only relax the curated allowlist (all three are off in `@vitest/eslint-plugin`'s `recommended`); Node-library consumers wanting the stricter set can re-enable them locally.
