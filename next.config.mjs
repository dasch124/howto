/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {import('webpack').Configuration} WebpackConfig */
/** @typedef {import('~/config/i18n.config').Locale} Locale */

// @ts-expect-error Missing module declaration.
import createBundleAnalyzerPlugin from '@next/bundle-analyzer'
import { log } from '@stefanprobst/log'
import { createContentlayerPlugin } from 'next-contentlayer'
import fs from 'node:fs/promises'
import path from 'node:path'

const locales = /** @type {Array<Locale>} */ (['en', 'de'])
const defaultLocale = /** @type {Locale} */ ('en')

const isProductionDeploy = process.env['NEXT_PUBLIC_BASE_URL'] === 'https://howto.acdh.oeaw.ac.at'

/** @type {NextConfig} */
const config = {
  eslint: {
    dirs: [process.cwd()],
    ignoreDuringBuilds: true,
  },
  experimental: {
    browsersListForSwc: true,
    legacyBrowsers: false,
    newNextLinkBehavior: true,
    outputStandalone: true,
  },
  headers() {
    const headers = [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/assets/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ]

    if (!isProductionDeploy) {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      })

      log.warn('Indexing by search engines is disallowed.')
    }

    return Promise.resolve(headers)
  },
  i18n: {
    defaultLocale,
    locales,
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  reactStrictMode: true,
  async redirects() {
    /** @type {Awaited<ReturnType<Exclude<NextConfig['redirects'], undefined>>>} */
    const redirects = []

    async function fileExists(/** @type {string} */ filePath) {
      try {
        await fs.stat(filePath)
        return true
      } catch {
        return false
      }
    }

    const postsRedirectsManifest = path.join(process.cwd(), 'redirects.posts.json')
    if (await fileExists(postsRedirectsManifest)) {
      const posts = JSON.parse(await fs.readFile(postsRedirectsManifest, { encoding: 'utf-8' }))
      redirects.push(
        ...Object.entries(posts).map(([uuid, id]) => {
          return {
            source: `/id/${uuid}`,
            destination: `/posts/${id}`,
            permanent: false,
          }
        }),
      )
    }

    return redirects
  },
  async rewrites() {
    const rewrites = [{ source: '/posts', destination: '/posts/page/1' }]

    return rewrites
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(/** @type {WebpackConfig} */ config) {
    config.experiments = config.experiments ?? {}
    config.experiments.topLevelAwait = true

    config.infrastructureLogging = { level: 'error' }

    return config
  },
}

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
  createBundleAnalyzerPlugin({ enabled: process.env['BUNDLE_ANALYZER'] === 'enabled' }),
  createContentlayerPlugin(),
]

export default plugins.reduce((config, plugin) => {
  return plugin(config)
}, config)
