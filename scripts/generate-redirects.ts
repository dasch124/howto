import { log } from '@stefanprobst/log'
import fs from 'node:fs/promises'
import path from 'node:path'
import { format } from 'prettier'

import { getCurriculaCore, getPostsCore } from '@/cms/cms.client'

function createRedirects(resources: Array<{ uuid: string; id: string }>, fileName: string) {
  const redirects: Record<string, string> = {}

  resources.forEach((resource) => {
    redirects[resource.uuid] = resource.id
  })

  return fs.writeFile(
    path.join(process.cwd(), fileName),
    format(JSON.stringify(redirects), { parser: 'json' }),
    { encoding: 'utf-8' },
  )
}

function generate() {
  const posts = getPostsCore()
  const curricula = getCurriculaCore()

  return Promise.all([
    createRedirects(posts, 'redirects.posts.json'),
    createRedirects(curricula, 'redirects.curricula.json'),
  ])
}

generate()
  .then(() => {
    log.success('Successfully updated redirects.')
  })
  .catch((error) => {
    log.error('Failed to update redirects.\n', String(error))
  })
