import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Fragment } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import * as routes from '@/app/route/routes.config'
import type { PostCore } from '@/cms/cms.client'
import { getPostsCore } from '@/cms/cms.client'
import { MainContent } from '@/components/main-content'
import { PostsList } from '@/components/posts-list'
import { getPage } from '@/lib/get-page'
import { getPageRange } from '@/lib/get-page-range'
import type { Locale } from '~/config/i18n.config'

export type PostsPageParams = {
  page: number
}

interface PostsPageProps {
  page: number
  pages: number
  posts: Array<PostCore>
}

export function getStaticPaths(
  context: GetStaticPathsContext,
): GetStaticPathsResult<PageParams<PostsPageParams>> {
  const locales = context.locales as Array<Locale>
  const posts = getPostsCore()
  const pages = getPageRange(posts)
  const paths = locales.flatMap((locale) => {
    return pages.map((page) => {
      return { params: { page: String(page) }, locale }
    })
  })

  return { paths, fallback: false }
}

export const getStaticProps = withDictionaries(
  ['common'],
  function getStaticProps(
    context: GetStaticPropsContext<PageParams<PostsPageParams>>,
  ): GetStaticPropsResult<PostsPageProps> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const params = context.params!
    const page = Number(params.page)
    const allPosts = getPostsCore()
    const pages = getPageRange(allPosts).length
    const posts = getPage(allPosts, page)

    return { props: { page, pages, posts } }
  },
)

export default function PostsPage(props: PostsPageProps): JSX.Element {
  const { page, pages, posts } = props

  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'posts', 'metadata', 'title']) }

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <MainContent className="mx-auto my-16 grid w-full max-w-6xl content-start gap-16 px-8 py-8">
        <PostsPageHeader title={metadata.title} />
        <PostsSection page={page} pages={pages} posts={posts} />
      </MainContent>
    </Fragment>
  )
}

interface PostsPageHeaderProps {
  title: ReactNode
}

function PostsPageHeader(props: PostsPageHeaderProps): JSX.Element {
  const { title } = props

  return (
    <header className="my-16 grid gap-8">
      <h1 className="text-5xl font-black text-accent-primary-text">{title}</h1>
    </header>
  )
}

interface PostsSectionProps {
  page: number
  pages: number
  posts: Array<PostCore>
}

function PostsSection(props: PostsSectionProps): JSX.Element {
  const { page, pages, posts } = props

  const { t } = useI18n<'common'>()

  return (
    <section className="grid gap-12">
      <h2 className="text-2xl font-bold text-heading-text">
        {t(['common', 'posts', 'all-posts'])}
      </h2>
      <PostsList posts={posts} />
      <div className="my-12">
        <PostsPageNavigation page={page} pages={pages} />
      </div>
    </section>
  )
}

interface PostsPageNavigationProps {
  page: number
  pages: number
}

function PostsPageNavigation(props: PostsPageNavigationProps): JSX.Element {
  const { page, pages } = props

  const { t } = useI18n<'common'>()

  return (
    <nav>
      <ul
        className="flex items-center justify-between text-sm text-accent-secondary-text"
        // role="list"
      >
        <li>
          <Link
            aria-disabled={page - 1 < 1}
            href={routes.posts({ page: Math.max(page - 1, 1) })}
            rel="prev"
          >
            &laquo; {t(['common', 'previous-page'])}
          </Link>
        </li>
        <li>
          <Link
            aria-disabled={page + 1 > pages}
            href={routes.posts({ page: Math.min(page + 1, pages) })}
            rel="next"
          >
            {t(['common', 'next-page'])} &raquo;
          </Link>
        </li>
      </ul>
    </nav>
  )
}
