import type { PostCore } from '@/cms/cms.client'

interface Heading {
  id: string | null
  title: string | null
  depth: number
}

export interface IndexedPost extends Pick<PostCore, 'date' | 'id' | 'lang' | 'title' | 'uuid'> {
  authors: Array<Omit<PostCore['authors'][number], '_id'>>
  tags: Array<Omit<PostCore['tags'][number], '_id'>>
  kind: 'post'
  objectID: string
  /** Either the `abstract`, or a chunk of the `body`. */
  content: string
  /** Added id `content` is a chunk of the `body`, indicates the chunk's heading. */
  heading?: Heading
}
