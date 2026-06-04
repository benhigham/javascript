---
'@benhigham/browserslist-config': major
---

Move the default floor to a single rolling, modern query — `last 2 years and not dead and fully supports es6-module` — replacing the `defaults`-based desktop/mobile arrays. The clauses are intersected with `and` (Browserslist combines array/comma entries with `or`, which would broaden the floor instead of narrowing it), so the floor now lands at roughly Baseline "newly available" (today ~Chrome 126 / Firefox 127 / Safari 17.6), dropping the long tail of low-end and niche engines. Consumers' build output targets narrow accordingly. The `./node` export is unchanged. See ADR-0004.
