import Link from 'next/link'

import { useI18n } from '@/app/i18n/use-i18n'
import * as routes from '@/app/route/routes.config'
import type { PostCore } from '@/cms/cms.client'
import { getPersonFullName } from '@/cms/cms.client'

interface PostsListProps {
  posts: Array<PostCore>
}

export function PostsList(props: PostsListProps): JSX.Element {
  const { posts } = props

  const { formatDateTime, t } = useI18n<'common'>()

  if (posts.length === 0) {
    return <p>{t(['common', 'posts', 'no-posts'])}</p>
  }

  return (
    <ul
      className="grid grid-cols-[repeat(auto-fill,minmax(min(400px,100%),1fr))] gap-16"
      role="list"
    >
      {posts.map((post) => {
        const href = routes.post({ id: post.id })

        return (
          <li key={post._id}>
            <article className="grid gap-4">
              <dl>
                <dt className="sr-only">{t(['common', 'post', 'tag', 'other'])}</dt>
                <dd>
                  <ul
                    className="flex flex-wrap gap-3 text-sm font-medium leading-none text-accent-primary-text"
                    role="list"
                  >
                    {post.tags.map((tag) => {
                      return <li key={tag._id}>{tag.name}</li>
                    })}
                  </ul>
                </dd>
              </dl>
              <h3 className="text-xl font-bold text-heading-text">
                <Link href={href}>{post.title}</Link>
              </h3>
              <time className="text-sm font-medium" dateTime={post.date}>
                {formatDateTime(new Date(post.date), { dateStyle: 'long' })}
              </time>
              <p>{post.abstract}</p>
              <footer className="flex items-center justify-between gap-8">
                <dl>
                  <dt className="sr-only">{t(['common', 'post', 'author', 'other'])}</dt>
                  <dd>
                    <ul
                      className="flex flex-wrap gap-3 text-sm font-medium leading-none text-accent-primary-text"
                      role="list"
                    >
                      {post.authors.map((author) => {
                        const name = getPersonFullName(author)

                        return <li key={author._id}>{name}</li>
                      })}
                    </ul>
                  </dd>
                </dl>
                <Link className="text-sm text-accent-secondary-text" href={href}>
                  {t(['common', 'read-more'])}
                </Link>
              </footer>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
