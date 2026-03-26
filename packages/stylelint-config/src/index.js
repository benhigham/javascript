/** @import { Config } from 'stylelint' */

/** @type {Config} */
const config = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  plugins: [
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-declaration-strict-value',
    'stylelint-no-unresolved-module',
    'stylelint-high-performance-animation',
    'stylelint-no-indistinguishable-colors',
    'stylelint-gamut',
    'stylelint-media-use-custom-media',
    'stylelint-use-nesting',
    'stylelint-plugin-use-baseline',
    'stylelint-no-unsupported-browser-features',
  ],
  rules: {
    // Browser compatibility
    'plugin/use-baseline': [true, { available: 'newly' }],
    'plugin/no-unsupported-browser-features': true,

    // SCSS-specific rules
    'scss/at-rule-no-unknown': true,
    'scss/selector-no-redundant-nesting-selector': true,
    'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9]+$',
    'scss/at-extend-no-missing-placeholder': true,
    'scss/at-import-partial-extension': 'never',
    'scss/at-mixin-pattern': '^[a-z][a-zA-Z0-9]+$',
    'scss/max-nesting-depth': 3,

    // Selector and class naming
    'selector-max-id': 0,
    'selector-max-specificity': '0,3,2',

    // General consistency
    'color-named': 'never',
    'scale-unlimited/declaration-strict-value': [
      ['/color$/', 'font-size', 'z-index'],
      { ignoreValues: ['currentColor', 'inherit', 'transparent'] },
    ],
    'declaration-property-unit-allowed-list': {
      'font-size': ['rem', '%'],
      '/^margin|^padding/': ['rem', '%', 'vw', 'vh'],
      '/^border|^outline/': ['px'],
      'line-height': ['none', ''],
    },
    'unit-allowed-list': [
      ['%', 'deg', 'rem', 'ms', 's', 'vw', 'vh'],
      {
        ignoreProperties: { px: ['border', 'outline'] },
      },
    ],
    'length-zero-no-unit': true,
    'shorthand-property-no-redundant-values': true,
    'plugin/declaration-block-no-ignored-properties': true,
    'csstools/media-use-custom-media': 'always',
    'csstools/use-nesting': ['always', { syntax: 'scss' }],
    'plugin/stylelint-no-indistinguishable-colors': true,
    'gamut/color-no-out-gamut-range': true,
    'plugin/no-low-performance-animation-properties': true,
    'plugin/no-unresolved-module': { modules: ['node_modules'] },
  },
  overrides: [
    {
      files: ['**/*.module.{css,scss}'],
      rules: {
        // More permissive rules for CSS modules
        'selector-class-pattern': null,
      },
    },
  ],
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  reportUnscopedDisables: true,
};

export default config;
