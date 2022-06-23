import { defaultPageSize } from '~/config/ui.config'

export function getPage<T>(items: Array<T>, page: number, pageSize = defaultPageSize): Array<T> {
  return items.slice((page - 1) * pageSize, page * pageSize)
}
