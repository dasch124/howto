import '@wooorm/starry-night/style/core.css'

import { ClockIcon } from '@heroicons/react/outline'
import { PageMetadata, SchemaOrg } from '@stefanprobst/next-page-metadata'
import { createUrl } from '@stefanprobst/request'
import cx from 'clsx'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Link from 'next/link'
import path from 'node:path'
import { Fragment } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { DublinCore } from '@/app/metadata/dublin-core'
import { Highwire } from '@/app/metadata/highwire'
import { useAppMetadata } from '@/app/metadata/use-app-metadata'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import * as routes from '@/app/route/routes.config'
import { useCanonicalUrl } from '@/app/route/use-canonical-url'
import type { PostCore, PostDetails } from '@/cms/cms.client'
import { getPersonFullName, getPost, getPostIds, getPostsCoreByTags } from '@/cms/cms.client'
import { EditInCmsLink } from '@/components/edit-in-cms-link'
import { MainContent } from '@/components/main-content'
import { PostsList } from '@/components/posts-list'
import { getLastUpdatedTimestamp } from '@/lib/get-last-updated-timestamp'
import { components } from '@/lib/mdx-components'
import { pickRandom } from '@/lib/pick-random'
import { useFirstVisibleHeading } from '@/lib/use-first-visible-heading'
import { useHumanReadableDate } from '@/lib/use-human-readable-date'
import { useMdx } from '@/lib/use-mdx'
import proseStyles from '@/styles/prose.module.css'
import syntaxStyles from '@/styles/syntax-highlighting.module.css'
import type { Locale } from '~/config/i18n.config'
import { relatedPostsCount } from '~/config/ui.config'

export type PostPageParams = {
  id: PostDetails['id']
}

interface PostPageProps {
  post: PostDetails
  relatedPosts: Array<PostCore>
  timestamp: number
}

export function getStaticPaths(
  context: GetStaticPathsContext,
): GetStaticPathsResult<PageParams<PostPageParams>> {
  const locales = context.locales as Array<Locale>
  const paths = locales.flatMap((locale) => {
    const ids = getPostIds()
    return ids.map((id) => {
      return { locale, params: { id } }
    })
  })

  return { paths, fallback: false }
}

export const getStaticProps = withDictionaries(
  ['common'],
  async function getStaticProps(
    context: GetStaticPropsContext<PostPageParams>,
  ): Promise<GetStaticPropsResult<PostPageProps>> {
    const { id } = context.params as PostPageParams
    const post = getPost(id)
    const filePath = path.posix.join('content', post._id)
    const timestamp = await getLastUpdatedTimestamp(filePath)
    const relatedPosts = pickRandom(
      getPostsCoreByTags(
        post.tags.map((tag) => {
          return tag.id
        }),
      ).filter((post) => {
        return post.id !== id
      }),
      relatedPostsCount,
    )

    // FIXME: don't send post.body.raw and post.body.data.matter
    // FIXME: PostDetails should Pick, not Omit, and also only pick what's needed from body.data
    // FIXME: only send post.body.data.toc when post.toc is true
    return { props: { post, relatedPosts, timestamp } }
  },
)

export default function PostPage(props: PostPageProps): JSX.Element {
  const { post, relatedPosts, timestamp } = props

  const canonicalUrl = useCanonicalUrl()
  const appMetadata = useAppMetadata()
  const titleTemplate = usePageTitleTemplate()
  const { default: Content } = useMdx(post.body.code)

  const metadata = { title: post.title }

  return (
    <Fragment>
      <PageMetadata
        title={metadata.title}
        titleTemplate={titleTemplate}
        openGraph={{ type: 'article' }}
      />
      <SchemaOrg
        schema={{
          /**
           * The best option would probably be `LearningResource`, which unfortunately is not
           * recognized by Google currently.
           *
           * @see https://developers.google.com/search/docs/advanced/structured-data/search-gallery
           */
          '@type': 'Course',
          url: String(canonicalUrl),
          headline: post.title,
          name: post.title,
          datePublished: post.date,
          abstract: post.abstract,
          description: post.abstract,
          inLanguage: post.lang,
          author: post.authors.map((author) => {
            return {
              '@type': 'Person',
              familyName: author.lastName,
              givenName: author.firstName,
            }
          }),
          editor: post.editors?.map((editor) => {
            return {
              '@type': 'Person',
              familyName: editor.lastName,
              givenName: editor.firstName,
            }
          }),
          contributor: post.contributors?.map((contributor) => {
            return {
              '@type': 'Person',
              familyName: contributor.lastName,
              givenName: contributor.firstName,
            }
          }),
          version: post.version,
          license: post.licence.name,
          image: post.featuredImage,
          keywords: post.tags.map((tag) => {
            return tag.name
          }),
          publisher: {
            '@type': 'Organization',
            name: appMetadata.title,
            description: appMetadata.description,
            logo: appMetadata.image.href,
            sameAs: String(
              createUrl({ pathname: appMetadata.twitter.handle, baseUrl: 'https://twitter.com' }),
            ),
          },
        }}
      />
      <Highwire
        url={String(canonicalUrl)}
        title={post.title}
        date={post.date}
        authors={post.authors.map(getPersonFullName)}
        language={post.locale}
        abstract={post.abstract}
        siteTitle={appMetadata.title}
      />
      <DublinCore
        title={post.title}
        date={post.date}
        authors={post.authors.map(getPersonFullName)}
        contributors={post.contributors?.map(getPersonFullName)}
        language={post.locale}
        abstract={post.abstract}
        licence={post.licence.name}
        tags={post.tags.map((tag) => {
          return tag.name
        })}
        siteTitle={appMetadata.title}
      />
      <MainContent className="mx-auto my-16 grid w-full max-w-6xl content-start gap-16 px-8 py-8">
        <PostHeader post={post} />
        <div
          className={cx(
            proseStyles['prose'],
            syntaxStyles['syntax-highlighting'],
            'mx-auto grid grid-cols-prose [:where(&>*)]:[grid-column:content]',
          )}
        >
          <Content components={components} />
        </div>
        <div className="grid justify-items-end gap-2 justify-self-end">
          <LastUpdated timestamp={timestamp} />
          <EditInCmsLink id={post.id} />
        </div>
        <TableOfContents tableOfContents={post.body.data.toc} />
        <RelatedPosts posts={relatedPosts} />
      </MainContent>
    </Fragment>
  )
}

