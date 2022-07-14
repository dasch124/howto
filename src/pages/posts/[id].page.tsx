import { Dialog, Transition } from '@headlessui/react'
import { HashtagIcon as TableOfContentsIcon } from '@heroicons/react/outline'
import { isNonEmptyString } from '@stefanprobst/is-nonempty-string'
import { PageMetadata, SchemaOrg } from '@stefanprobst/next-page-metadata'
import { createUrl } from '@stefanprobst/request'
import cx from 'clsx'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Image from 'next/future/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import path from 'node:path'
import { Fragment, useEffect } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { DublinCore } from '@/app/metadata/dublin-core'
import { Highwire } from '@/app/metadata/highwire'
import { useAppMetadata } from '@/app/metadata/use-app-metadata'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { useCanonicalUrl } from '@/app/route/use-canonical-url'
import type { PostCore, PostDetails } from '@/cms/cms.client'
import { getPersonFullName, getPost, getPostIds, getPostsCoreByTags } from '@/cms/cms.client'
import { EditInCmsLink } from '@/components/edit-in-cms-link'
import { MainContent } from '@/components/main-content'
import { PostContent } from '@/components/post-content'
import { PostHeader } from '@/components/post-header'
import { PostsList } from '@/components/posts-list'
import { getLastUpdatedTimestamp } from '@/lib/get-last-updated-timestamp'
import { components } from '@/lib/mdx-components'
import { pickRandom } from '@/lib/pick-random'
import { useCurrentTocHeading } from '@/lib/use-current-toc-heading'
import { useDialogState } from '@/lib/use-dialog-state'
import { useMdxSync as useMdx } from '@/lib/use-mdx'
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

    return { props: { post, relatedPosts, timestamp } }
  },
)

export default function PostPage(props: PostPageProps): JSX.Element {
  const { post, relatedPosts, timestamp } = props

  const canonicalUrl = useCanonicalUrl()
  const appMetadata = useAppMetadata()
  const titleTemplate = usePageTitleTemplate()
  const { default: Content } = useMdx(post.code)

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
          inLanguage: post.locale,
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
          image: isNonEmptyString(post.featuredImage) ? post.featuredImage : undefined,
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
      <MainContent className="my-16 grid grid-cols-page content-start gap-y-16 py-8 px-2 sm:px-8 2xl:gap-x-16 [:where(&>*)]:[grid-column:content]">
        <PostHeader post={post} />
        <PostContent>
          <Content components={components} />
        </PostContent>
        <div className="grid justify-items-end gap-2 justify-self-end">
          <LastUpdated timestamp={timestamp} />
          <EditInCmsLink id={post.id} />
          <ShareOnTwitter />
        </div>
        <aside className="hidden items-start [grid-column:1/3] [grid-row:2] 2xl:grid">
          <div className="sticky top-12 grid max-w-xs justify-self-end py-2">
            <TableOfContents tableOfContents={post.toc} />
          </div>
        </aside>
        <aside className="block 2xl:hidden">
          <FloatingTableOfContents tableOfContents={post.toc} />
        </aside>
        <RelatedPosts posts={relatedPosts} />
      </MainContent>
    </Fragment>
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
    <Fragment>
      <hr />
      <section className="grid gap-12">
        <h2 className="text-2xl font-bold text-heading-text">
          {t(['common', 'post', 'related-posts'])}
        </h2>
        <PostsList posts={posts} />
      </section>
    </Fragment>
  )
}

interface TableOfContentsProps {
  tableOfContents: PostDetails['toc']
}

function TableOfContents(props: TableOfContentsProps): JSX.Element | null {
  const { tableOfContents } = props

  const { t } = useI18n<'common'>()
  const highlightedHeadingId = useCurrentTocHeading()

  if (tableOfContents.length === 0) return null

  return (
    <nav
      aria-label={t(['common', 'post', 'table-of-contents'])}
      className="grid gap-1 text-gray-400"
    >
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
  level: PostDetails['toc'] | undefined
}

function TableOfContentsLevel(props: TableOfContentsLevelProps): JSX.Element | null {
  const { depth = 0, highlightedHeadingId, level } = props

  if (level == null || level.length === 0) return null

  return (
    <ol className={cx('grid gap-1 text-sm', depth > 0 && 'ml-3')} data-toc-level={depth}>
      {level.map((heading) => {
        const isHighlighted = highlightedHeadingId != null && heading.id === highlightedHeadingId

        return (
          <li key={heading.id} className="grid gap-1">
            <Link
              className={isHighlighted ? 'text-highlighted-text' : undefined}
              href={{ hash: heading.id }}
            >
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

interface FloatingTableOfContentsProps {
  tableOfContents: PostDetails['toc']
}

function FloatingTableOfContents(props: FloatingTableOfContentsProps): JSX.Element | null {
  const { tableOfContents } = props

  const { t } = useI18n<'common'>()
  const dialog = useDialogState()
  const router = useRouter()

  useEffect(() => {
    router.events.on('hashChangeStart', dialog.close)

    return () => {
      router.events.off('hashChangeStart', dialog.close)
    }
  }, [router.events, dialog.close])

  if (tableOfContents.length === 0) return null

  return (
    <Fragment>
      <button
        aria-label={t(['common', 'post', 'table-of-contents'])}
        className="fixed bottom-12 right-12 grid h-12 w-12 place-items-center rounded-full bg-accent-primary-background p-2 text-white transition hover:bg-accent-secondary-background"
        onClick={dialog.toggle}
        title={t(['common', 'post', 'table-of-contents'])}
      >
        <TableOfContentsIcon width="1em" />
      </button>
      <Transition.Root appear as={Fragment} show={dialog.isOpen}>
        <Dialog as="div" className="relative z-dialog" onClose={dialog.close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-dialog overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="divide-opacity-20 mx-auto max-w-2xl transform divide-y divide-gray-500 overflow-hidden rounded bg-gray-900 shadow-2xl ring-1 ring-gray-500 ring-offset-2 ring-offset-gray-500 transition-all">
                {/* <Dialog.Title className="sr-only">{t(['common', 'post', 'table-of-contents'])}</Dialog.Title> */}
                <div className="p-8">
                  <TableOfContents tableOfContents={tableOfContents} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  )
}

function ShareOnTwitter(): JSX.Element {
  const { t } = useI18n<'common'>()
  const canonicalUrl = useCanonicalUrl()

  const href = createUrl({
    baseUrl: 'https://twitter.com/intent/tweet',
    searchParams: {
      text: 'Drop everything and read this!',
      url: String(canonicalUrl),
      hashtags: ['Digital Humanities'].join(','),
    },
  })

  return (
    <a
      className="inline-flex items-center gap-2 text-sm"
      href={String(href)}
      rel="noreferrer"
      target="_blank"
    >
      <Image
        alt=""
        className="h-5 w-5 flex-shrink-0"
        height={20}
        src="/assets/images/twitter.svg"
        width={20}
      />
      {t(['common', 'post', 'share-on-twitter'])}
    </a>
  )
}
