import { useEffect, useState } from 'react'
import type { SearchParams, SearchResponse } from 'typesense/lib/Typesense/Documents'
import type { SearchOnlyCollection } from 'typesense/lib/Typesense/SearchOnlyCollection'

import { createSearchClient } from '@/app/search/create_search-client'
import { posts as postsSchema } from '@/app/search/schemas'
import type { IndexedPost } from '@/app/search/types'
import { useDebouncedState } from '@/lib/use-debounced-state'
import { delay, maxSearchResults, minSearchTermLength, snippetWords } from '~/config/search.config'

const searchStatus = ['idle', 'loading', 'success', 'error', 'disabled'] as const

export type SearchResult = IndexedPost

export type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'

export type SearchStatus = typeof searchStatus[number]

export function useSearch(searchTerm: string): {
  data: SearchResponse<SearchResult> | null
  status: SearchStatus
  error: Error | null
} {
  const [collection] = useState<SearchOnlyCollection<SearchResult> | null>(() => {
    const client = createSearchClient()
    if (client == null) return null
    const collection = client.collections(postsSchema.name) as SearchOnlyCollection<SearchResult>
    return collection
  })
  const [searchResults, setSearchResults] = useState<SearchResponse<SearchResult> | null>(null)
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [error, setError] = useState<Error | null>(null)

  const debouncedSearchTerm = useDebouncedState(searchTerm, delay).trim()

  useEffect(() => {
    let wasCanceled = false

    async function search() {
      if (collection == null) {
        setStatus('disabled')
        return
      }

      if (debouncedSearchTerm.length < minSearchTermLength) {
        setSearchResults(null)
        setStatus('idle')
        return
      }

      setStatus('loading')

      try {
        const searchParams: SearchParams = {
          q: debouncedSearchTerm,
          query_by: 'title,tags,content,authors',
          sort_by: 'timestamp:desc',
          highlight_affix_num_tokens: snippetWords,
          highlight_fields: 'content',
          highlight_full_fields: 'title',
          include_fields: 'kind,id,title,tags,content,authors,heading',
          limit_hits: maxSearchResults,
        }

        const results = await collection.documents().search(searchParams, {})

        if (!wasCanceled) {
          setSearchResults(results)
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
  }, [debouncedSearchTerm, collection])

  return {
    data: searchResults,
    status,
    error,
  }
}
