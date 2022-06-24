import { log } from '@stefanprobst/log'
import type { RequestOptions } from '@stefanprobst/request'
import { createUrl, request } from '@stefanprobst/request'

const apiToken = process.env['GITHUB_API_TOKEN']
const repo = process.env['NEXT_PUBLIC_GIT_REPO'] ?? 'acdh-oeaw/howto'

export async function getLastUpdatedTimestamp(filePath: string): Promise<number> {
  if (apiToken == null) {
    log.warn('No GitHub token provided. Using current date as last updated timestamp.')
    return Date.now()
  }

  const url = createUrl({
    baseUrl: 'https://api.github.com',
    pathname: `/repos/${repo}/commits`,
    searchParams: {
      path: filePath,
      page: 1,
      per_page: 1,
    },
  })
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${apiToken}`,
  }
  const options: RequestOptions = { headers, responseType: 'json' }

  const [{ commit }] = await request(url, options)
  const timestamp = new Date(commit.committer.date).getTime()

  return timestamp
}
