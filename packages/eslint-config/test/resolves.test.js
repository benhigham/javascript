import { describe, expect, it } from 'vitest';

import {
  configBlocksOf,
  FIXTURES,
  PLUGIN_EXPORTS,
  resolveConfig,
  STANDALONE_EXPORTS,
} from './helpers.js';

// Resolving every standalone export against every fixture path is the smoke
// surface: it proves each module imports (so every bundled plugin is present)
// and that ESLint can normalize the result for that file — which throws on a
// missing plugin or an unknown/stale rule name. No fixture linting is needed.
const standaloneCases = STANDALONE_EXPORTS.flatMap((subpath) =>
  Object.entries(FIXTURES).map(([fixture, relPath]) => ({ subpath, fixture, relPath })),
);

describe('every standalone export resolves for every fixture path', () => {
  it.each(standaloneCases)(
    '$subpath resolves for the $fixture fixture',
    async ({ subpath, relPath }) => {
      const config = await resolveConfig(subpath, relPath);

      expect(config.rules).toBeTypeOf('object');
    },
  );
});

// The plugin exports are fragments a consumer spreads onto a base and scopes,
// not standalone configs, so resolving them in isolation is meaningless. The
// smoke that matches what they are: the module imports (proving the bundled
// plugin dependency resolves) and exposes a block that registers its plugin.
describe('every optional plugin export imports as a well-formed fragment', () => {
  it.each(PLUGIN_EXPORTS)('%s registers its plugin', (subpath) => {
    const blocks = configBlocksOf(subpath);

    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.some((block) => 'plugins' in block)).toBe(true);
  });
});
