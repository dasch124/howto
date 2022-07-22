import type * as Mdast from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

const withImageLinks: Plugin<[], Mdast.Root> = function withComponents() {
  return function transformer(tree, _file) {
    visit(tree, 'image', function onImage(node, index, parent) {
      if (parent == null || index == null) return

      const link: Mdast.Link = {
        type: 'link',
        url: node.url,
        data: {
          hProperties: {
            rel: 'noreferrer',
            target: '_blank',
          },
        },
        children: [node],
      }

      parent.children.splice(index, 1, link)
    })
  }
}

export default withImageLinks
