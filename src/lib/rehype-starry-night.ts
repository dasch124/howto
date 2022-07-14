/**
 * @see https://github.com/wooorm/starry-night#example-integrate-with-unified-remark-and-rehype
 */

import type { Grammar } from '@wooorm/starry-night'
import { common, createStarryNight } from '@wooorm/starry-night'
import type * as Hast from 'hast'
import { toString } from 'hast-util-to-string'
import { parse } from 'json5'
import parseNumericRange from 'parse-numeric-range'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

interface ParsedCodeBlockMeta {
  title?: string
  highlight?: string
}

function parseMeta(node: Hast.Element): ParsedCodeBlockMeta | undefined {
  const meta = node.data?.['meta']
  if (typeof meta !== 'string') return undefined
  if (meta.length === 0) return undefined

  try {
    return parse(meta)
  } catch {
    return undefined
  }
}

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
      const scopeName = scope.replace(/^source\./, '').replace(/\./g, '-')

      const meta = parseMeta(node) ?? {}
      const properties = {
        className: ['highlight', 'highlight-' + scopeName],
        dataLanguage: scopeName,
        dataTitle: meta.title,
      }
      if (meta.highlight != null) {
        const lines = parseNumericRange(meta.highlight)
        lines.forEach((line) => {
          if (line < 1 || line > children.length) return
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const child = children.at(line - 1)!
          if (child.type !== 'element') return
          child.properties = child.properties ?? {}
          if (!Array.isArray(child.properties['className'])) {
            child.properties['className'] = []
          }
          child.properties['className'].push('highlight-line')
        })
      }

      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'div',
        properties,
        children: [{ type: 'element', tagName: 'pre', properties: {}, children }],
      })
    })
  }
}

export default withSyntaxHighlighting
