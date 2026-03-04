---
paths:
  - 'packages/*/package.json'
  - 'packages/*/package.config.ts'
---

# Package Exports & Build

Each publishable package's exports map requires: `source`, `import`, `require`, `default`, and `./package.json`.

- `source` - raw TypeScript entry for local dev
- `import` - ESM build output
- `require` - CJS build output
- `default` - fallback (same as `import`)

Also required: `sideEffects: false` and `publishConfig.exports` (mirrors `exports` without `source`).

## Build tools

- **`sanity-plugin-blank-space`**: Built with `pkg-utils build --strict --check --clean`. `--strict` runs api-extractor, which requires `browserslist` and `package.config.ts`.
