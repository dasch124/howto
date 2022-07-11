import Link from 'next/link'

import { useI18n } from '@/app/i18n/use-i18n'
import * as routes from '@/app/route/routes.config'
import { useLocale } from '@/app/route/use-locale'
import { usePathname } from '@/app/route/use-pathname'
import { useSearchParams } from '@/app/route/use-search-params'
import { useUrlFragment } from '@/app/route/use-url-fragment'
import { SearchDialogTrigger } from '@/components/search-dialog-trigger'

export function PageHeader(): JSX.Element {
  const { t } = useI18n<'common'>()
  const { pathname } = usePathname()

  return (
    <header className="flex items-center justify-between gap-8 px-8 py-4">
      <Link aria-label={t(['common', 'home', 'metadata', 'title'])} href={routes.home()}>
        {/* <Head>
          <link as="image" href="/assets/images/logo.svg" rel="preload" />
        </Head> */}
        <svg fill="currentColor" height={40} width={40}>
          <use href="/assets/images/logo.svg#root" />
        </svg>
      </Link>
      <div className="flex items-center gap-8">
        <nav className="font-medium">
          <ul role="list">
            <li>
              <Link
                aria-current={pathname.startsWith(routes.posts().pathname) ? 'page' : undefined}
                href={routes.posts()}
              >
                {t(['common', 'posts', 'metadata', 'title'])}
              </Link>
            </li>
          </ul>
        </nav>
        <SearchDialogTrigger />
        <LanguageToggle />
      </div>
    </header>
  )
}

function LanguageToggle(): JSX.Element {
  const { locale } = useLocale()
  const { pathname } = usePathname()
  const { searchParams } = useSearchParams()
  const { hash } = useUrlFragment()
  const { t } = useI18n<'common'>()

  const language = locale === 'en' ? 'de' : 'en'

  return (
    <Link
      aria-label={t(['common', 'change-language-to'], {
        values: { language: t(['common', 'language', language]) },
      })}
      className="inline-grid place-items-center rounded bg-accent-secondary-background p-1.5 text-xs font-medium text-text-inverted hover:text-text-inverted focus-visible:text-text-inverted"
      /** To avoid hydration errors we only add search params and hash clientside. */
      href={{ pathname, query: String(searchParams), hash }}
      locale={language}
    >
      {locale.toUpperCase()}
    </Link>
  )
}
