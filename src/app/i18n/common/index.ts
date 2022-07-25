import type { Plurals } from '@/app/i18n/dictionaries'
import type { Locale } from '~/config/i18n.config'

export interface Dictionary {
  '404': {
    metadata: {
      title: string
    }
  }
  '500': {
    metadata: {
      title: string
    }
  }
  cms: {
    metadata: {
      title: string
    }
  }
  home: {
    metadata: {
      title: string
    }
    hero: {
      title: string
      text: string
    }
  }
  imprint: {
    metadata: {
      title: string
    }
  }
  post: {
    metadata: {
      title: string
    }
    author: Plurals
    tag: Plurals
    'permalink-to': string
    'footnote-back-to-content': string
    footnotes: string
    'reading-time': string
    minute: Plurals
    'table-of-contents': string
    'last-updated': string
    'edit-post-in-cms': string
    'related-posts': string
    'share-on-twitter': string
    'show-fullsize-image': string
    code: {
      'copy-to-clipboard': string
      'copied-to-clipboard': string
    }
    quiz: {
      previous: string
      next: string
      validate: string
      correct: string
      incorrect: string
    }
  }
  posts: {
    metadata: {
      title: string
    }
    'no-posts': string
    'all-posts': string
    'new-posts': string
  }
  'skip-to-main-content': string
  loading: string
  'change-language-to': string
  language: Record<Locale, string>
  search: string
  'search-help-text': string
  'no-search-results': string
  'search-request-error': string
  'search-results-count': Plurals
  'read-more': string
  'rss-feed': string
  'next-page': string
  'previous-page': string
  'posts-pages': string
  'toggle-color-scheme': string
}
