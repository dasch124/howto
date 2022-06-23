import nextEnv from '@next/env'
import { log } from '@stefanprobst/log'
import { pick } from '@stefanprobst/pick'
import type { Post } from 'contentlayer/generated'
import { allPosts } from 'contentlayer/generated'
import escape from 'escape-html'
import { remark } from 'remark'
import withFrontmatter from 'remark-frontmatter'
import withGfm from 'remark-gfm'
import withMdx from 'remark-mdx'
import withHeadingIds from 'remark-slug'
import toPlaintext from 'strip-markdown'
import { Client } from 'typesense'
import { VFile } from 'vfile'

import type { IndexedPost } from '@/app/search/types'
import { getPersonCore, getTagCore } from '@/cms/cms.client'
import withChunks from '@/lib/remark-chunks'
import {
  typesenseCollectionName,
  typesenseHost as host,
  typesensePort as port,
  typesenseProtocol as protocol,
} from '~/config/search.config'

// eslint-disable-next-line import/no-named-as-default-member
nextEnv.loadEnvConfig(process.cwd())

function createAdminSearchClient(): Client {
  const apiKey = process.env['TYPESENSE_ADMIN_API_KEY']

  if (host == null || port == null || protocol == null || apiKey == null) {
    const error = new Error(
      'Failed to update search index because no Typesense config was provided.',
    )
    delete error.stack
    throw error
  }

  const client = new Client({
    nodes: [{ host, port: Number(port), protocol }],
    apiKey,
    connectionTimeoutSeconds: 2,
  })

  return client
}

const processor = remark()
  .use(withFrontmatter)
  .use(withMdx)
  .use(withGfm)
  .use(withHeadingIds)
  .use(withChunks)

const plaintext = remark()
  .use(withFrontmatter)
  .use(withMdx)
  .use(withGfm)
  .use(toPlaintext, {
    remove: [
      [
        'mdxJsxFlowElement',
        function (node) {
          return node.children ?? []
        },
      ],
      [
        'mdxJsxTextElement',
        function (node) {
          return node.children ?? []
        },
      ],
    ],
  })

/**
 * We want to highlight matches on the `title` and `content` fields (which means Typesense
 * will insert `<mark>` elements), so we need to html-escape those fields.
 */
async function getIndexedPostChunks(post: Post): Promise<Array<IndexedPost>> {
  const vfile = new VFile({ value: post.body.raw })
  const tree = processor.parse(vfile)
  await processor.run(tree, vfile)
  const { data } = vfile
  const chunks = data['chunks'] ?? []

  const shared = {
    kind: 'post' as const,
    ...pick(post, ['date', 'id', 'lang', 'uuid']),
    title: escape(post.title),
    authors: post.authors.map((id) => {
      return pick(getPersonCore(id), ['firstName', 'id', 'lastName'])
    }),
    tags: post.tags.map((id) => {
      return pick(getTagCore(id), ['id', 'name'])
    }),
  }

  return Promise.all([
    Promise.resolve({
      ...shared,
      objectID: post.uuid,
      content: escape(post.abstract),
    }),
    ...chunks.map(async (chunk, index) => {
      const tree = await plaintext.run(chunk.content)
      const content = String(plaintext.stringify(tree)).trim()

      return {
        ...shared,
        objectID: [post.uuid, index].join('+'),
        content: escape(content),
        heading: { id: chunk.id, title: chunk.title, depth: chunk.depth },
      }
    }),
  ])
}

async function generate() {
  const client = createAdminSearchClient()
  const collection = client.collections(typesenseCollectionName)

  const postsChunks = await Promise.all(allPosts.flatMap(getIndexedPostChunks))

  /** Clear search index to avoid stale entries (or stale entry chunks). */
  await collection.documents().clear()
  const response = await collection.documents().import([...postsChunks])

  return response.length
}

generate()
  .then((count) => {
    log.success(`Successfully updated search index with ${count} entries.`)
  })
  .catch((error) => {
    log.error('Failed to update search index.\n', String(error))
  })
