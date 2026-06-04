---
'@benhigham/stylelint-config': minor
---

Modernize the browser-support and CSS Modules handling (ADR-0004); every change relaxes, so no previously-passing stylesheet newly fails:

- Remove `stylelint-media-use-custom-media` (plugin, the `csstools/media-use-custom-media` rule, and the dependency): `@custom-media` is not Baseline at any floor and the Tailwind/PostCSS pipeline doesn't transpile it, so requiring it shipped dead `@media (--x)` rules.
- Set `plugin/no-unsupported-browser-features` to `[true, { ignorePartialSupport: true }]` so it agrees with `plugin/use-baseline: newly` at the modern floor instead of contradicting it.
- Complete the `*.module.{css,scss}` override so CSS Modules' `:global`/`:local` pseudos and `composes` property no longer fail lint (`selector-pseudo-class-no-unknown`, `property-no-unknown`).
- Set `plugin/no-low-performance-animation-properties` to `[true, { ignore: 'paint-properties' }]`, so animating paint properties (color, box-shadow, ...) is no longer flagged; only layout-triggering properties are.
