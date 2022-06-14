import { randomBytes } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import { baseUrl } from '~/config/app.config'

const githubId = process.env['GITHUB_ID']

if (githubId == null) {
  throw new Error('No GitHub ID provided.')
}

export default function handler(request: NextApiRequest, response: NextApiResponse): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const url = new URL(request.url!, baseUrl)

  const provider = url.searchParams.get('provider')
  const scope = url.searchParams.get('scope')

  if (provider !== 'github' || scope == null) {
    response.status(400).json({ message: 'Invalid CMS configuration.' })
    return
  }

  const callbackUrl = new URL('/api/auth/callback', baseUrl)
  const state = randomBytes(64).toString('hex')

  const redirectUrl = new URL('https://github.com/login/oauth/authorize')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  redirectUrl.searchParams.set('client_id', githubId!)
  redirectUrl.searchParams.set('redirect_uri', String(callbackUrl))
  redirectUrl.searchParams.set('scope', scope)
  redirectUrl.searchParams.set('state', state)

  response.redirect(302, String(url))
}
