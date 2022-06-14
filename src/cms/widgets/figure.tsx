import type { EditorComponentOptions } from 'netlify-cms-core'

export const FigureEditorWidget: EditorComponentOptions = {
  id: 'Figure',
  label: 'Figure',
  fields: [
    {
      name: 'src',
      label: 'Image',
      widget: 'image',
    },
    { name: 'alt', label: 'Image description (alt text)', widget: 'string' },
    {
      name: 'children',
      label: 'Caption',
      widget: 'markdown',
      // @ts-expect-error Missing in upstream types.
      editor_components: [],
      // modes: ['raw'],
    },
  ],
  pattern: /^<Figure(.*?)>\n([^]*?)\n<\/Figure>/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const src = /src="([^"]*)"/.exec(attrs)
    const alt = /alt="([^"]*)"/.exec(attrs)

    return {
      src: src ? src[1] : undefined,
      alt: alt ? alt[1] : undefined,
      children: match[2],
    }
  },
  toBlock(data) {
    let attrs = ''

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.src) attrs += ` src="${data.src}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.alt) attrs += ` alt="${data.alt}"`

    return `<Figure${attrs}>
${data.children ?? ''}
</Figure>`
  },
  toPreview() {
    return `Figure`
  },
}
