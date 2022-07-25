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

  const label = t(['common', 'post', isCopied ? 'copied' : 'copy'])

  return (
    <button className={cx()} onClick={onCopy} type="button">
      {label}
    </button>
  )
}
