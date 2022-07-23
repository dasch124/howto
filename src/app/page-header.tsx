import Link from 'next/link'

import { ColorSchemeToggle } from '@/app/color-scheme-toggle'
import { useI18n } from '@/app/i18n/use-i18n'
import { LanguageToggle } from '@/app/language-toggle'
import * as routes from '@/app/route/routes.config'
import { usePathname } from '@/app/route/use-pathname'
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
        <ColorSchemeToggle />
      </div>
    </header>
  )
}
