import nextEnv from '@next/env'
import { log } from '@stefanprobst/log'
import { pick } from '@stefanprobst/pick'
import type { SearchIndex } from 'algoliasearch'
import algoliasearch from 'algoliasearch'
import type { Post } from 'contentlayer/generated'
import { allPosts } from 'contentlayer/generated'
import escape from 'escape-html'
import { remark } from 'remark'
import withFrontmatter from 'remark-frontmatter'
import withGfm from 'remark-gfm'
import withMdx from 'remark-mdx'
import withHeadingIds from 'remark-slug'
import toPlaintext from 'strip-markdown'
import { VFile } from 'vfile'

import type { IndexedPost } from '@/app/search/types'
import { getPersonCore, getTagCore } from '@/cms/cms.client'
import withChunks from '@/lib/remark-chunks'

// eslint-disable-next-line import/no-named-as-default-member
nextEnv.loadEnvConfig(process.cwd())

function getAlgoliaAdminSearchIndex(): SearchIndex {
  if (
    process.env['NEXT_PUBLIC_ALGOLIA_APP_ID'] == null ||
    process.env['ALGOLIA_ADMIN_API_KEY'] == null ||
    process.env['NEXT_PUBLIC_ALGOLIA_INDEX_NAME'] == null
  ) {
    const error = new Error('Failed to update search index because no Algolia config was provided.')
    delete error.stack
    throw error
  }

  const searchClient = algoliasearch(
    process.env['NEXT_PUBLIC_ALGOLIA_APP_ID'],
    process.env['ALGOLIA_ADMIN_API_KEY'],
  )

  const searchIndex = searchClient.initIndex(process.env['NEXT_PUBLIC_ALGOLIA_INDEX_NAME'])

  return searchIndex
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
 * We want to highlight matches on the `title` and `content` fields (which means algolia
 * will insert `<mark>` elements), so we need to html-escape those fields.
 *
 * @see https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/highlighting-snippeting/js/#sanitization-of-the-results
 * @see https://www.algolia.com/doc/guides/sending-and-managing-data/prepare-your-data/in-depth/data-sanitization/
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
  const searchIndex = getAlgoliaAdminSearchIndex()

  const postsChunks = await Promise.all(allPosts.flatMap(getIndexedPostChunks))

  /** Clear search index to avoid stale entries (or stale entry chunks). */
  await searchIndex.clearObjects()
  const { objectIDs } = await searchIndex.saveObjects([...postsChunks])

  return objectIDs.length
}

generate()
  .then((count) => {
    log.success(`Successfully updated search index with ${count} entries.`)
  })
  .catch((error) => {
    log.error('Failed to update search index.\n', String(error))
  })
