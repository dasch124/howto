import { MoonIcon, SunIcon } from '@heroicons/react/outline'
import { useTheme } from '@stefanprobst/next-theme'

import { useI18n } from '@/app/i18n/use-i18n'

export function ColorSchemeToggle(): JSX.Element | null {
  const { t } = useI18n<'common'>()
  const { theme, toggleTheme } = useTheme()

  if (theme == null) return null

  function onToggleColorScheme() {
    toggleTheme()
  }

  const icons = {
    light: SunIcon,
    dark: MoonIcon,
  }

  const Icon = icons[theme]

  return (
    <button
      aria-label={t(['common', 'toggle-color-scheme'])}
      className="flex-shrink-0 transition hover:text-accent-primary-text focus-visible:text-accent-primary-text"
      onClick={onToggleColorScheme}
    >
      <Icon width="1em" />
    </button>
  )
}
