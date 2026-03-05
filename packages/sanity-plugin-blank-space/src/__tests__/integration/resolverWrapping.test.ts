/**
 * Integration test for createWrappedResolver against the real ListBuilder from
 * sanity/structure, verifying that `instanceof` checks pass with the actual
 * class rather than a mock.
 *
 * Uses a minimal stub context because full StructureContext requires the
 * entire Sanity runtime.
 */
import {ListBuilder, type StructureResolver} from 'sanity/structure'
import {describe, expect, it, vi} from 'vitest'

import {
  createWrappedResolver,
  DEFAULT_HOME_PANE_ID,
  DEFAULT_HOME_PANE_TITLE,
} from '../../createWrappedResolver'

function TestComponent() {
  return null
}

const stubContext = {} as ConstructorParameters<typeof ListBuilder>[0]

function createStubStructureBuilder() {
  const componentResult = {
    id: vi.fn().mockReturnThis(),
    title: vi.fn().mockReturnThis(),
    serialize: vi.fn(() => ({type: 'component', id: DEFAULT_HOME_PANE_ID})),
  }

  return {
    defaults: vi.fn(() => new ListBuilder(stubContext)),
    list: vi.fn(() => new ListBuilder(stubContext)),
    component: vi.fn(() => componentResult),
    ...componentResult,
  }
}

type ChildResolver = (itemId: string, options: unknown) => unknown

function resolveWrapped(originalResolver?: StructureResolver) {
  const structureBuilder = createStubStructureBuilder()

  const wrappedResolver = createWrappedResolver(
    originalResolver,
    TestComponent,
    DEFAULT_HOME_PANE_ID,
    DEFAULT_HOME_PANE_TITLE,
  )

  const rootNode = wrappedResolver(structureBuilder as never, {currentUser: null} as never)
  const childResolver = (rootNode as ListBuilder).getChild() as ChildResolver | undefined

  return {structureBuilder, rootNode, childResolver}
}

describe('resolver wrapping with real ListBuilder (integration)', () => {
  it('recognises a real ListBuilder instance via instanceof', () => {
    expect(new ListBuilder(stubContext)).toBeInstanceOf(ListBuilder)
  })

  it('wraps a real ListBuilder and intercepts the home pane ID', () => {
    const originalResolver: StructureResolver = () => new ListBuilder(stubContext)
    const {structureBuilder, rootNode, childResolver} = resolveWrapped(originalResolver)

    expect(rootNode).toBeInstanceOf(ListBuilder)
    expect(childResolver).toBeDefined()

    childResolver!(DEFAULT_HOME_PANE_ID, {parent: {items: []}})

    expect(structureBuilder.component).toHaveBeenCalledWith(TestComponent)
  })

  it('delegates non-home IDs when no existing child resolver exists', () => {
    const originalResolver: StructureResolver = () => new ListBuilder(stubContext)
    const {childResolver} = resolveWrapped(originalResolver)

    const result = childResolver!('nonexistent', {parent: {items: []}})
    expect(result).toBeUndefined()
  })

  it('falls back to S.defaults() with a real ListBuilder when no original resolver', () => {
    const {structureBuilder, rootNode} = resolveWrapped()

    expect(rootNode).toBeInstanceOf(ListBuilder)
    expect(structureBuilder.defaults).toHaveBeenCalled()
  })
})
