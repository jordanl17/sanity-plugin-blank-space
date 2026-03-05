import {renderHook, waitFor} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'

import {usePopularDocumentTypes} from '../usePopularDocumentTypes'
import {createMockSchema, createMockSchemaType} from './helpers/schema'

const mockUseSchema = vi.fn()
const mockFetch = vi.fn()
const mockClient = {fetch: mockFetch}

vi.mock('sanity', () => ({
  useSchema: () => mockUseSchema(),
  useClient: () => mockClient,
  isDocumentSchemaType: (schemaType: {type?: {name: string}}) =>
    schemaType.type?.name === 'document',
}))

describe('usePopularDocumentTypes', () => {
  it('returns types sorted by document count descending', async () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
      createMockSchemaType({name: 'author', title: 'Author', type: {name: 'document'}}),
      createMockSchemaType({name: 'category', title: 'Category', type: {name: 'document'}}),
    ])
    mockUseSchema.mockReturnValue(schema)
    mockFetch.mockResolvedValue({post: 5, author: 20, category: 10})

    const {result} = renderHook(() => usePopularDocumentTypes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual([
      {name: 'author', title: 'Author', icon: undefined, documentCount: 20},
      {name: 'category', title: 'Category', icon: undefined, documentCount: 10},
      {name: 'post', title: 'Post', icon: undefined, documentCount: 5},
    ])
  })

  it('exposes isLoading: true before fetch resolves', () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
    ])
    mockUseSchema.mockReturnValue(schema)
    mockFetch.mockReturnValue(new Promise(() => {}))

    const {result} = renderHook(() => usePopularDocumentTypes())

    expect(result.current.isLoading).toBe(true)
  })

  it('sets isLoading: false after fetch completes', async () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
    ])
    mockUseSchema.mockReturnValue(schema)
    mockFetch.mockResolvedValue({post: 3})

    const {result} = renderHook(() => usePopularDocumentTypes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data).toHaveLength(1)
  })

  it('handles fetch errors', async () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
    ])
    mockUseSchema.mockReturnValue(schema)
    mockFetch.mockRejectedValue(new Error('Network failure'))

    const {result} = renderHook(() => usePopularDocumentTypes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Network failure')
    expect(result.current.data).toEqual([])
  })

  it('returns empty data without fetching when no document types exist', () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'seo', title: 'SEO', type: {name: 'object'}}),
    ])
    mockUseSchema.mockReturnValue(schema)
    mockFetch.mockClear()

    const {result} = renderHook(() => usePopularDocumentTypes())

    expect(result.current.data).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('builds correct GROQ query string from schema types', async () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
      createMockSchemaType({name: 'author', title: 'Author', type: {name: 'document'}}),
    ])
    mockUseSchema.mockReturnValue(schema)
    mockFetch.mockResolvedValue({post: 1, author: 2})

    renderHook(() => usePopularDocumentTypes())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    const query = mockFetch.mock.calls[0][0] as string
    expect(query).toContain('"post": count(*[_type == "post"])')
    expect(query).toContain('"author": count(*[_type == "author"])')
    expect(query).toMatch(/^\{.*\}$/)
  })

  it('carries through schema info in results', async () => {
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
    mockFetch.mockResolvedValue({post: 7})

    const {result} = renderHook(() => usePopularDocumentTypes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data[0]).toEqual({
      name: 'post',
      title: 'Blog Post',
      icon: PostIcon,
      documentCount: 7,
    })
  })

  it('limits results when limit parameter is provided', async () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
      createMockSchemaType({name: 'author', title: 'Author', type: {name: 'document'}}),
      createMockSchemaType({name: 'category', title: 'Category', type: {name: 'document'}}),
    ])
    mockUseSchema.mockReturnValue(schema)
    mockFetch.mockResolvedValue({post: 5, author: 20, category: 10})

    const {result} = renderHook(() => usePopularDocumentTypes(2))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[0].name).toBe('author')
    expect(result.current.data[1].name).toBe('category')
  })

  it('returns all results when limit is undefined', async () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
      createMockSchemaType({name: 'author', title: 'Author', type: {name: 'document'}}),
    ])
    mockUseSchema.mockReturnValue(schema)
    mockFetch.mockResolvedValue({post: 5, author: 20})

    const {result} = renderHook(() => usePopularDocumentTypes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toHaveLength(2)
  })

  it('defaults documentCount to 0 for types missing from the response', async () => {
    const schema = createMockSchema([
      createMockSchemaType({name: 'post', title: 'Post', type: {name: 'document'}}),
      createMockSchemaType({name: 'author', title: 'Author', type: {name: 'document'}}),
    ])
    mockUseSchema.mockReturnValue(schema)
    mockFetch.mockResolvedValue({post: 5})

    const {result} = renderHook(() => usePopularDocumentTypes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const authorResult = result.current.data.find((item) => item.name === 'author')
    expect(authorResult?.documentCount).toBe(0)
  })
})
