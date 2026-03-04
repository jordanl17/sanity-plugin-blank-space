---
paths:
  - 'packages/*/src/**/*.ts'
  - 'packages/*/src/**/*.tsx'
---

# Public API JSDoc Tags

Every exported type, interface, function, and constant must have a `/** @public */` JSDoc tag.

## Enforcement

Required by `@sanity/pkg-utils --strict` (api-extractor). Missing tags fail the build:

```
"<symbol>" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
```
