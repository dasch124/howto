import type * as Mdast from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { Plugin } from 'unified'
import { SKIP, visit } from 'unist-util-visit'

export interface Chunk {
  title: string | null
  id: string | null
  depth: number
  content: Mdast.Root
}

const withChunks: Plugin<[], Mdast.Root> = function withChunks() {
  return function transformer(tree, file) {
    const chunks: Array<Chunk> = [
      {
        title: null,
        id: null,
        depth: 0,
        content: { type: 'root', children: [] },
      },
    ]

    visit(tree, function onNode(node) {
      if (node.type === 'root') return undefined

      if (node.type === 'heading') {
        const chunk: Chunk = {
          title: toString(node),
          id: node.data != null && 'id' in node.data ? (node.data['id'] as string) : null,
          depth: node.depth,
          content: { type: 'root', children: [] },
        }
        chunks.push(chunk)
      } else {
        const last = chunks[chunks.length - 1]
        if (last != null) {
          last.content.children.push(node)
        }
      }

      return SKIP
    })

    file.data['chunks'] = chunks
  }
}

export default withChunks

declare module 'vfile' {
  interface DataMap {
    chunks: Array<Chunk>
  }
}
