import { compile } from '@mdx-js/mdx'
import { isNonEmptyString } from '@stefanprobst/is-nonempty-string'
import withToc from '@stefanprobst/rehype-extract-toc'
import withHeadingFragmentLinks from '@stefanprobst/rehype-fragment-links'
import withListsWithAriaRole from '@stefanprobst/rehype-lists-with-aria-role'
import withNoReferrerLinks from '@stefanprobst/rehype-noreferrer-links'
import withNextImages from '@stefanprobst/remark-mdx-next-images'
import withSmartQuotes from '@stefanprobst/remark-smart-quotes'
import { common } from '@wooorm/starry-night'
import sparql from '@wooorm/starry-night/lang/source.sparql.js'
import turtle from '@wooorm/starry-night/lang/source.turtle.js'
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import type * as Hast from 'hast'
import { headingRank } from 'hast-util-heading-rank'
import { h } from 'hastscript'
import withHeadingIds from 'rehype-slug'
import withFrontmatter from 'remark-frontmatter'
import withGfm from 'remark-gfm'
import toNlcst from 'remark-retext'
import english from 'retext-english'
import latin from 'retext-latin'
import type { Plugin } from 'unified'
import { unified } from 'unified'
import type { Data } from 'vfile'
import { VFile } from 'vfile'
import { matter } from 'vfile-matter'

import type { Locale } from './config/i18n.config'
import { defaultLocale, locales } from './config/i18n.config'
import { createI18nService } from './src/app/i18n/create-i18n-service'
import { loadDictionaries } from './src/app/i18n/load-dictionaries'
import withSyntaxHighlighting from './src/lib/rehype-starry-night.js'
import withAssetDownloads from './src/lib/remark-asset-downloads'
import withComponents from './src/lib/remark-mdx-components'
import withWordCount from './src/lib/retext-word-count.js'

const Curriculum = defineDocumentType(() => {
  return {
    name: 'Curriculum',
    description: 'Curriculum',
    filePathPattern: `courses/**/*.mdx`,
    contentType: 'mdx',
    fields: {
      title: {
        description: 'Title',
        type: 'string',
        required: true,
      },
      shortTitle: {
        description: 'Short title',
        type: 'string',
        required: false,
      },
      lang: {
        description: 'Language',
        type: 'enum',
        required: true,
        options: locales,
        default: defaultLocale,
      },
      date: {
        description: 'Publication date',
        type: 'date',
        required: true,
      },
      version: {
        description: 'Version',
        type: 'string',
        required: true,
        default: '1.0.0',
      },
      editors: {
        description: 'Editors',
        type: 'list',
        required: false,
        of: Person,
      },
      tags: {
        description: 'Tags',
        type: 'list',
        required: true,
        of: Tag,
      },
      featuredImage: {
        description: 'Featured image',
        type: 'string',
        required: false,
      },
      abstract: {
        description: 'Abstract',
        type: 'string',
        required: true,
      },
      resources: {
        description: 'Posts',
        type: 'list',
        required: true,
        of: Post,
      },
      uuid: {
        description: 'UUID',
        type: 'string',
        required: true,
      },
    },
    computedFields: {
      code: {
        description: 'MDX JavaScript code',
        type: 'string',
        resolve(doc) {
          return doc['body'].code
        },
      },
      id: {
        description: 'Identifier',
        type: 'string',
        resolve(doc) {
          const fragments = doc._raw.flattenedPath.split('/')
          return fragments.at(-1)
        },
      },
      locale: {
        description: 'Locale',
        type: 'enum',
        options: locales,
        resolve(doc) {
          return doc['lang']
        },
      },
    },
  }
})

const Licence = defineDocumentType(() => {
  return {
    name: 'Licence',
    description: 'Licence',
    filePathPattern: `licences/**/*.yml`,
    contentType: 'data',
    fields: {
      name: {
        description: 'Name',
        type: 'string',
        required: true,
      },
      url: {
        description: 'URL',
        type: 'string',
        required: true,
      },
    },
    computedFields: {
      id: {
        description: 'Identifier',
        type: 'string',
        resolve(doc) {
          const fragments = doc._raw.flattenedPath.split('/')
          return fragments.at(-1)
        },
      },
    },
  }
})

const Person = defineDocumentType(() => {
  return {
    name: 'Person',
    description: 'Person',
    filePathPattern: `people/**/*.yml`,
    contentType: 'data',
    fields: {
      firstName: {
        description: 'First name',
        type: 'string',
        required: true,
      },
      lastName: {
        description: 'Last name',
        type: 'string',
        required: true,
      },
      title: {
        description: 'Title',
        type: 'string',
        required: false,
      },
      description: {
        description: 'Description',
        type: 'string',
        required: false,
      },
      avatar: {
        description: 'Image',
        type: 'string',
        required: false,
      },
      email: {
        description: 'Email',
        type: 'string',
        required: false,
      },
      twitter: {
        description: 'Twitter',
        type: 'string',
        required: false,
      },
      website: {
        description: 'Website',
        type: 'string',
        required: false,
      },
      orcid: {
        description: 'ORCID',
        type: 'string',
        required: false,
      },
    },
    computedFields: {
      id: {
        description: 'Identifier',
        type: 'string',
        resolve(doc) {
          const fragments = doc._raw.flattenedPath.split('/')
          return fragments.at(-1)
        },
      },
    },
  }
})

