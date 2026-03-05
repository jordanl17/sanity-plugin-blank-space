import {useEffect, useState} from 'react'
import {useClient} from 'sanity'

import {type DocumentTypeInfo, useDocumentTypes} from './useDocumentTypes'

/** Document type paired with its document count. @public */
export interface DocumentTypeWithCount extends DocumentTypeInfo {
  documentCount: number
}

/** Return type for the {@link usePopularDocumentTypes} hook. @public */
export interface UsePopularDocumentTypesResult {
  data: DocumentTypeWithCount[]
  isLoading: boolean
  error: Error | null
}

interface FetchState {
  data: DocumentTypeWithCount[]
  error: Error | null
  resolvedKey: string
}

const INITIAL_STATE: FetchState = {data: [], error: null, resolvedKey: ''}

/**
 * Returns schema document types sorted by document count, most popular first.
 *
 * @param limit - Cap the number of returned types.
 * @public
 */
export function usePopularDocumentTypes(limit?: number): UsePopularDocumentTypesResult {
  const documentTypes = useDocumentTypes()
  const client = useClient({apiVersion: '2025-05-01'})
  const [state, setState] = useState<FetchState>(INITIAL_STATE)

  const typeNamesKey = documentTypes
    .map((docType) => docType.name)
    .sort()
    .join(',')

  useEffect(() => {
    if (documentTypes.length === 0) {
      return
    }

    let cancelled = false

    const projection = documentTypes
      .map((docType) => `"${docType.name}": count(*[_type == "${docType.name}"])`)
      .join(', ')
    const query = `{${projection}}`

    client
      .fetch<Record<string, number>>(query)
      .then((counts) => {
        if (cancelled) return

        const sorted = documentTypes
          .map((docType) => ({
            ...docType,
            documentCount: counts[docType.name] ?? 0,
          }))
          .sort((left, right) => right.documentCount - left.documentCount)

        setState({data: sorted, error: null, resolvedKey: typeNamesKey})
      })
      .catch((fetchError: unknown) => {
        if (cancelled) return

        setState({
          data: [],
          error: fetchError instanceof Error ? fetchError : new Error(String(fetchError)),
          resolvedKey: typeNamesKey,
        })
      })

    return () => {
      cancelled = true
    }
  }, [typeNamesKey, client, documentTypes])

  if (documentTypes.length === 0) {
    return {data: [], isLoading: false, error: null}
  }

  const isLoading = state.resolvedKey !== typeNamesKey

  const data = limit === undefined ? state.data : state.data.slice(0, limit)

  return {data, isLoading, error: state.error}
}
