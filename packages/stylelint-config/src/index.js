/** @import { Config } from 'stylelint' */

/** @type {Config} */
const config = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  plugins: [
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-declaration-strict-value',
    'stylelint-high-performance-animation',
    'stylelint-gamut',
    'stylelint-use-nesting',
    'stylelint-plugin-use-baseline',
    'stylelint-no-unsupported-browser-features',
  ],
  rules: {
    // Browser compatibility
    'plugin/use-baseline': [true, { available: 'newly' }],
    // `ignorePartialSupport` drops residual caniuse "partial support" pedantry so
    // this gate (caniuse vs the floor) agrees with `use-baseline: newly` (Baseline
    // data) instead of fighting it at the modern floor. See ADR-0004.
    'plugin/no-unsupported-browser-features': [true, { ignorePartialSupport: true }],

    // Performance
    // Narrow to layout-triggering properties only; animating paint properties
    // (color, box-shadow, …) is common and acceptable, so don't flag it.
    'plugin/no-low-performance-animation-properties': [true, { ignore: 'paint-properties' }],

    // SCSS-specific rules
    'scss/at-rule-no-unknown': true,
    // Flags a redundant `&` before a combinator (e.g. `& p`). Kept on alongside
    // `csstools/use-nesting` even though the two don't converge under `--fix` on
    // descendant nesting — use-nesting emits `& p`, this rule rejects it, and it
    // has no fixer. Intentional trade-off; don't drop either rule. See ADR-0010.
    'scss/selector-no-redundant-nesting-selector': true,
    'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9]+$',
    'scss/at-extend-no-missing-placeholder': true,
    'scss/load-partial-extension': 'never',
    'scss/at-mixin-pattern': '^[a-z][a-zA-Z0-9]+$',

    // Selector and class naming
    'selector-max-id': 0,
    'selector-max-specificity': '0,3,2',
    'max-nesting-depth': 3,

    // General consistency
    'color-named': 'never',
    'scale-unlimited/declaration-strict-value': [
      ['/color$/', 'font-size', 'z-index'],
      { ignoreValues: ['currentColor', 'inherit', 'transparent'] },
    ],
    'declaration-property-unit-allowed-list': {
      'font-size': ['em', 'rem', '%'],
      'line-height': ['', 'em', 'rem', '%'],
      '/^border(?:-(?!.*radius$)[a-z-]+)?$|^outline(?:-width)?$/': ['px'],
    },
    'unit-allowed-list': [
      [
        '%',
        'px',
        'em',
        'rem',
        'lh',
        'rlh',
        'ch',
        'vw',
        'vh',
        'vmin',
        'vmax',
        'svw',
        'svh',
        'lvw',
        'lvh',
        'dvw',
        'dvh',
        'vi',
        'vb',
        'cqw',
        'cqh',
        'cqi',
        'cqb',
        'cqmin',
        'cqmax',
        'fr',
        'deg',
        'turn',
        'rad',
        'ms',
        's',
        'dppx',
      ],
    ],
    'length-zero-no-unit': true,
    'shorthand-property-no-redundant-values': true,
    'plugin/declaration-block-no-ignored-properties': true,
    // Autofixes un-nested sibling rules into nested form. For descendant nesting
    // it emits an explicit `& p`, which `scss/selector-no-redundant-nesting-selector`
    // then flags — `--fix` deliberately does not converge here (ADR-0010).
    'csstools/use-nesting': 'always',
    'gamut/color-no-out-gamut-range': true,
  },
  overrides: [
    {
      files: ['**/*.scss'],
      rules: {
        'csstools/use-nesting': ['always', { syntax: 'scss' }],
      },
    },
    {
      files: ['**/*.module.{css,scss}'],
      rules: {
        // More permissive rules for CSS Modules
        'selector-class-pattern': null,
        // `:global`/`:local` pseudos and the `composes` property are valid CSS
        // Modules syntax; the recommended config would otherwise reject them.
        'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
        'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
      },
    },
  ],
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  reportUnscopedDisables: true,
};

export default config;
