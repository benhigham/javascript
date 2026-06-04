import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import browserslistConfig from '@benhigham/browserslist-config';
import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';

import config from '../src/index.js';

// Simulate a consumer who has adopted `@benhigham/browserslist-config`: pin the
// floor the dynamic gate reads. `plugin/no-unsupported-browser-features` resolves
// browserslist from the environment at load, so setting `BROWSERSLIST` here is
// what makes this test assert reconciliation AT the shipped modern floor rather
// than the ambient `defaults`. (`plugin/use-baseline` ignores browserslist — it
// uses a fixed Baseline threshold.) Set before any lint runs.
process.env.BROWSERSLIST = browserslistConfig.join(', ');

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// The two browser-support gates. They draw on different data (caniuse vs
// Baseline) and can disagree, so the contract at the modern floor (ADR-0004) is
// that they agree — neither fires on the modern CSS this config encourages or
// permits.
const GATES = new Set(['plugin/no-unsupported-browser-features', 'plugin/use-baseline']);

// Spans the features most likely to split the two gates — nesting (required by
// `csstools/use-nesting`), media range syntax (required by
// `media-feature-range-notation`), `overflow: clip`, `:focus-visible`, logical
// properties — plus a couple of recent Baseline features (`:has()`,
// `text-wrap: balance`) as canaries for the rolling floor.
const MODERN_CSS = `
.card {
  overflow: clip;
  margin-inline: 1rem;
  padding-block: 0.5rem;
  text-wrap: balance;

  & .title {
    color: rebeccapurple;
  }

  &:focus-visible {
    outline: 2px solid;
  }

  &:has(.badge) {
    border-block-end: 1px solid;
  }
}

@media (width >= 600px) {
  .card {
    margin-inline: 2rem;
  }
}
`;

describe('the browser-support gates agree at the modern floor', () => {
  it('flags none of the modern CSS the config encourages', async () => {
    const { results } = await stylelint.lint({
      code: MODERN_CSS,
      config,
      configBasedir: PKG_ROOT,
      codeFilename: path.join(PKG_ROOT, 'fixture.css'),
    });

    const gateWarnings = results[0].warnings.filter((warning) => GATES.has(warning.rule));

    expect(gateWarnings).toStrictEqual([]);
  });
});
