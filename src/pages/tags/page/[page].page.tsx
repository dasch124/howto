import type { ParsedUrlQuery } from 'querystring'

import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

import { Svg as TagIcon } from '@/assets/icons/tag.svg'
import { getTagIds, getTags } from '@/cms/api/tags.api'
import type { Tag } from '@/cms/api/tags.api'
import { getPostPreviewsByTagId } from '@/cms/queries/posts.queries'
import type { Page } from '@/cms/utils/paginate'
import { getPageRange, paginate } from '@/cms/utils/paginate'
import { Icon } from '@/common/Icon'
import { PageContent } from '@/common/PageContent'
import { PageTitle } from '@/common/PageTitle'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { routes } from '@/navigation/routes.config'

const pageSize = 50

type TagWithPostCount = Tag & { posts: number }

export interface TagsPageParams extends ParsedUrlQuery {
  page: string
}

export interface TagsPageProps {
  dictionary: Dictionary
  tags: Page<TagWithPostCount>
}

/**
 * Creates tags pages.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<TagsPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getTagIds(locale)
        const pages = getPageRange(ids, pageSize)

        return pages.map((page) => {
          return {
            params: { page: String(page) },
            locale,
          }
        })
      }),
    )
  ).flat()

  return {
    paths,
    fallback: false,
  }
}

/**
 * Provides metadata and translations for tags page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<TagsPageParams>,
): Promise<GetStaticPropsResult<TagsPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const params = context.params as TagsPageParams
  const page = Number(params.page)

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const tags = paginate(await getTags(locale), pageSize)[page - 1]!
  const tagsWithPostCount = (
    await Promise.all(
      tags.items.map(async (tag) => {
        const postsWithTag = await getPostPreviewsByTagId(tag.id, locale)

        return {
          ...tag,
          posts: postsWithTag.length,
        }
      }),
    )
  ).filter((tag) => {
    return tag.posts > 0
  }) // FIXME: paginate after filtering - needs caching!

  return {
    props: {
      dictionary,
      tags: { ...tags, items: tagsWithPostCount },
    },
  }
}

/**
 * Tags page.
 */
export default function TagsPage(props: TagsPageProps): JSX.Element {
  const { tags } = props

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={t('common.page.tags')}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="flex flex-col w-full max-w-screen-xl px-10 py-16 mx-auto space-y-10">
        <PageTitle>{t('common.tags')}</PageTitle>
        <TagsList tags={tags.items} />
      </PageContent>
    </Fragment>
  )
}

interface TagsListProps {
  tags: Array<TagWithPostCount>
}

/**
 * Tags list.
 */
function TagsList(props: TagsListProps): JSX.Element | null {
  const { tags } = props

  if (tags.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-col space-y-4">
      {tags.map((tag) => {
        return (
          <li key={tag.id}>
            <Link href={routes.tag({ id: tag.id })}>
              <a className="flex items-center space-x-1.5">
                <Icon icon={TagIcon} className="flex-shrink-0 w-6 h-6" />
                <span>
                  {tag.name} ({tag.posts})
                </span>
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
