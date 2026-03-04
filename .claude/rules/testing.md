---
paths:
  - 'packages/*/src/__tests__/**'
---

# Testing

Vitest with `jsdom`. Import from `vitest`:

```ts
import {describe, it, expect} from 'vitest'
```

Files: `src/__tests__/*.test.{ts,tsx}` within each package.

- `pnpm test` - all tests
- `pnpm test` from a package directory - that package only
