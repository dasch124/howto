import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type { GetStaticPropsResult } from 'next'
import type { ReactNode } from 'react'
import { Fragment } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import type { PostCore } from '@/cms/cms.client'
import { getPostsCore } from '@/cms/cms.client'
import { MainContent } from '@/components/main-content'
import { PostsList } from '@/components/posts-list'

interface PostsPageProps {
  posts: Array<PostCore>
}

export const getStaticProps = withDictionaries(
  ['common'],
  function getStaticProps(): GetStaticPropsResult<PostsPageProps> {
    const posts = getPostsCore()

    return { props: { posts } }
  },
)

export default function PostsPage(props: PostsPageProps): JSX.Element {
  const { posts } = props

  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'posts', 'metadata', 'title']) }

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <MainContent className="mx-auto my-16 grid w-full max-w-6xl content-start gap-16 px-8 py-8">
        <PostsPageHeader title={metadata.title} />
        <PostsSection posts={posts} />
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
  posts: Array<PostCore>
}

function PostsSection(props: PostsSectionProps): JSX.Element {
  const { posts } = props

  const { t } = useI18n<'common'>()

  return (
    <section className="grid gap-12">
      <h2 className="text-2xl font-bold text-heading-text">
        {t(['common', 'posts', 'all-posts'])}
      </h2>
      <PostsList posts={posts} />
    </section>
  )
}
