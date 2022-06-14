import { RssIcon } from '@heroicons/react/outline'
import Link from 'next/link'

import { useI18n } from '@/app/i18n/use-i18n'
import { useAppMetadata } from '@/app/metadata/use-app-metadata'
import * as routes from '@/app/route/routes.config'
import { useLocale } from '@/app/route/use-locale'
import { createAppUrl } from '@/lib/create-app-url'
import { rssFeedFileName } from '~/config/rss-feed.config'

export function PageFooter(): JSX.Element {
  const { locale } = useLocale()
  const { t } = useI18n<'common'>()
  const appMetadata = useAppMetadata()

  return (
    <footer className="flex items-center justify-between gap-8 px-8 py-4">
      <div className="inline-flex gap-4 text-sm">
        <span>
          &copy; {new Date().getUTCFullYear()}{' '}
          <a href={appMetadata.creator?.website} rel="noreferrer" target="_blank">
            {appMetadata.creator?.shortName}
          </a>
        </span>
        <Link href={routes.imprint()}>{t(['common', 'imprint', 'metadata', 'title'])}</Link>
      </div>
      <a
        href={String(createAppUrl({ locale, pathname: rssFeedFileName }))}
        rel="noreferrer"
        target="_blank"
        className="inline-flex items-center gap-2 text-sm"
      >
        <RssIcon className="flex-shrink-0" width="1em" />
        {t(['common', 'rss-feed'])}
      </a>
    </footer>
  )
}
