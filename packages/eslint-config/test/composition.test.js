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

  it('keeps the non-type-aware vitest rules on JS test files', async () => {
    const testJs = await resolveConfig('.', FIXTURES.testJs);

    expect(severityOf(testJs, 'vitest/prefer-to-be')).toBe('error');
  });
});

describe('vitest typecheck rides with projectService — TS test files only', () => {
  // The setting makes type-aware vitest rules (e.g. vitest/valid-title) consult
  // parser type services, which only exist where projectService is set. It must
  // never land on a file without type info, or those rules throw a hard crash.
  it('omits typecheck under the non-type-aware base (.) export, on TS and JS tests', async () => {
    const ts = await resolveConfig('.', FIXTURES.test);
    const js = await resolveConfig('.', FIXTURES.testJs);

    expect(ts.settings?.vitest?.typecheck).toBeUndefined();
    expect(js.settings?.vitest?.typecheck).toBeUndefined();
  });

  it('enables typecheck on TS test files but not JS ones under ./typescript', async () => {
    const ts = await resolveConfig('./typescript', FIXTURES.test);
    const js = await resolveConfig('./typescript', FIXTURES.testJs);

    expect(ts.settings?.vitest?.typecheck).toBe(true);
    expect(js.settings?.vitest?.typecheck).toBeUndefined();
  });

  it('propagates to exports that layer on ./typescript (e.g. ./browser)', async () => {
    const ts = await resolveConfig('./browser', FIXTURES.test);

    expect(ts.settings?.vitest?.typecheck).toBe(true);
  });
});

describe('type-test files (*.test-d.ts) are linted only in the type-aware layer', () => {
  // Type tests need `typecheck` + `projectService` to be meaningful, both of
  // which live only in ./typescript+. The base (.) export must leave them with
  // no vitest layer at all; ./typescript lints them with typecheck on, minus the
  // structural rules that misfire on type tests (require-hook, the expect-group
  // padding). See ADR-0005.
  it('gives a -d file no vitest rules and no typecheck under the base (.) export', async () => {
    const typeTest = await resolveConfig('.', FIXTURES.typeTest);

    expect(severityOf(typeTest, 'vitest/prefer-to-be')).toBe('absent');
    expect(typeTest.settings?.vitest?.typecheck).toBeUndefined();
  });

  it('keeps a __tests__/-located -d file out of the runtime layer under base (.)', async () => {
    // A `-d` file under `__tests__/` matches the runtime `TEST_FILES` dir glob,
    // so only the runtime layer's `ignores: [...TYPE_TEST_FILES]` keeps it out of
    // the base layer (where it would misfire — vitest rules with no typecheck).
    // The `src/a.test-d.ts` fixture above can't catch a dropped `ignores`: it
    // never matches `TEST_FILES`, so it resolves to no vitest rules regardless.
    const typeTest = await resolveConfig('.', FIXTURES.typeTestInDir);

    expect(severityOf(typeTest, 'vitest/prefer-to-be')).toBe('absent');
    expect(typeTest.settings?.vitest?.typecheck).toBeUndefined();
  });

  it('governs a __tests__/-located -d file by the type-aware block under ./typescript', async () => {
    // Wherever it sits, a `-d` file is linted by exactly one block: the type-aware
    // one. Under `__tests__/` it also matches the runtime globs, so this pins that
    // the type-test treatment (rules + typecheck) still wins via the `ignores`.
    const typeTest = await resolveConfig('./typescript', FIXTURES.typeTestInDir);

    expect(severityOf(typeTest, 'vitest/prefer-to-be')).toBe('error');
    expect(typeTest.settings?.vitest?.typecheck).toBe(true);
    expect(severityOf(typeTest, 'vitest/require-hook')).toBe('off');
  });

  it('lints a -d file with the curated vitest rules and typecheck under ./typescript', async () => {
    const typeTest = await resolveConfig('./typescript', FIXTURES.typeTest);

    expect(severityOf(typeTest, 'vitest/prefer-to-be')).toBe('error');
    expect(typeTest.settings?.vitest?.typecheck).toBe(true);
  });

  it('turns off the rules that misfire on type tests, on -d files only', async () => {
    const typeTest = await resolveConfig('./typescript', FIXTURES.typeTest);
    const test = await resolveConfig('./typescript', FIXTURES.test);

    expect(severityOf(typeTest, 'vitest/require-hook')).toBe('off');
    expect(severityOf(typeTest, 'vitest/padding-around-expect-groups')).toBe('off');

    // The deny-list is scoped to type-test files: runtime test files keep them.
    expect(severityOf(test, 'vitest/require-hook')).toBe('error');
    expect(severityOf(test, 'vitest/padding-around-expect-groups')).toBe('error');
  });

  it('keeps rules triage suspected but that do not misfire (e.g. require-top-level-describe)', async () => {
    const typeTest = await resolveConfig('./typescript', FIXTURES.typeTest);

    expect(severityOf(typeTest, 'vitest/require-top-level-describe')).toBe('error');
    expect(severityOf(typeTest, 'vitest/consistent-test-filename')).toBe('error');
  });

  it('propagates to exports that layer on ./typescript (e.g. ./react)', async () => {
    const typeTest = await resolveConfig('./react', FIXTURES.typeTest);

    expect(severityOf(typeTest, 'vitest/prefer-to-be')).toBe('error');
    expect(typeTest.settings?.vitest?.typecheck).toBe(true);
  });

  it('allows devDependency imports (e.g. vitest) in type-test files', async () => {
    // The import layer (`import-x/no-extraneous-dependencies`) applies on every
    // export, independent of the type-aware-only vitest scoping. Its
    // devDependencies allowlist must include the type-test glob, or a colocated
    // `src/a.test-d.ts` importing vitest's `expectTypeOf` (a devDependency) is
    // wrongly flagged as extraneous in a consumer project.
    const typeTest = await resolveConfig('./typescript', FIXTURES.typeTest);
    const allowed = optionsOf(typeTest, 'import-x/no-extraneous-dependencies')?.devDependencies;

    expect(allowed).toContain('**/*.{test,spec}-d.{ts,tsx,mts,cts}');
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
