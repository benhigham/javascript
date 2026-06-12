/**
 * The namespace every block name this package authors lives under — the npm
 * package name. Held as one literal so a typo in the scope is impossible and the
 * composition test asserts against the same prefix. A block's `name` is
 * tooling-visible (`eslint --inspect-config`, ESLint's error messages) but never
 * enters the resolved config; see CONTEXT.md, _Block_, and ADR-0009.
 * @type {string}
 */
export const BLOCK_NS = '@benhigham/eslint-config';

/**
 * Build a flat-config block `name` from its slug — the single source of truth
 * for the `@benhigham/eslint-config/<slug>` convention. The slug is the only
 * free text per block (`'base/ignores'`, `'browser/n-neutralize'`); upstream
 * presets keep their own upstream names and never route through here (ADR-0009).
 * @param {string} slug The block's slug, placed after the namespace.
 * @returns {string} The fully-qualified block name.
 */
export const blockName = (slug) => `${BLOCK_NS}/${slug}`;
