---
'@benhigham/stylelint-config': patch
---

Update `stylelint-order` to v8. No new default rules are enabled, but `stylelint --fix`
now applies limited property sorting inside CSS-in-JS rule blocks containing
interpolation; consumers may see new autofix output on styled-components / emotion code.
