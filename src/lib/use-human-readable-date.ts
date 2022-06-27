import { useI18n } from '@/app/i18n/use-i18n'

const ONE_DAY = 1000 * 60 * 60 * 24

export function useHumanReadableDate(isoDateString: IsoDateString): string {
  const { formatDateTime, formatRelativeTime } = useI18n<'common'>()

  const date = new Date(isoDateString)
  const daysAgo = Math.floor(date.getTime() - Date.now() / ONE_DAY)

  if (daysAgo < 30) {
    return formatRelativeTime(daysAgo, 'day', { numeric: 'always', style: 'long' })
  }

  return formatDateTime(date, { dateStyle: 'long' })
}
