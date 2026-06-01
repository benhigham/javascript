---
'@benhigham/eslint-config': patch
---

Fix a second contradictory vitest matcher pair (same class as the boolean matchers in the previous release). `prefer-called-once` (wants `toHaveBeenCalledOnce()`) and `prefer-called-times` (wants `toHaveBeenCalledTimes(1)`) are direct inverses on a single call, so enabling both left every "called once" assertion flagged by one rule or the other and made the autofix oscillate. Keep `prefer-called-times` (the explicit count form, consistent with preferring strict `toBe(true)` over `toBeTruthy()`) and turn `prefer-called-once` off; it only ever fired on the one-call case.
