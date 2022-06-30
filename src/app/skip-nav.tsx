import Link from 'next/link'

import { useI18n } from '@/app/i18n/use-i18n'

export const mainContentId = 'main-content'

export function SkipNav(): JSX.Element {
  const { t } = useI18n<'common'>()

  function onMoveFocus() {
    const element = document.getElementById(mainContentId)
    element?.focus()
  }

  return (
    <Link
      className="absolute m-4 -translate-y-16 rounded bg-accent-primary-background px-4 py-2 font-medium text-text-inverted focus:translate-y-0 focus:text-text-inverted"
      href={{ hash: mainContentId }}
      onClick={onMoveFocus}
    >
      {t(['common', 'skip-to-main-content'])}
    </Link>
  )
}
