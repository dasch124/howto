import type { CreateAppUrlArgs } from '@/lib/create-app-url'
import { createAppUrl } from '@/lib/create-app-url'

export function createAssetLink(args: CreateAppUrlArgs): string {
  const url = createAppUrl(args)
  return url.pathname
}
