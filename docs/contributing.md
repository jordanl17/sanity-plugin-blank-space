# Contributing

## Setup

1. Fork and clone the repo
2. Install dependencies: `pnpm install`
3. Create a branch: `git checkout -b feat/my-feature`

See [Local Development](./local-development.md) for the full development workflow.

## Commit Messages

This repo enforces [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must follow the format:

```
type(scope): description
```

Examples:

```
feat(plugin): add blank space field type
fix(plugin): handle missing config gracefully
docs: update local development guide
chore: upgrade typescript to 5.10
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`

A commitlint hook validates this on every commit. If your commit is rejected, check the message format.

## Pull Requests

1. Run all checks before pushing:
   ```sh
   pnpm build:packages
   pnpm lint
   pnpm format:check
   pnpm type-check
   pnpm test
   ```
2. Push your branch and open a PR against `main`
3. CI runs the same checks automatically

## Package Exports

The publishable package requires an `exports` map in `package.json` with `source`, `import`, `require`, `default`, and `./package.json`.

`sanity-plugin-blank-space` uses `@sanity/pkg-utils --strict`, which runs api-extractor. Every public export **must** have a `/** @public */` JSDoc tag; missing tags fail the build.

Run `pnpm build:packages` to verify your changes pass all build checks.

## Tests

Tests use [Vitest](https://vitest.dev/) and live in `src/__tests__/` within each package:

```
packages/sanity-plugin-blank-space/src/__tests__/plugin.test.ts
```

Run tests with:

```sh
pnpm test
```

## Code Style

- **Functional style**: prefer `map`, `filter`, `reduce` over `for` loops
- **Descriptive names**: no single-character variable names
- **No negated expressions**: use positive conditions
- **No IIFEs**: avoid immediately invoked function expressions
- ESLint + Prettier handle formatting (runs automatically on commit via lint-staged)