interface PostHeaderProps {
  post: PostDetails
}

function PostHeader(props: PostHeaderProps): JSX.Element {
  const { post } = props

  const { plural, t } = useI18n<'common'>()
  const publishDate = useHumanReadableDate(post.date)

  const readingTime = post.body.data['readingTime'] as number

  return (
    <header className="my-16 grid gap-8">
      <dl>
        <dt className="sr-only">{t(['common', 'post', 'tag', 'other'])}</dt>
        <dd>
          <ul
            className="flex flex-wrap gap-3 text-sm font-medium text-accent-primary-text"
            role="list"
          >
            {post.tags.map((tag) => {
              return <li key={tag._id}>{tag.name}</li>
            })}
          </ul>
        </dd>
      </dl>
      <h1 className="text-5xl font-black text-accent-primary-text">{post.title}</h1>
      <time className="text-sm font-medium" dateTime={post.date}>
        {publishDate}
      </time>
      <dl className="flex items-center justify-between gap-8">
        <div>
          <dt className="sr-only">{t(['common', 'post', 'author', 'other'])}</dt>
          <dd>
            <ul
              className="flex flex-wrap gap-3 text-sm font-medium text-accent-primary-text"
              role="list"
            >
              {post.authors.map((author) => {
                const name = getPersonFullName(author)

                return <li key={author._id}>{name}</li>
              })}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="sr-only">{t(['common', 'post', 'reading-time'])}</dt>
          <dd>
            <span className="inline-flex items-center gap-2 text-sm">
              <ClockIcon className="flex-shrink-0" width="1em" />
              {t(['common', 'post', 'minute', plural(readingTime)], {
                values: { time: String(readingTime) },
              })}
            </span>
          </dd>
        </div>
      </dl>
    </header>
  )
}

interface LastUpdatedProps {
  timestamp: number
}

function LastUpdated(props: LastUpdatedProps): JSX.Element {
  const { timestamp } = props

  const { formatDateTime, t } = useI18n<'common'>()

  return (
    <div className="text-sm">
      {t(['common', 'post', 'last-updated'], {
        // FIXME: `<time />`
        values: { date: formatDateTime(timestamp, { dateStyle: 'long' }) },
      })}
    </div>
  )
}

interface RelatedPostsProps {
  posts: Array<PostCore>
}

function RelatedPosts(props: RelatedPostsProps): JSX.Element | null {
  const { posts } = props

  const { t } = useI18n<'common'>()

  if (posts.length === 0) return null

  return (
    <section className="grid gap-2">
      <h2 className="text-2xl font-bold text-heading-text">
        {t(['common', 'post', 'related-posts'])}
      </h2>
      <PostsList posts={posts} />
    </section>
  )
}

interface TableOfContentsProps {
  tableOfContents: PostDetails['body']['data']['toc']
}

function TableOfContents(props: TableOfContentsProps): JSX.Element | null {
  const { tableOfContents } = props

  const { t } = useI18n<'common'>()
  const highlightedHeadingId = useFirstVisibleHeading()

  if (tableOfContents == null || tableOfContents.length === 0) return null

  return (
    <nav aria-label={t(['common', 'post', 'table-of-contents'])}>
      <h2 className="text-sm font-bold uppercase tracking-wide">
        {t(['common', 'post', 'table-of-contents'])}
      </h2>
      <TableOfContentsLevel highlightedHeadingId={highlightedHeadingId} level={tableOfContents} />
    </nav>
  )
}

interface TableOfContentsLevelProps {
  /** @default 0 */
  depth?: number
  highlightedHeadingId: string | null
  level: PostDetails['body']['data']['toc']
}

function TableOfContentsLevel(props: TableOfContentsLevelProps): JSX.Element | null {
  const { depth = 0, highlightedHeadingId, level } = props

  if (level == null || level.length === 0) return null

  return (
    <ol
      className="grid gap-1 text-sm"
      data-toc-level={depth}
      style={{ marginInlineStart: depth * 8 }}
    >
      {level.map((heading) => {
        const isHighlighted = highlightedHeadingId != null && heading.id === highlightedHeadingId

        return (
          <li key={heading.id} className="grid gap-1">
            <Link className={isHighlighted ? 'font-bold' : undefined} href={{ hash: heading.id }}>
              {heading.value}
            </Link>
            <TableOfContentsLevel
              depth={depth + 1}
              highlightedHeadingId={highlightedHeadingId}
              level={heading.children}
            />
          </li>
        )
      })}
    </ol>
  )
}
