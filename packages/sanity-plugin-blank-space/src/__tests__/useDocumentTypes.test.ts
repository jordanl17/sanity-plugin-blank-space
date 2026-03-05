import {renderHook} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'

import {useDocumentTypes} from '../useDocumentTypes'
import {createMockSchema, createMockSchemaType} from './helpers/schema'

const mockUseSchema = vi.fn()

vi.mock('sanity', () => ({
  useSchema: () => mockUseSchema(),
  isDocumentSchemaType: (schemaType: {type?: {name: string}}) =>
    schemaType.type?.name === 'document',
}))

describe('useDocumentTypes', () => {
  it('returns only document types', () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
      createMockSchemaType({name: 'author', title: 'Author', type: {name: 'document'}}),
      createMockSchemaType({name: 'seo', title: 'SEO', type: {name: 'object'}}),
      createMockSchemaType({name: 'tag', title: 'Tag', type: {name: 'string'}}),
    ])
    mockUseSchema.mockReturnValue(schema)

    const {result} = renderHook(() => useDocumentTypes())

    expect(result.current).toEqual([
      {name: 'post', title: 'Post', icon: undefined},
      {name: 'author', title: 'Author', icon: undefined},
    ])
  })

  it('excludes internal sanity.* types', () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
      createMockSchemaType({
        name: 'sanity.imageAsset',
        title: 'Image Asset',
        type: {name: 'document'},
      }),
      createMockSchemaType({
        name: 'sanity.fileAsset',
        title: 'File Asset',
        type: {name: 'document'},
      }),
    ])
    mockUseSchema.mockReturnValue(schema)

    const {result} = renderHook(() => useDocumentTypes())

    expect(result.current).toEqual([{name: 'post', title: 'Post', icon: undefined}])
  })

  it('maps name, title, and icon correctly', () => {
    function PostIcon() {
      return null
    }
    const schema = createMockSchema([
      createMockSchemaType({
        name: 'post',
        title: 'Blog Post',
        icon: PostIcon,
        type: {name: 'document'},
      }),
    ])
    mockUseSchema.mockReturnValue(schema)

    const {result} = renderHook(() => useDocumentTypes())

    expect(result.current).toEqual([{name: 'post', title: 'Blog Post', icon: PostIcon}])
  })

  it('falls back to name when title is undefined', () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', type: {name: 'document'}}),
    ])
    mockUseSchema.mockReturnValue(schema)

    const {result} = renderHook(() => useDocumentTypes())

    expect(result.current[0].title).toBe('post')
  })

  it('memoizes the result when schema reference is stable', () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
    ])
    mockUseSchema.mockReturnValue(schema)

    const {result, rerender} = renderHook(() => useDocumentTypes())
    const firstResult = result.current

    rerender()

    expect(result.current).toBe(firstResult)
  })

  it('returns an empty array when no document types exist', () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'seo', title: 'SEO', type: {name: 'object'}}),
    ])
    mockUseSchema.mockReturnValue(schema)

    const {result} = renderHook(() => useDocumentTypes())

    expect(result.current).toEqual([])
  })
})
