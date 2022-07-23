import Link from 'next/link'

import { useI18n } from '@/app/i18n/use-i18n'
import { useLocale } from '@/app/route/use-locale'
import { usePathname } from '@/app/route/use-pathname'
import { useSearchParams } from '@/app/route/use-search-params'
import { useUrlFragment } from '@/app/route/use-url-fragment'

export function LanguageToggle(): JSX.Element {
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
