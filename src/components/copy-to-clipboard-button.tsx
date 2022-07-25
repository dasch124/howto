import cx from 'clsx'

import { useI18n } from '@/app/i18n/use-i18n'
import { useCopyToClipboard } from '@/lib/use-copy-to-clipboard'

interface CopyToClipboardButtonProps {
  value: string
}

export function CopyToClipboardButton(props: CopyToClipboardButtonProps): JSX.Element {
  const { value } = props

  const { t } = useI18n<'common'>()
  const { copy, isCopied } = useCopyToClipboard()

  function onCopy() {
    copy(value)
  }

  const label = t([
    'common',
    'post',
    'code',
    isCopied ? 'copied-to-clipboard' : 'copy-to-clipboard',
  ])

  return (
    <button
      className={cx(
        'absolute bottom-10 right-4 rounded border px-2 py-1 text-xs transition hover:text-muted-background',
        isCopied
          ? 'border-accent-secondary-background text-accent-secondary-text hover:bg-accent-secondary-background'
          : 'border-accent-primary-background text-accent-primary-text hover:bg-accent-primary-background',
      )}
      onClick={onCopy}
      type="button"
    >
      {label}
    </button>
  )
}
