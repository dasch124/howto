import type * as Mdast from 'mdast'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import type { Transformer } from 'unified'
import type * as Unist from 'unist'
import { visit } from 'unist-util-visit'

/**
 * Remark plugin which resolves asset references for the cms preview.
 *
 * When a resource is not yet saved, asset data is held in memory by the cms,
 * and needs to be resolved via `getAsset`.
 */
export default function withCmsPreviewAssets(
  getAsset: PreviewTemplateComponentProps['getAsset'],
): Transformer {
  return function transformer(tree: Unist.Node) {
    visit(tree, 'image', (node: Mdast.Image) => {
      node.url = String(getAsset(node.url))
    })
  }
}
