/**
 * @see https://github.com/wooorm/starry-night#example-integrate-with-unified-remark-and-rehype
 */

import type { Grammar } from '@wooorm/starry-night'
import { common, createStarryNight } from '@wooorm/starry-night'
import type * as Hast from 'hast'
import { toString } from 'hast-util-to-string'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

interface Options {
  /**
   *  Grammars to support.
   *
   * @default ['common']
   */
  grammars?: Array<Grammar>
}

/**
 * Plugin to highlight code with `starry-night`.
 */
const withSyntaxHighlighting: Plugin<[Options?], Hast.Root> = function withSyntaxHighlighting(
  options = {},
) {
  const grammars = options.grammars || common
  const starryNightPromise = createStarryNight(grammars)
  const prefix = 'language-'

  return async function (tree) {
    const starryNight = await starryNightPromise

    visit(tree, 'element', function (node, index, parent) {
      if (!parent || index === null || node.tagName !== 'pre') {
        return
      }

      const head = node.children[0]

      if (!head || head.type !== 'element' || head.tagName !== 'code' || !head.properties) {
        return
      }

      const classes = head.properties['className']

      if (!Array.isArray(classes)) return

      const language = classes.find((d) => {
        return typeof d === 'string' && d.startsWith(prefix)
      })

      if (typeof language !== 'string') return

      const scope = starryNight.flagToScope(language.slice(prefix.length))

      if (scope == null) return

      const fragment = starryNight.highlight(toString(head), scope)
      const children = fragment.children as Array<Hast.ElementContent>

      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'div',
        properties: {
          className: [
            'highlight',
            'highlight-' + scope.replace(/^source\./, '').replace(/\./g, '-'),
          ],
        },
        children: [{ type: 'element', tagName: 'pre', properties: {}, children }],
      })
    })
  }
}

export default withSyntaxHighlighting
