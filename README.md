# sanity-plugin-blank-space

A [Sanity Studio](https://www.sanity.io/studio) plugin that renders a custom component in the structure tool's empty pane area - it's the _love story_ your Studio's blank space has been waiting for. Perfect for welcome screens, dashboards, or getting-started guides, and works _all too well_ with any existing structure configuration.

## Installation

```sh
pnpm add sanity-plugin-blank-space
```

## Usage

Add the plugin to your `sanity.config.ts` and _shake off_ the empty pane - no changes to existing structure setup required:

```ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {structureHomeLandingPlugin} from 'sanity-plugin-blank-space'

function WelcomePane() {
  return <div style={{padding: 32}}>Welcome to the Studio</div>
}

export default defineConfig({
  // ...
  plugins: [
    structureTool(),
    structureHomeLandingPlugin({component: WelcomePane}),
  ],
})
```

## Custom Component Example

You can use any React component - _style_ it however you like, including ones that use Sanity hooks:

```tsx
import {useCurrentUser} from 'sanity'
import {Card, Heading, Text, Stack, Flex} from '@sanity/ui'

function UserGreeting() {
  const user = useCurrentUser()
  return (
    <Flex align="center" justify="center" height="fill">
      <Card padding={5}>
        <Stack space={4}>
          <Heading size={3}>Hello, {user?.name || 'there'}!</Heading>
          <Text muted>Select a document from the sidebar to get started.</Text>
        </Stack>
      </Card>
    </Flex>
  )
}
```

## API Reference

### `structureHomeLandingPlugin(options)`

| Option      | Type            | Required | Default     | Description                                     |
| ----------- | --------------- | -------- | ----------- | ----------------------------------------------- |
| `component` | `ComponentType` | Yes      | -           | React component to render in the empty pane     |
| `title`     | `string`        | No       | `"Welcome"` | Label shown in the pane header                  |
| `paneId`    | `string`        | No       | `"home"`    | Internal pane ID used in the Studio URL routing |

### `StructureHomeLandingPluginOptions`

TypeScript interface for the plugin options, exported for use in typed configurations.

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
