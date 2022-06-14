import { log } from '@stefanprobst/log'
import fs from 'node:fs/promises'
import path from 'node:path'
import { rss } from 'xast-util-feed'
import { toXml } from 'xast-util-to-xml'

import { getPersonFullName, getPostsCore } from '@/cms/cms.client'
import { createAppUrl } from '@/lib/create-app-url'
import { createAssetLink } from '@/lib/create-asset-link'
import { defaultLocale } from '~/config/i18n.config'
import { metadata as appMetadata } from '~/config/metadata.config'
import { maxEntriesPerChannel, rssFeedFileName } from '~/config/rss-feed.config'

function generate() {
  const locale = defaultLocale
  const posts = getPostsCore().slice(0, maxEntriesPerChannel)
  const metadata = appMetadata[locale]

  const channel = {
    title: metadata.title,
    url: String(createAppUrl({ locale })),
    feedUrl: String(createAppUrl({ locale, pathname: rssFeedFileName })),
    description: metadata.description,
    author: metadata.creator?.name,
    tags: ['Digital Humanities'],
  }

  const entries = posts.map((post) => {
    return {
      title: post.title,
      url: String(createAppUrl({ locale, pathname: `/posts/${post.id}` })),
      description: post.abstract,
      author: post.authors
        .map((author) => {
          return getPersonFullName(author)
        })
        .join(', '),
      published: post.date,
      tags: post.tags.map((tag) => {
        return tag.name
      }),
    }
  })

  const feed = toXml(rss(channel, entries))

  const publicFolder = path.join(process.cwd(), 'public')
  const outputFolder = path.join(publicFolder, createAssetLink({ locale }))
  const outputFileName = path.join(outputFolder, rssFeedFileName)

  return fs.writeFile(outputFileName, feed, { encoding: 'utf-8' })
}

generate()
  .then(() => {
    log.success('Successfully generated RSS feed.')
  })
  .catch((error) => {
    log.error('Failed to generate RSS feed.\n', String(error))
  })
