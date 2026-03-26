/** @import { UserConfig } from '@commitlint/types' */

/** @type {UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
  rules: {
    "body-max-line-length": [2, "always", 100],
  },
};

export default config;
