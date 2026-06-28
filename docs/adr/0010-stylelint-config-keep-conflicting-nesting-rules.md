# `stylelint-config` keeps `use-nesting` and `selector-no-redundant-nesting-selector` despite their `--fix` conflict

`@benhigham/stylelint-config` enables two rules that disagree on the canonical form of a nested descendant selector, and the disagreement cannot be auto-reconciled:

- `csstools/use-nesting: always` autofixes a pair of un-nested sibling rules into nested form. `.a {} .a p {}` becomes `.a { & p {} }` — `use-nesting` always emits the explicit nesting selector (`& p`), and exposes only `except` / `only` / `syntax`; there is no option to emit bare `p`.
- `scss/selector-no-redundant-nesting-selector: true` then flags that `&` as redundant. The rule fires on exactly `& <combinator> <selector>` (descendant `& p`, child `& > p`, sibling `& + p`) and **not** on `&:hover` or `&.compound`, where the `&` concatenates and is required. It has **no fixer** — it only reports.

So for descendant nesting the two rules want different output (`use-nesting` → `& p`, the redundant rule → `p`), the only autofixer involved produces the form the other rule rejects, and the rejecting rule cannot strip it. `stylelint --fix` therefore does not converge on a clean state for any stylesheet that starts from un-nested descendant rules: the fixer nests `.a p {}` into `& p {}`, and the result is a standing lint error a human must hand-edit (strip the leading `&`). Surfaced in `benhigham/web` #232, where ~7 descendant selectors needed manual `&` stripping after `--fix`.

We keep both rules. We accept that, for descendant nesting, `--fix` is not a complete path to clean and the residual `&` is removed by hand.

The decisive facts are that the friction is narrow and the check has independent value. The conflict only manifests when a stylesheet holds **un-nested** descendant rules and relies on `--fix` to nest them — a flat-stylesheet migration. Code authored nested from the start as `.a { p {} }` triggers neither rule: `use-nesting` has nothing to un-nest, and with no `&` present the redundant rule stays silent. That manually-cleaned state is stable — `use-nesting` does not re-nest an already-nested rule, so `--fix` never reverts the hand-edit. And `selector-no-redundant-nesting-selector` earns its place independently of `use-nesting`: it catches a hand-written redundant `&` and nudges toward the cleaner `p`, which is the descendant form this config prefers. The cost of keeping it — manual `&` cleanup after a `--fix`-driven nest — is the same edit the rule exists to encourage, paid once per descendant nest during a migration.

We rejected the alternatives:

- **Drop `selector-no-redundant-nesting-selector`.** This is the one change that makes `--fix` converge — descendant nests would keep `use-nesting`'s `& p` and nothing would flag it. We declined it because the redundant-`&` check has standalone clarity value and the non-convergence it causes is confined to the migration workflow above. Choosing convergence here would mean canonicalizing on the `& p` form the config otherwise discourages.
- **Scope `use-nesting` away from descendant combinators.** Not cleanly expressible. `except` / `only` match the _potentially-nesting portion_ of the selector (`p` in `.a p`), which is indistinguishable from a compound or pseudo (`:hover`); there is no pattern that means "combinator descendants only." Symmetrically, the redundant rule's `ignoreKeywords` matches only **tag** selectors (`nextNext` of type `tag`), so it cannot even except a class like `& .title`.
- **Drop `use-nesting`.** Contradicts the config's intent to encourage nesting — it is set to `always`, with an SCSS-syntax override — and would lose its non-conflicting value for `&:hover` / `&.compound` nesting.

This is the inverse of the `currentColor` convergence bug ([#133]): there, two rules disagreed but a clean reconciliation existed (list both casings in `ignoreValues`), so it was fixed; here, no auto-reconciliation exists and the rejecting rule has independent value, so we keep the conflict and document it. The general stance: `--fix` reaching a clean, stable state is the goal, so a convergence bug is fixed where a reconciliation exists, but where two independently-valuable rules genuinely cannot converge and the residual is a one-touch manual cleanup confined to a narrow workflow, we keep both and record why.

## Consequences

- **No config change, no changeset.** Both rules stay enabled exactly as before; the resolved config a consumer gets is byte-identical, so this decision owes no changeset under the _Release coverage_ invariant. The deliverables are documentation and test hygiene, not behavior.
- **Documented expectation.** `stylelint --fix` is not guaranteed to reach a clean state for stylesheets containing un-nested descendant rules; the residual `& p` is stripped by hand, after which the file is stable. The recommended authoring style is nested-from-the-start (`.a { p {} }`), which never trips either rule. The config carries a comment at the two rules pointing here so a future contributor does not "fix" the conflict by silently dropping a rule.
- **Test fixture corrected.** The `MODERN_CSS` fixture in the stylelint-config Vitest suite hand-writes `& .title`, the exact descendant form `selector-no-redundant-nesting-selector` rejects — a latent self-inconsistency (the suite only asserts on the two browser-support gates, so it never surfaced). It is corrected to the bare `.title` form the config prefers.
- **Guard test.** A regression test pins the trade-off — that `selector-no-redundant-nesting-selector` flags a hand-written `& p` and that `use-nesting --fix` produces `& p` from un-nested descendants — so the intentional non-convergence is encoded in the suite and cannot be removed silently.

## Refinements

- Builds on **[ADR-0004](./0004-modern-browser-runtime-floor.md)**, which kept `csstools/use-nesting` on at the modern floor; this ADR resolves the downstream interaction that decision left open between `use-nesting` and `selector-no-redundant-nesting-selector`.

[#133]: https://github.com/benhigham/javascript/issues/133
