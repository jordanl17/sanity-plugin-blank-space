---
paths:
  - 'packages/*/package.json'
  - 'apps/*/package.json'
  - 'turbo.json'
  - 'pnpm-workspace.yaml'
---

# Monorepo

Use `workspace:*` for internal dependencies. Resolves locally in dev; replaced with actual versions on publish.

- `packages/*` - **public** (published to npm)
- `apps/*` - **private** (dev only)

Turborepo `^build` pattern: each package's build waits for its workspace dependencies to build first.
