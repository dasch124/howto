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
import { MainLayout } from '@/components/main.layout'
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
      <MainLayout>
        <PostsPageHeader title={metadata.title} />
        <PostsSection page={page} pages={pages} posts={posts} />
      </MainLayout>
    </Fragment>
  )
}

interface PostsPageHeaderProps {
  title: ReactNode
}

function PostsPageHeader(props: PostsPageHeaderProps): JSX.Element {
  const { title } = props

  return (
    <header className="my-8 grid gap-8">
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

function PostsPageNavigation(props: PostsPageNavigationProps): JSX.Element | null {
  const { page, pages } = props

  const { t } = useI18n<'common'>()

  const hasPreviousPage = page > 1
  const hasNextPage = page < pages

  if (!hasPreviousPage && !hasNextPage) return null

  return (
    <nav aria-label={t(['common', 'posts-pages'])}>
      <ul
        className="flex items-center justify-between text-sm text-accent-secondary-text"
        // role="list"
      >
        {hasPreviousPage ? (
          <li className="justify-self-start">
            <Link href={routes.posts({ page: Math.max(page - 1, 1) })} rel="prev">
              &laquo; {t(['common', 'previous-page'])}
            </Link>
          </li>
        ) : null}
        {hasNextPage ? (
          <li className="justify-self-end">
            <Link href={routes.posts({ page: Math.min(page + 1, pages) })} rel="next">
              {t(['common', 'next-page'])} &raquo;
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}
