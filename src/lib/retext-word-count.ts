import type * as Nlcst from 'nlcst'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

const wordsPerMinute = 265

/**
 * Plugin to count paragraphs, sentences, and words, and calculate average reading time in minutes.
 */
const withWordCount: Plugin<[], Nlcst.Root> = function withWordCount() {
  return function transformer(tree, vfile) {
    const counts = { paragraphs: 0, sentences: 0, words: 0 }

    visit(tree, function onNode(node) {
      switch (node.type) {
        case 'ParagraphNode':
          counts.paragraphs++
          break
        case 'SentenceNode':
          counts.sentences++
          break
        case 'WordNode':
          counts.words++
          break
        default:
      }
    })

    vfile.data['counts'] = counts
    vfile.data['readingTime'] = Math.ceil(counts.words / wordsPerMinute)
  }
}

export default withWordCount

declare module 'vfile' {
  interface DataMap {
    counts: {
      paragraphs: number
      sentences: number
      words: number
    }
    /** Reading time in minutes. */
    readingTime: number
  }
}
