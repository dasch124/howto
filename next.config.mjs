/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {import('webpack').Configuration} WebpackConfig */
/** @typedef {import('~/config/i18n.config').Locale} Locale */

// @ts-expect-error Missing module declaration.
import createBundleAnalyzerPlugin from '@next/bundle-analyzer'
import { log } from '@stefanprobst/log'
import { createContentlayerPlugin } from 'next-contentlayer'

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
