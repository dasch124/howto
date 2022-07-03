import type { Dictionary } from '@/app/i18n/common'

export const dictionary: Dictionary = {
  home: {
    metadata: {
      title: 'Startseite',
    },
    hero: {
      title:
        '<PrimaryAccent>Teilen</PrimaryAccent> und <PrimaryAccent>erweitern</PrimaryAccent> Sie Ihr Wissen im Bereich <SecondaryAccent>Digital Humanities</SecondaryAccent>',
      text: 'Willkommen bei den ACDH-CH Lernressourcen. Hier finden Sie interaktives Lernmaterial, praktische HowTo-Artikel und Best Practices Beispiele zu einem breiten Spektrum von Themen, Methoden und Infrastrukturen aus den Digital Humanities. Diese Ressourcen können sowohl für das selbstgesteuerte Lernen als auch für die Lehre im Hochschulbereich genutzt werden. Es ist Teil unserer Mission, Wissen aus der laufenden Forschung aktiv in die breitere Digital Humanities Community zu transferieren und damit eine neue Generation von Geisteswissenschaftlern in der Nutzung von digitalen Methoden auszubilden.',
    },
  },
  '404': {
    metadata: {
      title: 'Seite nicht gefunden',
    },
  },
  '500': {
    metadata: {
      title: 'Interner Fehler',
    },
  },
  imprint: {
    metadata: {
      title: 'Impressum',
    },
  },
  posts: {
    metadata: {
      title: 'Posts',
    },
    'no-posts': 'Noch keine Posts.',
    'all-posts': 'Alle Posts',
    'new-posts': 'Neue Posts',
  },
  post: {
    metadata: {
      title: 'Post',
    },
    author: {
      one: 'Autor:in',
      other: 'Autor:innen',
    },
    tag: {
      one: 'Tag',
      other: 'Tags',
    },
    'permalink-to': 'Permalink zu',
    'footnote-back-to-content': 'Zurück zum Inhalt',
    footnotes: 'Anmerkungen',
    'reading-time': 'Lesedauer',
    minute: {
      one: '{{time}} Minute',
      other: '{{time}} Minuten',
    },
    'table-of-contents': 'Inhaltsverzeichnis',
    'last-updated': 'Zuletzt aktualisiert am {{date}}',
    'edit-post-in-cms': 'Post editieren',
    'related-posts': 'Ähnliche Posts',
  },
  cms: {
    metadata: {
      title: 'CMS',
    },
  },
  loading: 'Laden...',
  'skip-to-main-content': 'Zum Hauptinhalt springen',
  'change-language-to': 'Sprache ändern auf {{language}}',
  language: {
    de: 'Deutsch',
    en: 'Englisch',
  },
  search: 'Suchen',
  'search-help-text': 'Bitte Suchbegriff eingeben',
  'no-search-results': 'Nichts gefunden',
  'search-request-error': 'Fehler beim Holen der Suchergebnisse',
  'search-results-count': {
    zero: 'Kein Treffer',
    one: 'Ein Treffer',
    other: '{{count}} Treffer',
  },
  'read-more': 'Weiterlesen',
  'rss-feed': 'RSS Feed',
  'next-page': 'Nächste Seite',
  'previous-page': 'Vorherige Seite',
  'posts-pages': 'Posts Seiten',
}
