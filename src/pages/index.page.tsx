import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type { GetStaticPropsResult } from 'next'
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
import { recentPostsCount } from '~/config/ui.config'

interface HomePageProps {
  posts: Array<PostCore>
}

export const getStaticProps = withDictionaries(
  ['common'],
  function getStaticProps(): GetStaticPropsResult<HomePageProps> {
    const posts = getPostsCore().slice(0, recentPostsCount)

    return { props: { posts } }
  },
)

export default function HomePage(props: HomePageProps): JSX.Element {
  const { posts } = props

  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'home', 'metadata', 'title']) }

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <MainLayout>
        <HomePageHeader />
        <RecentPostsSection posts={posts} />
      </MainLayout>
    </Fragment>
  )
}

function HomePageHeader(): JSX.Element {
  const { t } = useI18n<'common'>()

  return (
    <header className="my-16 grid gap-8">
      <h1 className="text-5xl font-black text-heading-text">
        {t(['common', 'home', 'hero', 'title'], { components: { PrimaryAccent, SecondaryAccent } })}
      </h1>
      <p>{t(['common', 'home', 'hero', 'text'])}</p>
    </header>
  )
}

interface PrimaryAccentProps {
  children?: ReactNode
}

function PrimaryAccent(props: PrimaryAccentProps): JSX.Element {
  const { children } = props

  return <span className="text-accent-primary-text">{children}</span>
}

interface SecondaryAccentProps {
  children?: ReactNode
}

function SecondaryAccent(props: SecondaryAccentProps): JSX.Element {
  const { children } = props

  return <span className="text-accent-secondary-text">{children}</span>
}

interface RecentPostsSectionProps {
  posts: Array<PostCore>
}

function RecentPostsSection(props: RecentPostsSectionProps): JSX.Element {
  const { posts } = props

  const { t } = useI18n<'common'>()

  const href = routes.posts()

  return (
    <section className="grid gap-12">
      <div className="flex items-baseline justify-between gap-8 border-b pb-2">
        <h2 className="text-2xl font-bold text-heading-text">
          {t(['common', 'posts', 'new-posts'])}
        </h2>
        <Link className="text-sm text-accent-secondary-text" href={href}>
          {t(['common', 'posts', 'all-posts'])}
        </Link>
      </div>
      <PostsList posts={posts} />
    </section>
  )
}
