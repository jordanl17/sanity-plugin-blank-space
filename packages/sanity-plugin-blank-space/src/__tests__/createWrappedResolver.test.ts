import {describe, expect, it, vi} from 'vitest'

const {MockListBuilder, getLastChildFn} = vi.hoisted(() => {
  let lastChildFn: ((itemId: string, options: unknown) => unknown) | undefined

  class MockListBuilder {
    private childFn: ((itemId: string, options: unknown) => unknown) | undefined

    getChild() {
      return this.childFn
    }

    child(resolver: (itemId: string, options: unknown) => unknown) {
      this.childFn = resolver
      lastChildFn = resolver
      return this
    }
  }

  return {
    MockListBuilder,
    getLastChildFn: () => lastChildFn,
  }
})

vi.mock('sanity/structure', () => ({
  ListBuilder: MockListBuilder,
}))

import {
  createWrappedResolver,
  DEFAULT_HOME_PANE_ID,
  DEFAULT_HOME_PANE_TITLE,
} from '../createWrappedResolver'

type StructureBuilderParam = Parameters<ReturnType<typeof createWrappedResolver>>[0]
type StructureContextParam = Parameters<ReturnType<typeof createWrappedResolver>>[1]
type OriginalResolverParam = Parameters<typeof createWrappedResolver>[0]

function DummyComponent() {
  return null
}

function createMockStructureBuilder() {
  const titleResult = {title: vi.fn()}
  const idResult = {id: vi.fn(() => titleResult), title: titleResult.title}

  return {
    defaults: vi.fn(() => new MockListBuilder()),
    component: vi.fn(() => idResult),
    id: idResult.id,
    title: titleResult.title,
    _idResult: idResult,
    _titleResult: titleResult,
  }
}

function createMockContext(): StructureContextParam {
  return {currentUser: null} as unknown as StructureContextParam
}

function resolveWithDefaults(
  originalResolver?: OriginalResolverParam,
  paneId = DEFAULT_HOME_PANE_ID,
  title = DEFAULT_HOME_PANE_TITLE,
) {
  const structureBuilder = createMockStructureBuilder()
  const mockContext = createMockContext()

  const resolver = createWrappedResolver(originalResolver, DummyComponent, paneId, title)
  const result = resolver(structureBuilder as unknown as StructureBuilderParam, mockContext)

  return {structureBuilder, mockContext, result, childResolver: getLastChildFn()}
}

