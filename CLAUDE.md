# sanity-plugin-blank-space

## Architecture

Turborepo monorepo with one publishable npm package and a dev studio app.

### Packages

| Package                     | Path                                 | Description                                                                                  |
| --------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `sanity-plugin-blank-space` | `packages/sanity-plugin-blank-space` | Sanity Studio plugin that renders a custom component in the structure tool's empty pane area |

### Apps (dev only, not published)

| App      | Path          | Description                          |
| -------- | ------------- | ------------------------------------ |
| `studio` | `apps/studio` | Dev Sanity Studio for testing plugin |

## Commands

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `pnpm install`        | Install all dependencies          |
| `pnpm build`          | Build all packages and apps       |
| `pnpm build:packages` | Build only publishable packages   |
| `pnpm dev`            | Start all dev servers in parallel |
| `pnpm dev:studio`     | Start Sanity Studio dev server    |
| `pnpm check`          | Build packages, lint, type-check  |
| `pnpm lint`           | Run ESLint across the monorepo    |
| `pnpm format`         | Format all files with Prettier    |
| `pnpm format:check`   | Check formatting without writing  |
| `pnpm test`           | Run Vitest tests                  |
| `pnpm type-check`     | Run TypeScript type checking      |
| `pnpm clean`          | Clean all build outputs           |

## Build System

- **Build tool**: `@sanity/pkg-utils` for `sanity-plugin-blank-space`
- **Output**: `dist/` with ESM (`.js`), CJS (`.cjs`), and TypeScript declarations (`.d.ts`)
- **Local dev**: Workspace consumers import directly from `src/` via the `source` field in exports maps - no build needed during development
- **Orchestration**: Turborepo handles task dependencies and caching

## Coding Conventions

- Use `pnpm` as the package manager
- Prefer functional declarations and higher-order functions (map, filter, reduce)
- Use descriptive variable names (no single-character names)
- Do not use negated expressions
- Do not use immediately invoked function expressions (IIFEs)
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- ESLint + Prettier enforce code style (run automatically via lint-staged on commit)

## Release Process

- Releases are managed by [release-please](https://github.com/googleapis/release-please)
- Merging a release PR triggers npm publish via GitHub Actions
- Requires `NPM_TOKEN` secret configured in GitHub repo settings

## Peer Dependencies

- `sanity-plugin-blank-space` supports `sanity ^3.0.0 || ^4.0.0 || ^5.0.0` and `react ^18.0.0 || ^19.0.0`

## Plugin Architecture

- **`activeToolLayout` middleware** - intercepts the structure tool's configuration to inject a wrapped structure resolver
- **`createWrappedResolver`** - handles a virtual `__home__` pane ID that renders the configured component, delegating all other IDs to the original resolver
- **`StructureHomeRedirector`** - auto-navigates to the `__home__` pane when the structure tool opens with no panes selected
- The plugin wraps any existing structure resolver transparently - no changes needed to existing structure configuration

## Workflow

- **Verification Before Done**: Never mark a task complete without proving it works - run `pnpm check && pnpm test`.
- **Simplicity First**: Minimal code impact. Find root causes. No temporary fixes.

## File Conventions

- Test files: `src/__tests__/*.test.{ts,tsx}` within each package
- Package config: `package.config.ts` for the sanity plugin
- TypeScript configs: `tsconfig.json` (IDE) + `tsconfig.build.json` (build output, excludes tests)
- Schema types: `apps/studio/schemaTypes/`

## Testing

- Vitest with jsdom environment (configured at root `vitest.config.ts`)

## Sanity Project

- Project ID: `i2zyueht`
- Dataset: `production`
