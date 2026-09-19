---
'@benhigham/eslint-config': major
---

Update `eslint-plugin-jsdoc` to v64 and raise the Node.js floor to
`^22.22.2 || >=24.15.0` (from `>=22.13.0`), which v64 requires. Upgrade Node.js
if you're on an older 22.x or 24.x release. The ESLint (`>=10.4`) floor is
unchanged.

v64 ships as ESM only. The JSDoc rules this config enables are unchanged.
