import type { CmsCollection } from 'netlify-cms-core'

/**
 * Pages collection.
 */
export const collection: CmsCollection = {
  name: 'pages',
  label: 'Pages',
  label_singular: 'Page',
  description: '',
  format: 'frontmatter',
  files: [
    {
      file: 'content/pages/home.mdx',
      name: 'home',
      label: 'Home page',
      fields: [
        {
          name: 'title',
          label: 'Title',
          hint: '',
        },
        {
          name: 'subtitle',
          label: 'Subtitle',
          hint: '',
        },
        {
          name: 'body',
          label: 'Content',
          hint: '',
          widget: 'markdown',
        },
      ],
    },
  ],
}
