import type { Plurals } from '@/app/i18n/dictionaries'
import type { Locale } from '~/config/i18n.config'

export interface Dictionary {
  home: {
    metadata: {
      title: string
    }
    hero: {
      title: string
      text: string
    }
  }
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
  imprint: {
    metadata: {
      title: string
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
  }
  cms: {
    metadata: {
      title: string
    }
  }
  loading: string
  'skip-to-main-content': string
  'change-language-to': string
  language: Record<Locale, string>
  search: string
  'search-help-text': string
  'no-search-results': string
  'search-results-count': Plurals
  'read-more': string
  'rss-feed': string
  'next-page': string
  'previous-page': string
}
