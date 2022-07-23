import type { EditorComponentOptions } from 'netlify-cms-core'

export const DisclosureEditorWidget: EditorComponentOptions = {
  id: 'Disclosure',
  label: 'Disclosure',
  fields: [
    { name: 'title', label: 'Title', widget: 'string' },
    {
      name: 'children',
      label: 'Content',
      widget: 'markdown',
      // @ts-expect-error Missing in upstream types.
      editor_components: ['image', 'code-block', 'Figure', 'Tabs'],
      // modes: ['raw'],
    },
  ],
  pattern: /^<Disclosure(.*?)>\n([^]*?)\n<\/Disclosure>/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const title = /title="([^"]*)"/.exec(attrs)

    return {
      title: title ? title[1] : undefined,
      children: match[2],
    }
  },
  toBlock(data) {
    let attrs = ''

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.title) attrs += ` title="${data.title}"`

    return `<Disclosure${attrs}>
${data.children ?? ''}
</Disclosure>`
  },
  toPreview() {
    return `Disclosure`
  },
}
