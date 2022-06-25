import type { Dictionary } from '@/app/i18n/common'

export const dictionary: Dictionary = {
  home: {
    metadata: {
      title: 'Home',
    },
    hero: {
      title:
        '<PrimaryAccent>Share</PrimaryAccent> and <PrimaryAccent>expand</PrimaryAccent> your knowledge in <SecondaryAccent>Digital Humanities</SecondaryAccent>',
      text: 'Welcome to ACDH-CH Learning Resources. This living space gathers interactive learning material, practical HowTo articles and best practices on a wide range of Digital Humanities topics, methodologies and infrastructures. These resources can be used for self-guided learning as well as for teaching in higher education. It is part of our mission to actively transfer knowledge from ongoing research into the wider Digital Humanities Community as well as to educate a new generation of humanities researchers with digital methods.',
    },
  },
  '404': {
    metadata: {
      title: 'Page not found',
    },
  },
  '500': {
    metadata: {
      title: 'Unexpected error',
    },
  },
  imprint: {
    metadata: {
      title: 'Imprint',
    },
  },
  posts: {
    metadata: {
      title: 'Posts',
    },
    'no-posts': 'Nothing to see',
    'all-posts': 'All posts',
    'new-posts': 'New posts',
  },
  post: {
    metadata: {
      title: 'Post',
    },
    author: {
      one: 'Author',
      other: 'Authors',
    },
    tag: {
      one: 'Tag',
      other: 'Tags',
    },
    'permalink-to': 'Permalink to',
    'footnote-back-to-content': 'Back to content',
    footnotes: 'Footnotes',
    'reading-time': 'Reading time',
    minute: {
      one: '{{time}} minute',
      other: '{{time}} minutes',
    },
    'last-updated': 'Last updated on {{date}}',
    'edit-post-in-cms': 'Edit this post',
    'related-posts': 'Related posts',
  },
  cms: {
    metadata: {
      title: 'CMS',
    },
  },
  loading: 'Loading...',
  'skip-to-main-content': 'Skip to main content',
  'change-language-to': 'Change language to {{language}}',
  language: {
    de: 'German',
    en: 'English',
  },
  search: 'Search',
  'search-help-text': 'Please enter search term',
  'no-search-results': 'Nothing found',
  'search-results-count': {
    zero: 'No match',
    one: 'One match',
    other: '{{count}} matches',
  },
  'read-more': 'Read more',
  'rss-feed': 'RSS Feed',
  'next-page': 'Next page',
  'previous-page': 'Previous page',
  'posts-pages': 'Posts pages',
}
