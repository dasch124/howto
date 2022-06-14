import type { CmsConfig } from 'netlify-cms-core'

import { collection as courses } from '@/cms/collections/courses.collection'
import { collection as licences } from '@/cms/collections/licences.collection'
import { collection as people } from '@/cms/collections/people.collection'
import { collection as posts } from '@/cms/collections/posts.collection'
import { collection as tags } from '@/cms/collections/tags.collection'
import { baseUrl } from '~/config/app.config'

export const collections = {
  courses,
  licences,
  people,
  posts,
  tags,
}

export const config: CmsConfig = {
  site_url: String(baseUrl),
  logo_url: '/assets/images/logo-with-text.svg',
  load_config_file: false,
  local_backend: process.env['NEXT_PUBLIC_LOCAL_CMS'] === 'enabled',
  backend: {
    name: 'github',
    repo: process.env['NEXT_PUBLIC_GIT_REPO'] ?? 'acdh-oeaw/howto',
    branch: process.env['NEXT_PUBLIC_GIT_BRANCH'] ?? 'main',
    base_url: String(baseUrl),
    auth_endpoint: 'api/auth/github',
    auth_scope: 'public_repo',
    squash_merges: true,
    commit_messages: {
      create: 'content(cms): create {{collection}} "{{slug}}"',
      update: 'content(cms): update {{collection}} "{{slug}}"',
      delete: 'content(cms): delete {{collection}} "{{slug}}"',
      uploadMedia: 'content(cms): upload "{{path}}"',
      deleteMedia: 'content(cms): delete "{{path}}"',
      openAuthoring: '{{message}}',
    },
  },
  publish_mode: 'editorial_workflow',
  show_preview_links: false,
  media_folder: 'public/assets/cms',
  public_folder: '/assets/cms',
  editor: { preview: false },
  collections: Object.values(collections),
}