describe('createWrappedResolver', () => {
  it('uses S.defaults() when no original resolver is provided', () => {
    const {structureBuilder} = resolveWithDefaults()
    expect(structureBuilder.defaults).toHaveBeenCalled()
  })

  it('calls original resolver when provided', () => {
    const originalResolver = vi.fn(() => new MockListBuilder())
    const {structureBuilder, mockContext} = resolveWithDefaults(
      originalResolver as unknown as OriginalResolverParam,
    )
    expect(originalResolver).toHaveBeenCalledWith(structureBuilder, mockContext)
  })

  it('handles default home pane ID by rendering the provided component', () => {
    const {structureBuilder, childResolver} = resolveWithDefaults()
    expect(childResolver).toBeDefined()

    childResolver!(DEFAULT_HOME_PANE_ID, {parent: {items: []}})

    expect(structureBuilder.component).toHaveBeenCalledWith(DummyComponent)
    expect(structureBuilder._idResult.id).toHaveBeenCalledWith(DEFAULT_HOME_PANE_ID)
    expect(structureBuilder._titleResult.title).toHaveBeenCalledWith(DEFAULT_HOME_PANE_TITLE)
  })

  it('handles custom pane ID by rendering the provided component', () => {
    const customPaneId = 'custom-dashboard'
    const {structureBuilder, childResolver} = resolveWithDefaults(undefined, customPaneId)
    expect(childResolver).toBeDefined()

    childResolver!(customPaneId, {parent: {items: []}})

    expect(structureBuilder.component).toHaveBeenCalledWith(DummyComponent)
    expect(structureBuilder._idResult.id).toHaveBeenCalledWith(customPaneId)
    expect(structureBuilder._titleResult.title).toHaveBeenCalledWith(DEFAULT_HOME_PANE_TITLE)
  })

  it('uses a custom title when provided', () => {
    const customTitle = 'Dashboard'
    const {structureBuilder, childResolver} = resolveWithDefaults(
      undefined,
      DEFAULT_HOME_PANE_ID,
      customTitle,
    )
    expect(childResolver).toBeDefined()

    childResolver!(DEFAULT_HOME_PANE_ID, {parent: {items: []}})

    expect(structureBuilder.component).toHaveBeenCalledWith(DummyComponent)
    expect(structureBuilder._idResult.id).toHaveBeenCalledWith(DEFAULT_HOME_PANE_ID)
    expect(structureBuilder._titleResult.title).toHaveBeenCalledWith(customTitle)
  })

  it('does not intercept default pane ID when a custom pane ID is configured', () => {
    const expectedChild = {type: 'document-pane'}
    const options = {
      parent: {
        items: [{id: DEFAULT_HOME_PANE_ID, type: 'listItem', child: expectedChild}],
      },
    }

    const {structureBuilder, childResolver} = resolveWithDefaults(undefined, 'custom-dashboard')
    const result = childResolver!(DEFAULT_HOME_PANE_ID, options)

    expect(structureBuilder.component).toHaveBeenCalledTimes(0)
    expect(result).toBe(expectedChild)
  })

  it('delegates to existing child resolver for non-home IDs', () => {
    const existingChildResult = {type: 'existing-child-result'}
    const existingChildResolver = vi.fn(() => existingChildResult)

    const rootListBuilder = new MockListBuilder()
    rootListBuilder.child(existingChildResolver)

    const originalResolver = vi.fn(() => rootListBuilder)
    const {childResolver} = resolveWithDefaults(
      originalResolver as unknown as OriginalResolverParam,
    )

    const options = {parent: {items: []}}
    const result = childResolver!('some-other-id', options)

    expect(existingChildResolver).toHaveBeenCalledWith('some-other-id', options)
    expect(result).toBe(existingChildResult)
  })

  it('falls back to item-based resolution when no existing child resolver exists', () => {
    const expectedChild = {type: 'document-pane'}
    const options = {
      parent: {
        items: [
          {id: 'article', type: 'listItem', child: expectedChild},
          {id: 'author', type: 'listItem', child: {type: 'other-pane'}},
          {id: 'divider', type: 'divider'},
        ],
      },
    }

    const {childResolver} = resolveWithDefaults()
    const result = childResolver!('article', options)

    expect(result).toBe(expectedChild)
  })

  it('falls back to item-based resolution calling child as function when child is a function', () => {
    const expectedResult = {type: 'resolved-pane'}
    const childFunction = vi.fn(() => expectedResult)
    const options = {
      parent: {
        items: [{id: 'article', type: 'listItem', child: childFunction}],
      },
    }

    const {childResolver} = resolveWithDefaults()
    const result = childResolver!('article', options)

    expect(childFunction).toHaveBeenCalledWith('article', options)
    expect(result).toBe(expectedResult)
  })

  it('returns undefined when item is not found in fallback resolution', () => {
    const options = {
      parent: {
        items: [{id: 'article', type: 'listItem', child: {type: 'pane'}}],
      },
    }

    const {childResolver} = resolveWithDefaults()
    const result = childResolver!('nonexistent-id', options)

    expect(result).toBeUndefined()
  })

  it('returns non-ListBuilder nodes unmodified', () => {
    const nonListBuilderNode = {type: 'component', serialize: vi.fn()}
    const originalResolver = vi.fn(() => nonListBuilderNode)

    const {result} = resolveWithDefaults(originalResolver as unknown as OriginalResolverParam)

    expect(result).toBe(nonListBuilderNode)
  })
})
