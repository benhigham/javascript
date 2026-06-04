import { describe, expect, it } from 'vitest';

import pkg from '../package.json' with { type: 'json' };
import { libsOf, optionsOf, PRIMITIVES } from './helpers.js';

// The matrix tests only cover the primitives in PRIMITIVES. Guard against silent
// drift in the exported surface: a newly-shipped subpath — a fifth primitive, an
// accidentally exported internal fragment, or an extra alias onto an existing
// primitive — would otherwise add consumer-facing surface with zero coverage
// while the suite still looks exhaustive. Pin the exact set of export subpaths
// (the keys — what a consumer can import), not the target files: deduping by
// target would let an aliasing subpath slip through.
describe('the exported surface is exactly the default plus the four primitives', () => {
  it('exports no subpath beyond . and the four primitive .json subpaths', () => {
    const expected = new Set(['.', ...PRIMITIVES.map((primitive) => `./${primitive}.json`)]);

    expect(new Set(Object.keys(pkg.exports))).toStrictEqual(expected);
  });

  it.each(PRIMITIVES)('points ./%s.json at its own src file', (primitive) => {
    expect(pkg.exports[`./${primitive}.json`]).toBe(`./src/${primitive}.json`);
  });

  it('defaults the . export to the node primitive', () => {
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
