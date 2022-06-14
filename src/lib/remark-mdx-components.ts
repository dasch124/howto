import type * as Mdast from 'mdast'
import type { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx'
import assert from 'node:assert'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

import { isDefined } from '@/lib/is-defined'

const withComponents: Plugin<[], Mdast.Root> = function withComponents() {
  return function transformer(tree) {
    visit(tree, ['mdxJsxFlowElement', 'mdxJsxTextElement'], (node) => {
      assert(node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement')

      switch (node.name) {
        // TODO: we could just render the `<a>` directly and replace the `<Download>` node.
        case 'Download': {
          const href = getAttribute(node, 'href')

          if (typeof href?.value === 'string') {
            node.attributes = []
            node.children = [
              {
                type: 'link',
                url: href.value,
                // @ts-expect-error Assume phrasing content.
                children: node.children,
              },
            ]
          }

          break
        }

        // TODO: we could just render the `<figure>` directly and replace the `<Figure>` node (i.e. change the node `name`).
        case 'Figure': {
          const src = getAttribute(node, 'src')
          const alt = getAttribute(node, 'alt')
          const title = getAttribute(node, 'title')

          if (typeof src?.value === 'string') {
            // node.name = 'figure'
            node.attributes = []
            node.children = [
              {
                type: 'image',
                url: src.value,
                alt: typeof alt?.value === 'string' ? alt.value : undefined,
                title: typeof title?.value === 'string' ? title.value : undefined,
              },
              {
                type: 'mdxJsxFlowElement',
                name: 'figcaption',
                attributes: [],
                // @ts-expect-error Assume block content.
                children: node.children,
              },
            ]
          }
          break
        }

        case 'Quiz': {
          break
        }

        case 'SideNote': {
          break
        }

        case 'Tabs': {
          // @ts-expect-error Assume block content.
          const tabs = node.children.filter((child): child is MdxJsxFlowElement => {
            return child.type === 'mdxJsxFlowElement' && child.name === 'Tabs.Tab'
          }) as Array<MdxJsxFlowElement>

          const titles = tabs
            .map((tab) => {
              return getAttribute(tab, 'title')
            })
            .filter(isDefined)

          const panels = tabs.map((tab) => {
            return tab.children
          })

          node.children = [
            {
              type: 'mdxJsxFlowElement',
              name: 'Tabs.List',
              attributes: [],
              // @ts-expect-error Assume block content.
              children: titles.map((title) => {
                return {
                  type: 'mdxJsxFlowElement',
                  name: 'Tabs.Tab',
                  attributes: [],
                  children: [
                    {
                      type: 'text',
                      value: title.value,
                    },
                  ],
                }
              }),
            },
            {
              type: 'mdxJsxFlowElement',
              name: 'Tabs.Panels',
              attributes: [],
              children: panels.map((panel) => {
                return {
                  type: 'mdxJsxFlowElement',
                  name: 'Tabs.Panel',
                  attributes: [],
                  children: panel,
                }
              }),
            },
          ]

          break
        }

        case 'Video': {
          break
        }

        default:
      }
    })
  }
}

export default withComponents

function getAttribute(node: MdxJsxFlowElement | MdxJsxTextElement, name: string) {
  return node.attributes.find((attribute): attribute is MdxJsxAttribute => {
    return attribute.type === 'mdxJsxAttribute' && attribute.name === name
  })
}
