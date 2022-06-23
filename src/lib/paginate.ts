import { getPageRange } from '@/lib/get-page-range'
import { defaultPageSize } from '~/config/ui.config'

export interface Page<T> {
  items: Array<T>
  page: number
  pages: number
}

export function paginate<T>(items: Array<T>, pageSize = defaultPageSize): Array<Page<T>> {
  const pages = getPageRange(items, pageSize)

  return pages.map((page) => {
    return {
      items: items.slice((page - 1) * pageSize, page * pageSize),
      page,
      pages: pages.length,
    }
  })
}
