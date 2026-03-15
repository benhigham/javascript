import nextConfig from "./plugins/next.js";
import reactConfig from "./react.js";

/** @import { Linter } from 'eslint' */

/**
 * A shared ESLint configuration for libraries that use Next.js.
 * @type {Linter.Config[]}
 */
const config = [
  {
    ignores: [".next", ".vercel"],
  },
  ...reactConfig,
  nextConfig,
];

export default config;
