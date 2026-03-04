# Local Development

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/) (see `packageManager` in root `package.json` for the exact version)

## Getting Started

```sh
# Install all dependencies (including workspace links)
pnpm install

# Start the Sanity Studio
pnpm dev:studio
```

## How Local Dev Works

You do **not** need to build the package to develop locally. The package's `exports` map includes a `source` field pointing to the raw TypeScript in `src/`:

```json
{
  ".": {
    "source": "./src/index.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  }
}
```

When the studio imports from the workspace package (e.g. `import {blankSpacePlugin} from 'sanity-plugin-blank-space'`), the bundler resolves directly to the TypeScript source via the `source` condition. Changes are reflected immediately without rebuilding.

## Project Structure

```
packages/
  sanity-plugin-blank-space/   # Sanity Studio plugin (publishable)
apps/
  studio/                      # Dev Sanity Studio (private)
```

- **Packages** are publishable to npm. `sanity-plugin-blank-space` is built with `@sanity/pkg-utils`.
- **Apps** are private, used only for local development and testing.

## Common Tasks

### Build packages for distribution

```sh
pnpm build:packages
```

This produces `dist/` with ESM (`.js`), CommonJS (`.cjs`), and TypeScript declarations (`.d.ts`).

### Run tests

```sh
pnpm test
```

Tests use [Vitest](https://vitest.dev/) with `jsdom` environment. Test files live alongside source code in `src/__tests__/`.

### Lint and format

```sh
# ESLint
pnpm lint

# Prettier (check only)
pnpm format:check

# Prettier (write fixes)
pnpm format
```

Both ESLint and Prettier run automatically on staged files via lint-staged when you commit.

### Type check

```sh
pnpm type-check
```

### Clean build outputs

```sh
pnpm clean
```

## Testing with External Projects

To test the package in another local project without publishing, use [yalc](https://github.com/wclr/yalc):

```sh
# From the package directory
pnpm yalc:publish

# From the consuming project
npx yalc add sanity-plugin-blank-space
```

For continuous development, use the watch mode:

```sh
pnpm link-watch
```

This runs `pkg-utils watch` for the sanity plugin.

## Turborepo

All root scripts are orchestrated by [Turborepo](https://turbo.build/). It handles:

- **Task dependencies**: packages build before apps that depend on them
- **Caching**: unchanged packages skip rebuilds
- **Parallelism**: independent tasks run concurrently

The pipeline is defined in `turbo.json`.