const Post = defineDocumentType(() => {
  return {
    name: 'Post',
    description: 'Post',
    filePathPattern: `posts/**/*.mdx`,
    contentType: 'mdx',
    fields: {
      title: {
        description: 'Title',
        type: 'string',
        required: true,
      },
      shortTitle: {
        description: 'Short title',
        type: 'string',
        required: false,
      },
      lang: {
        description: 'Language',
        type: 'enum',
        required: true,
        options: locales,
        default: defaultLocale,
      },
      date: {
        description: 'Publication date',
        type: 'date',
        required: true,
      },
      version: {
        description: 'Version',
        type: 'string',
        required: true,
        default: '1.0.0',
      },
      authors: {
        description: 'Authors',
        type: 'list',
        required: true,
        of: Person,
      },
      editors: {
        description: 'Editors',
        type: 'list',
        required: false,
        of: Person,
      },
      contributors: {
        description: 'Contributors',
        type: 'list',
        required: false,
        of: Person,
      },
      tags: {
        description: 'Tags',
        type: 'list',
        required: true,
        of: Tag,
      },
      featuredImage: {
        description: 'Featured image',
        type: 'string',
        required: false,
      },
      abstract: {
        description: 'Abstract',
        type: 'string',
        required: true,
      },
      licence: {
        description: 'Licence',
        type: 'string',
        required: true,
        of: Licence,
        default: 'ccby-4.0',
      },
      toc: {
        description: 'Table of contents',
        type: 'boolean',
        required: false,
        default: false,
      },
      uuid: {
        description: 'UUID',
        type: 'string',
        required: true,
      },
    },
    computedFields: {
      code: {
        description: 'MDX JavaScript code',
        type: 'string',
        resolve(doc) {
          return doc['body'].code
        },
      },
      featuredImage: {
        description: 'Featured image',
        type: 'string', // 'string | StaticImageData | undefined', // FIXME: how to re-use existing type here?
        resolve(doc) {
          return doc['body'].data['images']['featuredImage']
        },
      },
      id: {
        description: 'Identifier',
        type: 'string',
        resolve(doc) {
          const fragments = doc._raw.flattenedPath.split('/')
          return fragments.at(-1)
        },
      },
      locale: {
        description: 'Locale',
        type: 'enum',
        options: locales,
        resolve(doc) {
          return doc['lang']
        },
      },
      readingTime: {
        description: 'Reading time',
        type: 'number',
        resolve(doc) {
          return doc['body'].data['readingTime']
        },
      },
      toc: {
        description: 'Table of contents',
        type: 'list', // 'Toc', // FIXME: how to re-use existing type here?
        resolve(doc) {
          return doc['body'].data['toc']
        },
      },
    },
  }
})

const Tag = defineDocumentType(() => {
  return {
    name: 'Tag',
    description: 'Tag',
    filePathPattern: `tags/**/*.yml`,
    contentType: 'data',
    fields: {
      name: {
        description: 'Name',
        type: 'string',
        required: true,
      },
      description: {
        description: 'Description',
        type: 'string',
        required: true,
      },
    },
    computedFields: {
      id: {
        description: 'Identifier',
        type: 'string',
        resolve(doc) {
          const fragments = doc._raw.flattenedPath.split('/')
          return fragments.at(-1)
        },
      },
    },
  }
})

const TestPost = defineDocumentType(() => {
  return {
    ...Post.def(),
    name: 'TestPost',
    description: 'Test Posts for Storybook',
    filePathPattern: `test-posts/**/*.mdx`,
  }
})

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Curriculum, Licence, Person, Post, Tag, TestPost],
  async mdx(value, sourceFilePath) {
    const input = new VFile({ value, path: sourceFilePath })

    matter(input)

    const { locale = defaultLocale } = input.data['matter'] as { locale?: Locale }
    const dictionaries = await loadDictionaries(locale, ['common'])
    const { t } = createI18nService(locale, dictionaries)

    function createPermalink(headingElement: Hast.Element, id: string) {
      const permaLinkId = ['permalink', id].join('-')
      const ariaLabelledBy = [permaLinkId, id].join(' ')

      return [
        h('div', { dataPermalink: true, dataRank: headingRank(headingElement) }, [
          h('a', { ariaLabelledBy, href: '#' + id }, [
            h('span', { id: permaLinkId, hidden: true }, t(['common', 'post', 'permalink-to'])),
            h('span', '#'),
          ]),
          headingElement,
        ]),
      ]
    }

    const vfile = await compile(input, {
      outputFormat: 'function-body',
      remarkPlugins: [
        withFrontmatter,
        withGfm,
        [
          withSmartQuotes,
          locale === 'de'
            ? {
                openingQuotes: { double: '„', single: ',' },
                closingQuotes: { double: '”', single: '’' },
              }
            : undefined,
        ],
        [
          toNlcst as Plugin,
          unified()
            .use(locale === 'en' ? english : latin)
            .use(withWordCount),
        ],
        withComponents,
        [
          withNextImages,
          {
            publicDirectory: '/assets/images/static',
            name: 'img',
            images(data: Data) {
              const images: Array<{ key: string; filePath: string }> = []
              const matter = data['matter'] as Record<string, unknown> | undefined
              if (matter == null) return images
              const keys = ['featuredImage']
              keys.forEach((key) => {
                const filePath = matter[key]
                if (isNonEmptyString(filePath)) {
                  images.push({ key, filePath })
                }
              })
              return images
            },
          },
        ],
        [withAssetDownloads, { publicDirectory: '/assets/downloads/static' }],
      ],
      remarkRehypeOptions: {
        footnoteBackLabel: t(['common', 'post', 'footnote-back-to-content']),
        footnoteLabel: t(['common', 'post', 'footnotes']),
      },
      rehypePlugins: [
        withHeadingIds,
        [withHeadingFragmentLinks, { generate: createPermalink }],
        withToc,
        withNoReferrerLinks,
        withListsWithAriaRole,
        [
          withSyntaxHighlighting,
          {
            grammars: [...common, sparql, turtle],

          },
        ],
      ],
    })

    return { code: String(vfile), data: vfile.data }
  },
})
