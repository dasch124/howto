import { range } from '@stefanprobst/range'

import { defaultPageSize } from '~/config/ui.config'

export function getPageRange(items: Array<unknown>, pageSize = defaultPageSize): Array<number> {
  const pages = Math.ceil(items.length / pageSize)

  return range(1, pages)
}
