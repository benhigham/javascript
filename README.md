# @benhigham/javascript

Shared JavaScript tooling configurations — ESLint, Prettier, Stylelint, Commitlint, TypeScript, and Browserslist.

## Packages

| Package                                                            | Version                                                                                                                                 | Description                          |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [`@benhigham/eslint-config`](./packages/eslint-config)             | [![npm](https://img.shields.io/npm/v/@benhigham/eslint-config.svg)](https://www.npmjs.com/package/@benhigham/eslint-config)             | Shareable ESLint configuration       |
| [`@benhigham/prettier-config`](./packages/prettier-config)         | [![npm](https://img.shields.io/npm/v/@benhigham/prettier-config.svg)](https://www.npmjs.com/package/@benhigham/prettier-config)         | Shareable Prettier configuration     |
| [`@benhigham/stylelint-config`](./packages/stylelint-config)       | [![npm](https://img.shields.io/npm/v/@benhigham/stylelint-config.svg)](https://www.npmjs.com/package/@benhigham/stylelint-config)       | Shareable Stylelint configuration    |
| [`@benhigham/commitlint-config`](./packages/commitlint-config)     | [![npm](https://img.shields.io/npm/v/@benhigham/commitlint-config.svg)](https://www.npmjs.com/package/@benhigham/commitlint-config)     | Shareable commitlint configuration   |
| [`@benhigham/tsconfig`](./packages/tsconfig)                       | [![npm](https://img.shields.io/npm/v/@benhigham/tsconfig.svg)](https://www.npmjs.com/package/@benhigham/tsconfig)                       | Shareable TypeScript configurations  |
| [`@benhigham/browserslist-config`](./packages/browserslist-config) | [![npm](https://img.shields.io/npm/v/@benhigham/browserslist-config.svg)](https://www.npmjs.com/package/@benhigham/browserslist-config) | Shareable Browserslist configuration |

## Prerequisites

- **Node.js** ≥ 22
- **pnpm** ≥ 10

## Development

```bash
# Install dependencies
pnpm install

# Check formatting
pnpm run format:check

# Run all linting
pnpm run lint

# Create a changeset
pnpm changeset
```

## License

[MIT](LICENSE.md) © Benjamin Higham
