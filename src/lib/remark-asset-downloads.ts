import { isAbsoluteUrl } from '@stefanprobst/is-absolute-url'
import type * as Mdast from 'mdast'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export interface Options {
  publicDirectory?: string
}

const withAssetDownloads: Plugin<[Options?], Mdast.Root> = function withAssetDownloads(
  options?: Options,
) {
  const { publicDirectory = '/' } = options || {}

  return async function transformer(tree, vfile) {
    const directory = path.dirname(
      path.isAbsolute(vfile.path) ? vfile.path : path.join(vfile.cwd, vfile.path),
    )
    const publicFolder = path.join(process.cwd(), 'public')

    const promises: Array<Promise<void>> = []

    visit(tree, 'link', (node) => {
      if (isAbsoluteUrl(node.url)) return

      const sourceFilePath = path.join(directory, path.normalize(node.url))
      const publicPath = path.join(publicDirectory, path.relative(process.cwd(), sourceFilePath))
      const destinationFilePath = path.join(publicFolder, publicPath)

      async function copyAsset() {
        // TODO: should we hash content, so we can check if we need to copy when file already exists at destination?
        await fs.mkdir(path.dirname(destinationFilePath), { recursive: true })
        await fs.copyFile(sourceFilePath, destinationFilePath)
      }

      // TODO: ok?
      if (process.env['NODE_ENV'] === 'production') {
        promises.push(copyAsset())
      }

      node.url = publicPath
      node.data = node.data ?? {}
      node.data['hProperties'] = node.data['hProperties'] ?? {}
      // @ts-expect-error Unknown type for `hProperties`.
      node.data['hProperties'].download = true
    })

    await Promise.all(promises)
  }
}

export default withAssetDownloads
