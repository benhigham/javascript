import { blockName } from './block-name.js';
import { DEFAULT_FILES } from './file-patterns.js';

/** @import { ESLint, Linter } from 'eslint' */

/**
 * @typedef {object} DefinePluginInput
 * @property {string} name The plugin's registration key — the namespace it is
 * registered under in `plugins` and that its rules are prefixed with (e.g.
 * `'@next/next'`, `'better-tailwindcss'`, `'@eslint-community/eslint-comments'`).
 * @property {string} [slug] The block-name slug placed after the
 * `@benhigham/eslint-config/` namespace. Defaults to `name`; pass it only when
 * the registration key makes a noisy slug (`'@next/next'` → `'next'`,
 * `'@eslint-community/eslint-comments'` → `'eslint-comments'`,
 * `'better-tailwindcss'` → `'tailwindcss'`).
 * @property {ESLint.Plugin} plugin The imported plugin.
 * @property {Linter.RulesRecord} rules The rule set, keyed by prefixed rule id.
 * @property {string[] | null} [files] File globs the block applies to. Absent
 * defaults to `DEFAULT_FILES`; an explicit array is used verbatim; `null`
 * omits the `files` key entirely, for consumer-scoped/global plugins.
 * @property {Linter.Config['settings']} [settings] Optional shared settings.
 */

/**
 * Build a single-plugin flat-config block — the registration shape shared by the
 * shallow plugin wrappers: register one plugin under `name`, default `files` to
 * `DEFAULT_FILES`, and carry `rules` (plus optional `settings`). A
 * wrapper uses this iff it is a single block registering a single plugin; the
 * deep keepers (`import`, `vitest`, `jsdoc`, `jsdoc-required`, `graphql`,
 * `testing-library`) need structure outside this envelope and stay hand-rolled.
 * Environment scoping (`ignores`) is not part of the envelope: where a block
 * applies is an environment assumption owned by the composing layer (ADR-0002;
 * see the `compat` spread in `browser.js`).
 * The block carries a flat-config `name` (`@benhigham/eslint-config/<slug>`) so
 * it is addressable in `eslint --inspect-config` and error messages. See
 * ADR-0008, ADR-0009, and #122.
 * @param {DefinePluginInput} input The block's varying data.
 * @returns {Linter.Config} The flat-config block.
 */
export const definePlugin = ({ name, slug, plugin, rules, files, settings }) => ({
  name: blockName(slug ?? name),
  ...(files !== null && { files: files ?? [...DEFAULT_FILES] }),
  plugins: {
    [name]: plugin,
  },
  ...(settings && { settings }),
  rules,
});
