import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

/** Absolute path to the package root (the parent of this `test/` directory). */
const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The four shipped primitives, by the basename of their `src/*.json` file. */
export const PRIMITIVES = ['node', 'browser', 'node-app', 'browser-app'];

/**
 * The merged `compilerOptions` TypeScript resolves for a primitive — what a
 * consumer's `extends` of that subpath actually computes once the `base` kernel
 * and the emit/env fragments compose. This is the package's genuine interface,
 * the tsconfig analogue of eslint-config's resolved config.
 * @param {string} primitive A primitive basename (see `PRIMITIVES`).
 * @returns {import('typescript').CompilerOptions} The merged compiler options.
 */
export const optionsOf = (primitive) => {
  const configPath = path.join(PKG_ROOT, 'src', `${primitive}.json`);
  const parsed = ts.getParsedCommandLineOfConfigFile(
    configPath,
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic(diagnostic) {
        throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
      },
    },
  );

  if (!parsed) {
    throw new Error(`Could not parse ${configPath}`);
  }

  return parsed.options;
};

/**
 * The `lib` of a resolved options object, normalized from TypeScript's internal
 * file names (`lib.es2024.d.ts`) back to the bare lib names a tsconfig author
 * writes (`es2024`). Empty array when no `lib` is set.
 * @param {import('typescript').CompilerOptions} options Resolved compiler options.
 * @returns {string[]} The normalized lib names.
 */
export const libsOf = (options) =>
  (options.lib ?? []).map((lib) => lib.replace(/^lib\./u, '').replace(/\.d\.ts$/u, ''));
