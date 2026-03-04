# sanity-plugin-blank-space

A [Sanity Studio](https://www.sanity.io/studio) plugin for adding blank space between fields.

## Installation

```sh
pnpm add sanity-plugin-blank-space
```

## Usage

Add the plugin to your `sanity.config.ts`:

```ts
import {defineConfig} from 'sanity'
import {blankSpacePlugin} from 'sanity-plugin-blank-space'

export default defineConfig({
  // ...
  plugins: [blankSpacePlugin()],
})
```

## Development

```sh
pnpm install
pnpm dev:studio    # starts Sanity Studio at http://localhost:3333
```

See [Local Development](./docs/local-development.md) for the full dev workflow.

## Documentation

- [Local Development](./docs/local-development.md)
- [Release Process](./docs/release-process.md)
- [Contributing](./docs/contributing.md)

## License

MIT
