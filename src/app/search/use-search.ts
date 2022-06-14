import type { Hit } from '@algolia/client-search'
import { useEffect, useState } from 'react'

import { getAlgoliaSearchIndex } from '@/app/search/get-algolia-search-index'
import type { IndexedPost } from '@/app/search/types'
import { useDebouncedState } from '@/lib/use-debounced-state'
import { delay, maxSearchResults, minSearchTermLength, snippetWords } from '~/config/search.config'

const searchStatus = ['idle', 'loading', 'success', 'error', 'disabled'] as const

export type SearchResultData = IndexedPost

export type SearchResult = Hit<SearchResultData>

export type SearchStatus = typeof searchStatus[number]

export function useSearch(searchTerm: string): {
  data: Array<SearchResult> | undefined
  status: SearchStatus
  error: Error | null
} {
  const [searchIndex] = useState(() => {
    return getAlgoliaSearchIndex()
  })
  const [searchResults, setSearchResults] = useState<Array<SearchResult>>([])
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [error, setError] = useState<Error | null>(null)

  const debouncedSearchTerm = useDebouncedState(searchTerm, delay).trim()

  useEffect(() => {
    let wasCanceled = false

    async function search() {
      if (searchIndex == null) {
        setStatus('disabled')
        return
      }

      if (debouncedSearchTerm.length < minSearchTermLength) {
        setSearchResults((searchResults) => {
          if (searchResults.length !== 0) {
            return []
          }
          return searchResults
        })
        setStatus('idle')
        return
      }

      setStatus('loading')

      try {
        const results = await searchIndex.search<SearchResultData>(debouncedSearchTerm, {
          hitsPerPage: maxSearchResults,
          attributesToRetrieve: ['type', 'kind', 'id', 'title', 'tags', 'heading'],
          attributesToHighlight: ['title', 'content'],
          attributesToSnippet: [`content:${snippetWords}`],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
          snippetEllipsisText: '...',
        })

        if (!wasCanceled) {
          setSearchResults(results.hits)
          setStatus('success')
        }
      } catch (error) {
        if (!wasCanceled) {
          setError(error instanceof Error ? error : new Error('An unexpected error has occurred.'))
          setStatus('error')
        }
      }
    }

    search()

    return () => {
      wasCanceled = true
    }
  }, [debouncedSearchTerm, searchIndex])

  return {
    data: searchResults,
    status,
    error,
  }
}
