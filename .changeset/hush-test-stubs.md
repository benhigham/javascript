---
'@benhigham/eslint-config': patch
---

Relax `unicorn/no-top-level-assignment-in-function` and `unicorn/no-global-object-property-assignment` in test files. Both are recommended `error` since unicorn v71 and expose no options, yet they fire on idiomatic Vitest setup: module-scope capture assigned in a `beforeEach` / stubbed-class constructor / `vi.mock` factory, and stubbing a browser global (`window.scrollBy = spy`). A genuinely-wrong stub fails loudly when the suite runs, so the rules' silent-drift value — the reason they earn their keep in source — is low there. They stay on for source files; suites that want the guard can re-enable them locally.
