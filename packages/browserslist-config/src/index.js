/** @import { Config } from 'browserslist' */

/**
 * A shared Browserslist configuration.
 *
 * One rolling, modern query, intersected with `and` so the clauses _narrow_ each
 * other. Browserslist combines comma- or array-separated queries with `or`, so a
 * multi-entry array (e.g. `['last 2 years', 'not dead', ...]`) would _union_ them
 * into a far broader floor (down to Chrome 61 plus the niche long tail) — the
 * opposite of the intent. The single `and` query lands the floor at roughly
 * Baseline "newly available". See ADR-0004.
 * @type {Config | string[]}
 */
const config = ['last 2 years and not dead and fully supports es6-module'];

export default config;
