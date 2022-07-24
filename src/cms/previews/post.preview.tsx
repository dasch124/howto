import { compile } from '@mdx-js/mdx'
import { common } from '@wooorm/starry-night'
import sparql from '@wooorm/starry-night/lang/source.sparql.js'
import turtle from '@wooorm/starry-night/lang/source.turtle.js'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import { useEffect, useState } from 'react'
import withGfm from 'remark-gfm'

import type { PostDetails } from '@/cms/cms.client'
import withCmsPreviewAssets from '@/cms/lib/remark-cms-preview-assets'
import { Preview } from '@/cms/previews/preview'
import { PostContent } from '@/components/post-content'
import { PostHeader } from '@/components/post-header'
import { Spinner } from '@/components/spinner'
import withSyntaxHighlighting from '@/lib/rehype-starry-night'
import { useDebouncedState } from '@/lib/use-debounced-state'
import { useEvent } from '@/lib/use-event'
import { previewRenderDelay } from '~/config/cms.config'

type PostMetadata = Omit<PostDetails, '_id' | 'code' | 'id' | 'uuid'>

const initialMetadata: PostMetadata = {
  abstract: '',
  date: new Date().toISOString(),
  authors: [],
  contributors: [],
  editors: [],
  featuredImage: undefined,
  licence: { _id: 'cc-by-4.0', id: 'cc-by-4.0', name: 'CC-BY 4.0' },
  locale: 'en',
  readingTime: 0,
  tags: [],
  title: '',
  toc: [],
  version: '',
}

export function PostPreview(props: PreviewTemplateComponentProps): JSX.Element {
  const entry = useDebouncedState(props.entry, previewRenderDelay)
  const { fieldsMetaData, getAsset } = props

  const data = entry.get('data')
  const body = entry.getIn(['data', 'body'])

  const [metadata, setMetadata] = useState<PostMetadata>(initialMetadata)
  const [mdxContent, setMdxContent] = useState<Error | string | null>(null)

  const compileMdx = useEvent(async function compileMdx(code: string) {
    // TODO: compile to hyperscript, not javascript!
    const vfile = await compile(code, {
      outputFormat: 'function-body',
      remarkPlugins: [withGfm, [withCmsPreviewAssets, getAsset]],
      rehypePlugins: [[withSyntaxHighlighting, { grammars: [...common, sparql, turtle] }]],
    })

    return vfile
  })

  const resolveRelation = useEvent(function resolveRelation(path: Array<string>, id: string) {
    const metadata = fieldsMetaData.getIn([...path, id])
    if (metadata == null) return null
    return { id, ...metadata.toJS() }
  })

  useEffect(() => {
    const { body: _, ...frontmatter } = data.toJS()

    const authors = Array.isArray(frontmatter.authors)
      ? frontmatter.authors
          .map((id: string) => {
            return resolveRelation(['authors', 'people'], id)
          })
          .filter(Boolean)
          .map((author: any) => {
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
          .map((id: string) => {
            return resolveRelation(['contributors', 'people'], id)
          })
          .filter(Boolean)
      : []

    const editors = Array.isArray(frontmatter.editors)
      ? frontmatter.editors
          .map((id: string) => {
            return resolveRelation(['editors', 'people'], id)
          })
          .filter(Boolean)
      : []

    const tags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
          .map((id: string) => {
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
  }, [data, getAsset, resolveRelation])

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
        <div className="flex items-center gap-2">
          <Spinner />
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
