import { compile } from '@mdx-js/mdx'
import { common } from '@wooorm/starry-night'
import sparql from '@wooorm/starry-night/lang/source.sparql.js'
import turtle from '@wooorm/starry-night/lang/source.turtle.js'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import { useCallback, useEffect, useState } from 'react'
import withGfm from 'remark-gfm'

import type { PostDetails } from '@/cms/cms.client'
import withCmsPreviewAssets from '@/cms/lib/remark-cms-preview-assets'
import { Preview } from '@/cms/previews/preview'
import { PostContent } from '@/components/post-content'
import { PostHeader } from '@/components/post-header'
import { Spinner } from '@/components/spinner'
import withSyntaxHighlighting from '@/lib/rehype-starry-night'
import { useDebouncedState } from '@/lib/use-debounced-state'
import { previewRenderDelay } from '~/config/cms.config'

type PostMetadata = Omit<PostDetails, '_id' | '_raw' | 'body' | 'id' | 'uuid'>

const initialMetadata: PostMetadata = {
  type: 'Post',
  authors: [],
  tags: [],
  licence: { _id: '', id: '', name: '' },
  title: '',
  locale: 'en',
  lang: 'en',
  toc: false,
  date: new Date().toISOString(),
  version: '',
  abstract: '',
}

export function PostPreview(props: PreviewTemplateComponentProps): JSX.Element {
  const entry = useDebouncedState(props.entry, previewRenderDelay)
  const { fieldsMetaData, getAsset } = props

  const data = entry.get('data')
  const body = entry.getIn(['data', 'body'])

  const [metadata, setMetadata] = useState<PostMetadata>(initialMetadata)
  const [mdxContent, setMdxContent] = useState<Error | string | null>(null)

  // TODO: useEvent
  const compileMdx = useCallback(
    async function compileMdx(code: string) {
      // TODO: compile to hyperscript, not javascript!
      const vfile = await compile(code, {
        outputFormat: 'function-body',
        remarkPlugins: [
          withGfm,
          // [
          //   withSmartQuotes,
          //   locale === 'de'
          //     ? {
          //         openingQuotes: { double: '„', single: ',' },
          //         closingQuotes: { double: '”', single: '’' },
          //       }
          //     : undefined,
          // ],
          // [
          //   toNlcst as Plugin,
          //   unified()
          //     .use(locale === 'en' ? english : latin)
          //     .use(withWordCount),
          // ],
          // withComponents,
          // [withNextImages, { publicDirectory: '/assets/images/static' }],
          // [withAssetDownloads, { publicDirectory: '/assets/downloads/static' }],
          [withCmsPreviewAssets, getAsset],
        ],
        rehypePlugins: [
          // withHeadingIds,
          // [withHeadingFragmentLinks, { generate: createPermalink }],
          // withToc,
          // withNoReferrerLinks,
          // withListsWithAriaRole,
          [withSyntaxHighlighting, { grammars: [...common, sparql, turtle] }],
        ],
      })

      return vfile
    },
    [getAsset],
  )

  useEffect(() => {
    function resolveRelation(path: Array<string>, id: string) {
      const metadata = fieldsMetaData.getIn([...path, id])
      if (metadata == null) return null
      return { id, ...metadata.toJS() }
    }

    const { body: _, ...partialFrontmatter } = data.toJS()
    const frontmatter = partialFrontmatter

    const authors = Array.isArray(frontmatter.authors)
      ? frontmatter.authors
          .map((id) => {
            return resolveRelation(['authors', 'people'], id)
          })
          .filter(Boolean)
          .map((author) => {
            // FIXME: how to resolve asset path on related item?
            // We cannot use `getAsset` because that is bound to the `posts` collection.
            return {
              ...author,
              avatar: undefined,
            }
          })
      : []

    const contributors = Array.isArray(frontmatter.contributors)
      ? frontmatter.contributors
          .map((id) => {
            return resolveRelation(['contributors', 'people'], id)
          })
          .filter(Boolean)
      : []

    const editors = Array.isArray(frontmatter.editors)
      ? frontmatter.editors
          .map((id) => {
            return resolveRelation(['editors', 'people'], id)
          })
          .filter(Boolean)
      : []

    const tags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
          .map((id) => {
            return resolveRelation(['tags', 'tags'], id)
          })
          .filter(Boolean)
      : []

    const licence =
      frontmatter.licence != null
        ? resolveRelation(['licence', 'licences'], frontmatter.licence)
        : null

    const date =
      frontmatter.date == null || frontmatter.date.length === 0
        ? initialMetadata.date
        : frontmatter.date

    const featuredImage =
      frontmatter.featuredImage != null
        ? String(getAsset(frontmatter.featuredImage))
        : frontmatter.featuredImage

    const metadata = {
      ...initialMetadata,
      ...frontmatter,
      authors,
      contributors,
      date,
      editors,
      tags,
      licence,
      featuredImage,
    }

    setMetadata(metadata)
  }, [data, fieldsMetaData, getAsset])

  useEffect(() => {
    let wasCanceled = false

    async function processMdx() {
      try {
        const code = String(await compileMdx(body))

        if (!wasCanceled) {
          setMdxContent(code)
        }
      } catch (error) {
        console.error(error)
        setMdxContent(new Error('Failed to render MDX.'))
      }
    }

    processMdx()

    return () => {
      wasCanceled = true
    }
  }, [body, compileMdx])

  if (mdxContent instanceof Error) {
    return (
      <Preview {...props}>
        <div>
          <p>Failed to render preview.</p>
          <p>This usually indicates a syntax error in the Markdown content.</p>
        </div>
      </Preview>
    )
  }

  if (mdxContent === null) {
    return (
      <Preview {...props}>
        <div className="flex items-center space-x-2">
          <Spinner className="text-primary-600 h-6 w-6" aria-label="Loading..." />
          <p>Trying to render preview...</p>
        </div>
      </Preview>
    )
  }

  const id = entry.get('slug')
  const post: PostDetails = {
    ...metadata,
    id,
    uuid: id,
    _id: id,
    // @ts-expect-error No need for this.
    _raw: {},
    body: {
      raw: '',
      code: mdxContent,
      data: {
        toc: [],
        /** We don't calculate reading time for previews. */
        readingTime: 1,
      },
    },
  }

  return (
    <Preview {...props}>
      <PostHeader post={post} />
      <PostContent>{mdxContent}</PostContent>
    </Preview>
  )
}
