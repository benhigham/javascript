import path from 'node:path';

import { describe, expect, it } from 'vitest';

import pkg from '../package.json' with { type: 'json' };
import { libsOf, optionsOf, PRIMITIVES } from './helpers.js';

// The matrix tests only cover the primitives in PRIMITIVES. Guard against silent
// drift: a newly-shipped export — a fifth primitive, or worse, an accidentally
// exported internal fragment — would otherwise ship with zero coverage while the
// suite still looks exhaustive. Pin the tested set against what package.json
// actually exports.
describe('the tested primitive set tracks package.json exports', () => {
  it('exports exactly the four primitives, by file basename', () => {
    const exported = new Set(
      Object.values(pkg.exports).map((target) => path.basename(target, '.json')),
    );

    expect(exported).toStrictEqual(new Set(PRIMITIVES));
  });

  it('points the default (.) export at the node primitive', () => {
    expect(pkg.exports['.']).toBe(pkg.exports['./node.json']);
  });
});

// Smoke: every primitive parses and resolves to a non-empty options object.
// The TypeScript config parser throws on a missing fragment or a malformed
// extends array, so this alone proves the internal/ composition wires up.
describe('every primitive resolves to merged options', () => {
  it.each(PRIMITIVES)('%s composes its fragments into options', (primitive) => {
    const options = optionsOf(primitive);

    expect(options).toBeTypeOf('object');
    expect(libsOf(options).length).toBeGreaterThan(0);
  });
});
