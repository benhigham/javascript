import { describe, expect, it } from 'vitest';

import { FIXTURES, optionsOf, resolveConfig, severityOf } from './helpers.js';

describe('the browser layer scopes Node and browser rules to the right environment', () => {
  it('neutralizes n/prefer-global/process on browser source but keeps it on Node files', async () => {
    const source = await resolveConfig('./browser', FIXTURES.tsx);
    const configFile = await resolveConfig('./browser', FIXTURES.configFile);
    const script = await resolveConfig('./browser', FIXTURES.script);

    expect(severityOf(source, 'n/prefer-global/process')).toBe('off');
    expect(severityOf(configFile, 'n/prefer-global/process')).toBe('error');
    expect(severityOf(script, 'n/prefer-global/process')).toBe('error');
  });

  it('runs compat on browser source but not on Node files', async () => {
    const source = await resolveConfig('./browser', FIXTURES.tsx);
    const configFile = await resolveConfig('./browser', FIXTURES.configFile);

    expect(severityOf(source, 'compat/compat')).toBe('error');
    expect(severityOf(configFile, 'compat/compat')).toBe('absent');
  });

  it('carries no floor workarounds: require-unicode-regexp is not narrowed, no-array-sort stays on', async () => {
    const source = await resolveConfig('./browser', FIXTURES.ts);
    const configFile = await resolveConfig('./browser', FIXTURES.configFile);

    // The browser layer carries no floor workarounds (ADR-0004): the base's
    // flag-agnostic `require-unicode-regexp` (require `u` *or* `v`) applies
    // uniformly, with no `requireFlag` narrowing on browser source — both flags
    // run at the modern floor, and `v` is left optional (it would need tsconfig
    // `target: ES2024`). `unicorn/no-array-sort` is on; its `.toSorted()` fix
    // needs only `lib: ES2023`.
    expect(severityOf(source, 'require-unicode-regexp')).toBe('error');
    expect(optionsOf(source, 'require-unicode-regexp')?.requireFlag).toBeUndefined();
    expect(optionsOf(configFile, 'require-unicode-regexp')?.requireFlag).toBeUndefined();
    expect(severityOf(source, 'unicorn/no-array-sort')).toBe('error');
  });
});
