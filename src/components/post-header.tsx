import { ClockIcon } from '@heroicons/react/outline'

import { useI18n } from '@/app/i18n/use-i18n'
import type { PostDetails } from '@/cms/cms.client'
import { getPersonFullName } from '@/cms/cms.client'
import { useHumanReadableDate } from '@/lib/use-human-readable-date'

interface PostHeaderProps {
  post: PostDetails
}

export function PostHeader(props: PostHeaderProps): JSX.Element {
  const { post } = props

  const { plural, t } = useI18n<'common'>()
  const publishDate = useHumanReadableDate(post.date)

  return (
    <header className="my-8 grid gap-8">
      <dl>
        <dt className="sr-only">{t(['common', 'post', 'tag', 'other'])}</dt>
        <dd>
          <ul
            className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm font-medium text-accent-primary-text"
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
              className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm font-medium text-accent-primary-text"
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
              {t(['common', 'post', 'minute', plural(post.readingTime)], {
                values: { time: String(post.readingTime) },
              })}
            </span>
          </dd>
        </div>
      </dl>
    </header>
  )
}
