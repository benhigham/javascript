# @benhigham/eslint-config

## 3.0.0

### Major Changes

- [#24](https://github.com/benhigham/javascript/pull/24) [`98dcc70`](https://github.com/benhigham/javascript/commit/98dcc700a46f6f89018ba1108dcdb630bbf89eae) Thanks [@benhigham](https://github.com/benhigham)! - Upgrade to ESLint 10. Minimum required ESLint version is now `>=10.0.0`.
  - Bump `eslint` devDependency from `^9.34.0` to `^10.0.0`
  - Bump `eslint-config-xo-typescript` from `^9.0.0` to `^10.0.0` (raises TypeScript peer requirement from `>=5.5.0` to `>=5.9.0`)
  - Update `peerDependencies.eslint` from `>=9.26.0` to `>=10.0.0`
  - Resolves existing `eslint-config-xo@0.50` peer dep conflict (requires `>=10`)

### Minor Changes

- [#3](https://github.com/benhigham/javascript/pull/3) [`784cc52`](https://github.com/benhigham/javascript/commit/784cc52e1eac7938540951d4f57c5370738ecf80) Thanks [@dependabot](https://github.com/apps/dependabot)! - Upgrade eslint-plugin-unicorn from v61 to v63

  New recommended rules from v62 and v63 are now included in the shared configuration. See the [v62](https://github.com/sindresorhus/eslint-plugin-unicorn/releases/tag/v62.0.0) and [v63](https://github.com/sindresorhus/eslint-plugin-unicorn/releases/tag/v63.0.0) release notes for details.

### Patch Changes

- [#22](https://github.com/benhigham/javascript/pull/22) [`f1bcee4`](https://github.com/benhigham/javascript/commit/f1bcee4a9a4fb3e6ea045329049ccacfa24c9ae7) Thanks [@renovate](https://github.com/apps/renovate)! - Bump `eslint-plugin-sonarjs` from v3 to v4. Resolves transitive minimatch ReDoS vulnerabilities (GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74).
