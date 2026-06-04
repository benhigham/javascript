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
  it.each(PRIMITIVES)('%s inherits strict and the ES2023 target', (primitive) => {
    const options = optionsOf(primitive);

    expect(options.strict).toBe(true);
    expect(options.target).toBe(ts.ScriptTarget.ES2023);
  });

  it.each(PRIMITIVES)('%s inherits the kernel safety and module-hygiene flags', (primitive) => {
    const options = optionsOf(primitive);

    expect(options.noUncheckedIndexedAccess).toBe(true);
    expect(options.verbatimModuleSyntax).toBe(true);
    expect(options.erasableSyntaxOnly).toBe(true);
    expect(options.moduleDetection).toBe(ts.ModuleDetectionKind.Force);
  });
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

// Cross-terms — the combinations the old linear chain expressed only implicitly
// (browser inheriting node's emit "sideways"). State them outright so the matrix
// is pinned at its corners, not only along each axis.
describe('the matrix corners compose both axes independently', () => {
  it('browser is a library that emits AND targets the DOM with jsx', () => {
    const options = optionsOf('browser');

    expect(options.declaration).toBe(true);
    expect(options.moduleResolution).toBe(ts.ModuleResolutionKind.NodeNext);
    expect(libsOf(options)).toContain('dom');
    expect(options.jsx).toBe(ts.JsxEmit.ReactJSX);
  });

  it('node-app pairs the node lib with bundler and noEmit', () => {
    const options = optionsOf('node-app');

    expect(libsOf(options)).toContain('es2024');
    expect(libsOf(options)).not.toContain('dom');
    expect(options.noEmit).toBe(true);
    expect(options.moduleResolution).toBe(ts.ModuleResolutionKind.Bundler);
  });
});
