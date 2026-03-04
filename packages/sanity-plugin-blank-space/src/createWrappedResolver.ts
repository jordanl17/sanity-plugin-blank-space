import type {ComponentType} from 'react'
import {type ChildResolverOptions, ListBuilder, type StructureResolver} from 'sanity/structure'

/** @public */
export const DEFAULT_HOME_PANE_ID = 'home'

/** @public */
export const DEFAULT_HOME_PANE_TITLE = 'Welcome'

/**
 * Creates a wrapped structure resolver that intercepts the configured pane ID
 * and renders the provided component, while delegating all other IDs to the
 * original resolver's child logic.
 */
export function createWrappedResolver(
  originalResolver: StructureResolver | undefined,
  HomeComponent: ComponentType,
  paneId: string,
  title: string,
): StructureResolver {
  return (structureBuilder, context) => {
    const rootNode = originalResolver
      ? originalResolver(structureBuilder, context)
      : structureBuilder.defaults()

    if (rootNode instanceof ListBuilder) {
      const existingChild = rootNode.getChild()

      return rootNode.child((itemId: string, options: ChildResolverOptions) => {
        if (itemId === paneId) {
          return structureBuilder
            .component(HomeComponent as Parameters<typeof structureBuilder.component>[0])
            .id(paneId)
            .title(title)
        }

        if (existingChild && typeof existingChild === 'function') {
          return existingChild(itemId, options)
        }

        // Fall back to default item-based resolution
        const parentItem = options.parent as {
          items?: Array<{id: string; type: string; child?: unknown}>
        }
        const listItems = (parentItem.items ?? []).filter((item) => item.type === 'listItem')
        const target = listItems.find((item) => item.id === itemId)
        if (target === undefined) return undefined
        const child = target.child
        return typeof child === 'function' ? child(itemId, options) : child
      })
    }

    return rootNode
  }
}
