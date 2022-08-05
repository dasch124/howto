/**
 * @see https://github.com/wooorm/starry-night#example-integrate-with-unified-remark-and-rehype
 */

import type { Grammar } from '@wooorm/starry-night'
import { common, createStarryNight } from '@wooorm/starry-night'
import type * as Hast from 'hast'
import { toString } from 'hast-util-to-string'
import { h } from 'hastscript'
import json5 from 'json5'
import parseNumericRange from 'parse-numeric-range'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

interface ParsedCodeBlockMeta extends Record<string, unknown> {
  highlight?: string
  title?: string
}

function parseMetaAsJson5(node: Hast.Element): ParsedCodeBlockMeta | undefined {
  const meta = node.data?.['meta']
  if (typeof meta !== 'string') return undefined
  if (meta.length === 0) return undefined

  try {
    // eslint-disable-next-line import/no-named-as-default-member
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
  onVisitCodeBlock?: (node: Hast.Element, meta: ParsedCodeBlockMeta, code: string) => void
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

  return async function transformer(tree) {
    const starryNight = await starryNightPromise

    visit(tree, 'element', function (node, index, parent) {
      if (parent == null || index == null || node.tagName !== 'pre') return

      const head = node.children[0]

      if (!head || head.type !== 'element' || head.tagName !== 'code' || !head.properties) return

      const classes = head.properties['className']

      if (!Array.isArray(classes)) return

      const language = classes.find((d) => {
        return typeof d === 'string' && d.startsWith(prefix)
      })

      if (typeof language !== 'string') return

      const scope = starryNight.flagToScope(language.slice(prefix.length))

      if (scope == null) return

      const code = toString(head)
      const fragment = starryNight.highlight(code, scope)
      const children = fragment.children as Array<Hast.ElementContent>
      const grammar = scope.replace(/^source\./, '').replace(/\./g, '-')
      const meta = parseMeta(head) ?? {}
      const title = meta.title
      const highlighted = meta.highlight != null ? parseNumericRange(meta.highlight) : []

      const lines = children.filter((child): child is Hast.Element => {
        return child.type === 'element'
      })

      lines.forEach((line) => {
        onVisitLine?.(line, meta)
      })

      highlighted.forEach((lineNumber) => {
        if (lineNumber < 1 || lineNumber > lines.length) return
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const line = lines.at(lineNumber - 1)!
        line.properties = line.properties ?? {}
        line.properties['dataHighlight'] = ''
        onVisitHighlightedLine?.(line, meta)
      })

      const codeblock: Hast.Element = h(
        'div',
        {
          className: ['highlight', 'highlight-' + grammar],
          dataLanguage: grammar,
          dataTitle: title,
        },
        h('pre', {}, h('code', {}, children)),
      )
      onVisitCodeBlock?.(
        codeblock,
        meta,
        // TODO: should this use `hast-util-to-text` instead?
        code,
      )

      parent.children.splice(index, 1, codeblock)
    })
  }
}

export default withSyntaxHighlighting
