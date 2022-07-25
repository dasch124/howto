## priority

- post preview
- mobile nav menu
- bundle size! avoid including cms.client
- code blocks: line highlights, line numbers, copy button, and ensure `<pre><code>` not just `<pre>`
- code block light theme
- post image (and lightbox) should have better `sizes` attribute
- Netlify CMS editor widget styles should not rely on browser default css
- permanent redirects /resource/posts/_ => /posts/_

---

- rss feed in de+en (currently links assumes both locales exist, but only "en" is generated)

- currently we have /resources/posts/page/1 as route

- should we server-side render, to better handle url<=>search mapping?

- i18n:

  - filter posts by locale
  - translations for author descriptions (bios)
  - translations for tag name+description

- terminology

  - should we say "Posts" or "Articles" or "Lessons"?
  - resource types (posts, events, curricula)

- content metadata dump for api

- svg imports: use `<use>` instead of heroicons/react (with `@stefanprobst/next-svg`)

- schema.org "publisher" on posts: should be the HowTo or the ACDH? (also should add
  "url"/"website")

- preload page header logo

- lazy load searchdialog (algolia client, Combobox, Dialog)

- disable debounce in search dialog?

- replace `ts-script` with `tsx`

- currently errors on npm install, because generate:search-index assumes generate:content-schema has
  already finished

- remark lint preset

## consider adding eslint-mdx

- https://github.com/mdx-js/eslint-mdx/issues/250#issuecomment-734137140
- https://github.com/mdx-js/eslint-mdx/issues/92#issuecomment-963847211

## search with typesense

- should each content type (posts, curricula) have their own typesense schema/collection? currently
  we have a single one, named in `~/config/search.config.ts`

## images optimization

- ensure we use `sizes` attribute on post images

## mdx

- consider supporting custom heading id syntax with `remark-custom-heading-id`

## breaking changes

- we removed image captions via title attribute => use `<Figure />`

# featured image

- do we need it?

# gitignore generated cms preview stylesheets

# vscode extensions

- unifiedjs.vscode-mdx

# extract

- consider using `hast-util-excerpt` or my own excerpt util to create abstracts?
