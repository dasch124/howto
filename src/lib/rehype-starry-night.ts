/**
 * @see https://github.com/wooorm/starry-night#example-integrate-with-unified-remark-and-rehype
 */

import type { Grammar } from '@wooorm/starry-night'
import { common, createStarryNight } from '@wooorm/starry-night'
import type * as Hast from 'hast'
import { toString } from 'hast-util-to-string'
import * as json5 from 'json5'
import parseNumericRange from 'parse-numeric-range'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

interface ParsedCodeBlockMeta {
  title?: string
  highlight?: string
}

function parseMetaAsJson5(node: Hast.Element): ParsedCodeBlockMeta | undefined {
  const meta = node.data?.['meta']
  if (typeof meta !== 'string') return undefined
  if (meta.length === 0) return undefined

  try {
    return json5.parse(meta)
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
  /**
   * Parse code block meta, uses `json5` by default.
   */
  parseMeta?: (node: Hast.Element) => ParsedCodeBlockMeta | undefined
  onVisitCodeBlock?: (node: Hast.Element, meta: ParsedCodeBlockMeta) => void
  onVisitLine?: (node: Hast.Element, meta: ParsedCodeBlockMeta) => void
  onVisitHighlightedLine?: (node: Hast.Element, meta: ParsedCodeBlockMeta) => void
}

/**
 * Plugin to highlight code with `starry-night`.
 */
const withSyntaxHighlighting: Plugin<[Options?], Hast.Root> = function withSyntaxHighlighting(
  options = {},
) {
  const {
    grammars = common,
    onVisitCodeBlock,
    onVisitHighlightedLine,
    onVisitLine,
    parseMeta = parseMetaAsJson5,
  } = options
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
      const grammar = scope.replace(/^source\./, '').replace(/\./g, '-')
      const meta = parseMeta(node) ?? {}
      const title = meta.title
      const highlighted = meta.highlight != null ? parseNumericRange(meta.highlight) : []

      children.forEach((line) => {
        if (line.type !== 'element') return
        onVisitLine?.(line, meta)
      })

      highlighted.forEach((lineNumber) => {
        if (lineNumber < 1 || lineNumber > children.length) return
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const line = children.at(lineNumber - 1)!
        if (line.type !== 'element') return
        line.properties = line.properties ?? {}
        if (!Array.isArray(line.properties['className'])) {
          line.properties['className'] = []
        }
        line.properties['className'].push('pl-highlighted')
        onVisitHighlightedLine?.(line, meta)
      })

      const properties = {
        className: ['highlight', 'highlight-' + grammar],
        dataLanguage: grammar,
        dataTitle: title,
      }
      const codeblock: Hast.Element = {
        type: 'element',
        tagName: 'div',
        properties,
        children: [{ type: 'element', tagName: 'pre', properties: {}, children }],
      }
      onVisitCodeBlock?.(codeblock, meta)

      parent.children.splice(index, 1, codeblock)
    })
  }
}

export default withSyntaxHighlighting
