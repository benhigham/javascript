import { describe, expect, it } from 'vitest';

import pkg from '../package.json' with { type: 'json' };
import {
  configBlocksOf,
  FIXTURES,
  PLUGIN_EXPORTS,
  resolveConfig,
  STANDALONE_EXPORTS,
  TESTED_EXPORTS,
} from './helpers.js';

// The coverage below only reaches the exports listed in helpers.js. Guard
// against silent drift: a new `package.json` export that nobody adds there
// would ship with zero coverage while the suite still looks exhaustive. These
// assertions force the tested set to track what the package actually exports,
// and the standalone/plugin split to partition it without gaps or overlap.
describe('the tested export set tracks package.json exports', () => {
  it('tests exactly the subpaths package.json exports', () => {
    expect(new Set(TESTED_EXPORTS)).toStrictEqual(new Set(Object.keys(pkg.exports)));
  });

  it('partitions every tested export into standalone or plugin', () => {
    expect(new Set([...STANDALONE_EXPORTS, ...PLUGIN_EXPORTS])).toStrictEqual(
      new Set(TESTED_EXPORTS),
    );
  });
});

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

// The plugin exports are opt-in configs a consumer spreads onto a base and
// scopes, not standalone configs, so resolving them in isolation is meaningless.
// The smoke that matches what they are: the module imports (proving the bundled
// plugin dependency resolves) and exposes a block that registers its plugin.
describe('every optional plugin export imports as a well-formed config', () => {
  it.each(PLUGIN_EXPORTS)('%s registers its plugin', (subpath) => {
    const blocks = configBlocksOf(subpath);

    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.some((block) => 'plugins' in block)).toBe(true);
  });
});

// `definePlugin` omits the `files` key for the global, consumer-scoped plugin
// exports (they pass `files: null`), so they apply to whatever a consumer
// composes them with. A regression to `DEFAULT_FILES` would silently narrow
// that scope — and since these sit in no standalone export, the resolved-config
// tests cannot see it (calculateConfigForFile never resolves them). Assert the
// block shape directly, the same kind of guard the structural prettier test is
// for composition. See ADR-0008.
describe('the global plugin exports declare no files', () => {
  it.each(['./plugins/turbo', './plugins/playwright'])(
    '%s registers its plugin with no files key',
    (subpath) => {
      const registering = configBlocksOf(subpath).find((block) => 'plugins' in block);

      expect(registering).toBeDefined();
      expect('files' in registering).toBe(false);
    },
  );
});
