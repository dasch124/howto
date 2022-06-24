import { typesenseCollectionName } from '~/config/search.config'

export const posts = {
  name: typesenseCollectionName,
  fields: [
    { name: 'title', type: 'string', facet: false },
    { name: 'date', type: 'string', facet: false },
    { name: 'content', type: 'string', facet: false },
    { name: 'authors', type: 'string[]', facet: false },
    { name: 'tags', type: 'string[]', facet: false },
  ],
}
