---
'@benhigham/eslint-config': patch
---

Relax `sonarjs/no-floating-point-equality` in test files. The rule flags any float-sensitive operand in an `expect().toBe()/toEqual()` (or a raw `===`), including a correct exact-literal fixture like `toBe(0.6)`, and it has no option to allow exact literals. In test code a genuinely-wrong float assertion fails loudly when the suite runs, so the rule's silent-drift value — the reason it earns its keep in source — is low there. It stays on for source files; suites that want the guard can re-enable it locally and reach for `toBeCloseTo`.
