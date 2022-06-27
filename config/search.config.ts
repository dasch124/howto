/**
 * Number of words in content snippet on each side of the match.
 */
export const snippetWords = 8

/**
 * Max number of search results.
 */
export const maxSearchResults = 10

/**
 * Max number of chunks per search result document.
 */
export const maxSearchResultChunks = 3

/**
 * Dispatch search requests when search term has at least n characters.
 */
export const minSearchTermLength = 3

/**
 * Debounce search-on-type by n milliseconds.
 */
export const delay = 150

export const typesenseHost = process.env['NEXT_PUBLIC_TYPESENSE_HOST']

export const typesensePort = process.env['NEXT_PUBLIC_TYPESENSE_PORT']

export const typesenseProtocol = process.env['NEXT_PUBLIC_TYPESENSE_PROTOCOL']

export const typesenseSearchApiKey = process.env['NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY']

export const typesenseCollectionName = 'howto'
