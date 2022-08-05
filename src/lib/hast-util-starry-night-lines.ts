import type * as Hast from 'hast'

/**
 * @see https://github.com/wooorm/starry-night#example-adding-line-numbers
 */
export default function withStarryNightLines(tree: Hast.Root) {
  const replacement: Array<Hast.RootContent> = []
  const search = /\r?\n|\r/g
  let index = -1
  let start = 0
  let startTextRemainder = ''
  let lineNumber = 0

  while (++index < tree.children.length) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const child = tree.children[index]!

    if (child.type === 'text') {
      let textStart = 0
      let match = search.exec(child.value)

      while (match) {
        const line = tree.children.slice(start, index) as Array<Hast.ElementContent>

        if (startTextRemainder) {
          line.unshift({ type: 'text', value: startTextRemainder })
          startTextRemainder = ''
        }

        if (match.index > textStart) {
          line.push({
            type: 'text',
            value: child.value.slice(textStart, match.index),
          })
        }

        lineNumber += 1
        replacement.push(createLine(line, lineNumber), {
          type: 'text',
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          value: match[0]!,
        })

        start = index + 1
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        textStart = match.index + match[0]!.length
        match = search.exec(child.value)
      }

      if (start === index + 1) {
        startTextRemainder = child.value.slice(textStart)
      }
    }
  }

  const line = tree.children.slice(start) as Array<Hast.ElementContent>
  if (startTextRemainder) {
    line.unshift({ type: 'text', value: startTextRemainder })
    startTextRemainder = ''
  }

  if (line.length > 0) {
    lineNumber += 1
    replacement.push(createLine(line, lineNumber))
  }

  tree.children = replacement

  return tree
}

function createLine(children: Array<Hast.ElementContent>, line: number): Hast.Element {
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: ['pl-line'], dataLineNumber: line },
    children,
  }
}
