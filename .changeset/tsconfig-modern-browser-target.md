---
'@benhigham/tsconfig': minor
---

Modernize the browser-layer `target`/`lib` and tidy `base.json`:

- `browser.json`: raise `target` `ES2015` → `ES2022` and add `DOM.Iterable` to `lib` (`["DOM", "DOM.Iterable", "ESNext"]`). The browser configs are `noEmit` with a real bundler downstream, so the TS target should sit high and let the bundler downlevel per browserslist. This also fixes the inheritance chain (`next.json → react-app.json → browser.json`) silently resolving the effective `target` to `ES2015`.
- `vite.json`: raise `target` `ES2020` → `ES2022` and add `DOM.Iterable` to `lib` (`["DOM", "DOM.Iterable", "ES2022"]`), aligning with current create-vite react-ts defaults.
- `base.json`: align `target` `ES2022` → `ES2023` to match the already-set `lib: ["ES2023"]` and the `node >= 22.13` engines floor (matches `@tsconfig/node22`), and drop the redundant `strictNullChecks` (implied by `strict: true`).

`astro.json` inherits the `DOM.Iterable` fix from `browser.json` for free. Raising `target`/`lib` is additive/more-permissive for `noEmit` consumers; only emitting consumers of `base`/`browser` see reduced downleveling.
