---
paths:
  - 'packages/sanity-plugin-blank-space/src/**/*.ts'
---

# Sanity Plugin

Use `definePlugin` from `sanity`. Type the config parameter as `Config | void` to allow argument-free usage.

```ts
import {definePlugin} from 'sanity'

export const myPlugin = definePlugin<Config | void>((config) => {
  // plugin implementation
})
```

Peer deps - the consuming Studio provides them at runtime:

- `sanity`: `^3.0.0 || ^4.0.0 || ^5.0.0`
- `react`: `^18.0.0 || ^19.0.0`
