import { DEFAULT_FILES } from './file-patterns.js';

/** @import { Linter } from 'eslint' */
/** @import { ESLint } from 'eslint' */

/**
 * @typedef {object} DefinePluginInput
 * @property {string} name The plugin's registration key — the namespace it is
 * registered under in `plugins` and that its rules are prefixed with (e.g.
 * `'@next/next'`, `'better-tailwindcss'`, `'@eslint-community/eslint-comments'`).
 * @property {ESLint.Plugin} plugin The imported plugin.
 * @property {Linter.RulesRecord} rules The rule set, keyed by prefixed rule id.
 * @property {string[] | null} [files] File globs the block applies to. Absent
 * defaults to `DEFAULT_FILES`; an explicit array is used verbatim; `null`
 * omits the `files` key entirely, for consumer-scoped/global plugins.
 * @property {Linter.Config['settings']} [settings] Optional shared settings.
 * @property {string[]} [ignores] Optional file globs to exclude.
 */

/**
 * Build a single-plugin flat-config block — the registration shape shared by the
 * shallow plugin wrappers: register one plugin under `name`, default `files` to
 * `DEFAULT_FILES`, and carry `rules` (plus optional `settings`/`ignores`). A
 * wrapper uses this iff it is a single block registering a single plugin; the
 * deep keepers (`import`, `vitest`, `jsdoc`, `jsdoc-required`, `graphql`,
 * `testing-library`) need structure outside this envelope and stay hand-rolled.
 * See ADR-0008.
 * @param {DefinePluginInput} input The block's varying data.
 * @returns {Linter.Config} The flat-config block.
 */
export const definePlugin = ({ name, plugin, rules, files, settings, ignores }) => ({
  ...(files !== null && { files: files ?? [...DEFAULT_FILES] }),
  plugins: {
    [name]: plugin,
  },
  ...(ignores && { ignores }),
  ...(settings && { settings }),
  rules,
});
