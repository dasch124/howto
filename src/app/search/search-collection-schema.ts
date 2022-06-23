import { typesenseCollectionName } from '~/config/search.config'

export const schema = {
  name: typesenseCollectionName,
  fields: [
    { name: 'title', type: 'string', facet: false },
    { name: 'date', type: 'string', facet: false },
  ],
}
