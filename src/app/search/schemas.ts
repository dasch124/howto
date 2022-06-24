import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'

import { typesenseCollectionName } from '~/config/search.config'

export const posts: CollectionCreateSchema = {
  name: typesenseCollectionName,
  fields: [
    { name: 'title', type: 'string', facet: false },
    { name: 'timestamp', type: 'int64', facet: false },
    { name: 'content', type: 'string', facet: false },
    { name: 'authors', type: 'string[]', facet: false },
    { name: 'tags', type: 'string[]', facet: false },
  ],
}
