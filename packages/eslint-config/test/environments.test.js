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

  it('narrows require-unicode-regexp to the u flag on browser source only', async () => {
    const source = await resolveConfig('./browser', FIXTURES.ts);
    const configFile = await resolveConfig('./browser', FIXTURES.configFile);

    expect(optionsOf(source, 'require-unicode-regexp')).toStrictEqual({ requireFlag: 'u' });
    expect(optionsOf(configFile, 'require-unicode-regexp')?.requireFlag).toBeUndefined();
  });
});
