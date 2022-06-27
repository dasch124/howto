import type { PostCore } from '@/cms/cms.client'

interface Heading {
  id: string | null
  title: string | null
  depth: number
}

export interface IndexedPost extends Pick<PostCore, 'date' | 'id' | 'locale' | 'title' | 'uuid'> {
  // NOTE: typesense cannot currently store nested objects in documents
  // authors: Array<Omit<PostCore['authors'][number], '_id'>>
  authors: Array<string>
  // NOTE: typesense cannot currently store nested objects in documents
  // tags: Array<Omit<PostCore['tags'][number], '_id'>>
  // `date` field as unix timestamp
  timestamp: number
  tags: Array<string>
  kind: 'post'
  /** Either the `abstract`, or a chunk of the `body`. */
  content: string
  /** Added id `content` is a chunk of the `body`, indicates the chunk's heading. */
  heading?: Heading
}
