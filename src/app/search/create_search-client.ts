import { log } from '@stefanprobst/log'
import { SearchClient } from 'typesense'

import {
  typesenseHost as host,
  typesensePort as port,
  typesenseProtocol as protocol,
  typesenseSearchApiKey as apiKey,
} from '~/config/search.config'

let hasDisplayedWarning = false

export function createSearchClient(): SearchClient | null {
  if (host == null || port == null || protocol == null || apiKey == null) {
    if (!hasDisplayedWarning) {
      log.warn('Search is disabled because no Typesense config was provided.')
      hasDisplayedWarning = true
    }
    return null
  }

  const client = new SearchClient({
    nodes: [{ host, port: Number(port), protocol }],
    apiKey,
    connectionTimeoutSeconds: 2,
  })

  return client
}
