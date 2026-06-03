import { describe, expect, it } from 'vitest';

import { FIXTURES, optionsOf, resolveConfig, severityOf } from './helpers.js';

describe('scopeToTs keeps the type-checked global disables off JS files', () => {
  it('disables core no-unused-vars on TS but keeps it on JS, under ./typescript', async () => {
    const ts = await resolveConfig('./typescript', FIXTURES.ts);
    const js = await resolveConfig('./typescript', FIXTURES.js);

    expect(severityOf(ts, 'no-unused-vars')).toBe('off');
    expect(severityOf(js, 'no-unused-vars')).toBe('error');
  });

  it('moves the unused-vars duty to @typescript-eslint on TS, honoring the _ convention', async () => {
    const ts = await resolveConfig('./typescript', FIXTURES.ts);

    expect(severityOf(ts, '@typescript-eslint/no-unused-vars')).toBe('error');
    expect(optionsOf(ts, '@typescript-eslint/no-unused-vars')).toMatchObject({
      argsIgnorePattern: '^_',
      reportUsedIgnorePattern: true,
    });
  });

  it('honors the _ convention for core no-unused-vars on JS files', async () => {
    const js = await resolveConfig('./typescript', FIXTURES.js);

    expect(optionsOf(js, 'no-unused-vars')).toMatchObject({
      argsIgnorePattern: '^_',
      reportUsedIgnorePattern: true,
    });
  });
});

describe('type-aware rules layer in only at ./typescript and only on TS files', () => {
  it('omits a type-aware rule from the base (.) config', async () => {
    const base = await resolveConfig('.', FIXTURES.ts);

    expect(severityOf(base, '@typescript-eslint/no-floating-promises')).toBe('absent');
  });

  it('adds it on TS but not JS under ./typescript', async () => {
    const ts = await resolveConfig('./typescript', FIXTURES.ts);
    const js = await resolveConfig('./typescript', FIXTURES.js);

    expect(severityOf(ts, '@typescript-eslint/no-floating-promises')).toBe('error');
    expect(severityOf(js, '@typescript-eslint/no-floating-promises')).toBe('absent');
  });
});

describe('the shipped vitest layer composes in, scoped to test files', () => {
  it('applies vitest rules on a test file but leaves source untouched', async () => {
    const test = await resolveConfig('.', FIXTURES.test);
    const source = await resolveConfig('.', FIXTURES.ts);

    expect(severityOf(test, 'vitest/prefer-to-be')).toBe('error');
    expect(severityOf(source, 'vitest/prefer-to-be')).toBe('absent');
  });

  it('ships typecheck enabled by default (the setting this package dogfoods off)', async () => {
    const test = await resolveConfig('.', FIXTURES.test);

    expect(test.settings?.vitest?.typecheck).toBe(true);
  });
});

describe('curated tunings win over the presets they layer on top of', () => {
  it('keeps @typescript-eslint/array-type at array-simple over the stylistic preset', async () => {
    const ts = await resolveConfig('./typescript', FIXTURES.ts);

    expect(optionsOf(ts, '@typescript-eslint/array-type')).toStrictEqual({
      default: 'array-simple',
    });
  });
});

describe('eslint-config-prettier is applied last to turn formatting rules off', () => {
  // unicorn enables unicorn/no-nested-ternary; prettier turns it off. If the
  // prettier tail were dropped or reordered, this would resolve back to 'error'.
  it.each(['.', './typescript', './browser', './react', './next'])(
    'disables a unicorn formatting rule in the %s export',
    async (subpath) => {
      const config = await resolveConfig(subpath, FIXTURES.ts);

      expect(severityOf(config, 'unicorn/no-nested-ternary')).toBe('off');
    },
  );
});
