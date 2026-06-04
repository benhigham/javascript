import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { libsOf, optionsOf, PRIMITIVES } from './helpers.js';

const LIBRARY = ['node', 'browser'];
const APP = ['node-app', 'browser-app'];
const NODE = ['node', 'node-app'];
const BROWSER = ['browser', 'browser-app'];

// The base kernel is axis-independent: every primitive includes it
// unconditionally, so these hold across all four regardless of emit or env.
describe('base kernel applies to every primitive', () => {
  it.each(PRIMITIVES)(
    '%s inherits strict, the ES2023 target, and the kernel safety/module-hygiene flags',
    (primitive) => {
      const options = optionsOf(primitive);

      expect(options.strict).toBe(true);
      expect(options.target).toBe(ts.ScriptTarget.ES2023);
      expect(options.noUncheckedIndexedAccess).toBe(true);
      expect(options.verbatimModuleSyntax).toBe(true);
      expect(options.erasableSyntaxOnly).toBe(true);
      expect(options.moduleDetection).toBe(ts.ModuleDetectionKind.Force);
    },
  );
});

// Emit axis — set by exactly one of emit-library / emit-app. moduleResolution
// follows emit (ADR-0001): library -> nodenext, app -> bundler. The explicit
// nodenext on emit-library is what lets this assert NodeNext rather than
// undefined — the API leaves an *implied* resolution unset.
describe('emit axis: library primitives emit declarations under nodenext', () => {
  it.each(LIBRARY)('%s emits .d.ts to an outDir, never noEmit', (primitive) => {
    const options = optionsOf(primitive);

    expect(options.module).toBe(ts.ModuleKind.NodeNext);
    expect(options.moduleResolution).toBe(ts.ModuleResolutionKind.NodeNext);
    expect(options.declaration).toBe(true);
    expect(options.declarationMap).toBe(true);
    expect(options.sourceMap).toBe(true);
    expect(options.stripInternal).toBe(true);
    expect(options.noEmitOnError).toBe(true);
    expect(options.outDir).toMatch(/dist$/u);
    expect(options.noEmit).toBeUndefined();
    expect(options.allowImportingTsExtensions).toBeUndefined();
  });
});

describe('emit axis: app primitives type-check only under bundler resolution', () => {
  it.each(APP)('%s sets noEmit, bundler, and .ts imports, no declarations', (primitive) => {
    const options = optionsOf(primitive);

    expect(options.module).toBe(ts.ModuleKind.ESNext);
    expect(options.moduleResolution).toBe(ts.ModuleResolutionKind.Bundler);
    expect(options.noEmit).toBe(true);
    expect(options.allowImportingTsExtensions).toBe(true);
    expect(options.declaration).toBeUndefined();
    expect(options.outDir).toBeUndefined();
  });
});

// Environment axis — set by exactly one of env-node / env-browser.
describe('env axis: node primitives get the node lib, no DOM or jsx', () => {
  it.each(NODE)('%s carries ES2024 and the ESNext helpers, no DOM or jsx', (primitive) => {
    const options = optionsOf(primitive);
    const libs = libsOf(options);

    expect(libs).toContain('es2024');
    expect(libs).toContain('esnext.array');
    expect(libs).not.toContain('dom');
    expect(options.jsx).toBeUndefined();
  });
});

describe('env axis: browser primitives get the DOM lib and jsx', () => {
  it.each(BROWSER)('%s carries the DOM lib and the react-jsx runtime', (primitive) => {
    const options = optionsOf(primitive);
    const libs = libsOf(options);

    expect(libs).toContain('dom');
    expect(libs).toContain('es2023');
    expect(options.jsx).toBe(ts.JsxEmit.ReactJSX);
  });
});

// The matrix corners (browser = library + DOM, node-app = node + app) are not
// asserted separately: each primitive belongs to one emit array and one env
// array, so the axis suites above already run both halves against its single
// resolved options object — the corners are pinned by membership, not by
// re-resolving the same object a third time.
