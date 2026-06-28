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

  .title {
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

// A feature below the floor, to prove the gates are still live: the "they agree"
// test above passes whether the gates stay silent because the CSS is fine *or*
// because someone disabled both, so on its own it can't tell working gates from
// dead ones. `text-size-adjust` trips both — caniuse (Firefox doesn't support it)
// and Baseline (not newly available) — so both must fire here. Durable: Firefox
// has long declined it. Swap it if it ever reaches Baseline.
const BELOW_FLOOR_CSS = `
.t {
  text-size-adjust: none;
}
`;

/** Warnings from the two browser-support gates for a snippet, at the pinned floor. */
const gateWarningsFor = async (code) => {
  const { results } = await stylelint.lint({
    code,
    config,
    configBasedir: PKG_ROOT,
    codeFilename: path.join(PKG_ROOT, 'fixture.css'),
  });

  return results[0].warnings.filter((warning) => GATES.has(warning.rule));
};

describe('the browser-support gates agree at the modern floor', () => {
  it('flags none of the modern CSS the config encourages', async () => {
    await expect(gateWarningsFor(MODERN_CSS)).resolves.toStrictEqual([]);
  });

  it('still flags a feature below the floor (both gates live, not disabled)', async () => {
    const warnings = await gateWarningsFor(BELOW_FLOOR_CSS);
    const flagged = new Set(warnings.map((warning) => warning.rule));

    expect(flagged).toStrictEqual(GATES);
  });
});

// `csstools/use-nesting` and `scss/selector-no-redundant-nesting-selector` are
// deliberately both enabled even though they don't converge under `--fix` on
// descendant nesting: use-nesting always emits `& p`, the redundant-`&` rule (which
// has no fixer) then flags it. This is the accepted trade-off in ADR-0010; the
// guards below pin it so neither rule is silently dropped to chase convergence.
const REDUNDANT_NESTING = 'scss/selector-no-redundant-nesting-selector';

/** Lint (optionally autofix) a snippet as SCSS, so the scss rules and override apply. */
const lintScss = (code, fix = false) =>
  stylelint.lint({
    code,
    config,
    fix,
    configBasedir: PKG_ROOT,
    codeFilename: path.join(PKG_ROOT, 'fixture.scss'),
  });

const isFlagged = (results, rule) => results[0].warnings.some((warning) => warning.rule === rule);

describe('the nesting rules deliberately do not converge under --fix (ADR-0010)', () => {
  it('flags a hand-written redundant `&` before a combinator', async () => {
    const { results } = await lintScss(`
.a {
  & p {
    margin: 0;
  }
}
`);

    expect(isFlagged(results, REDUNDANT_NESTING)).toBe(true);
  });

  it('use-nesting --fix produces the `& p` form the redundant rule then rejects', async () => {
    const { code: fixed } = await lintScss(
      `
.a {
  margin: 1rem;
}
.a p {
  margin: 0;
}
`,
      true,
    );

    // use-nesting nested the descendant rule with an explicit `&` ...
    expect(fixed).toContain('& p');

    // ... and re-linting the fixed output still flags that `&` — non-convergence.
    const { results } = await lintScss(fixed);

    expect(isFlagged(results, REDUNDANT_NESTING)).toBe(true);
  });
});
