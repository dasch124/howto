import type { FitEnum } from 'sharp'

import type { Locale } from '~/config/i18n.config'

export interface AppMetadata {
  locale: Locale
  title: string
  shortTitle: string
  description: string
  logo: {
    href: string
    maskable: boolean
  }
  image: {
    href: string
    alt: string
    fit?: keyof FitEnum
  }
  twitter: {
    handle: string
  }
  creator?: {
    name: string
    shortName?: string
    affiliation?: string
    website: string
    address?: {
      street: string
      zip: string
      city: string
    }
    image?: {
      href: string
      alt: string
      fit?: keyof FitEnum
    }
    phone?: string
    email?: string
    twitter?: {
      handle: string
    }
  }
}

export const metadata: Record<Locale, AppMetadata> = {
  en: {
    locale: 'en',
    title: 'ACDH-CH Digital Humanities Learning Resources',
    shortTitle: 'ACDH-CH Digital Humanities Learning Resources',
    description: 'Share and expand your knowledge in Digital Humanities.',
    logo: {
      href: '/assets/images/logo.svg',
      maskable: false,
    },
    image: {
      href: '/assets/images/logo-with-text.svg',
      alt: '',
      fit: 'contain',
    },
    twitter: {
      handle: '@ACDH_OeAW',
    },
    creator: {
      name: 'Austrian Centre for Digital Humanities and Cultural Heritage',
      shortName: 'ACDH-CH',
      website: 'https://www.oeaw.ac.at/acdh',
    },
  },
  de: {
    locale: 'de',
    title: 'ACDH-CH Digital Humanities Lernressourcen',
    shortTitle: 'ACDH-CH Digital Humanities Lernressourcen',
    description: 'Teilen und erweitern Sie Ihr Wissen im Bereich Digital Humanities.',
    logo: {
      href: '/assets/images/logo.svg',
      maskable: false,
    },
    image: {
      href: '/assets/images/logo-with-text.svg',
      alt: '',
      fit: 'contain',
    },
    twitter: {
      handle: '@ACDH_OeAW',
    },
    creator: {
      name: 'Austrian Centre for Digital Humanities and Cultural Heritage',
      shortName: 'ACDH-CH',
      website: 'https://www.oeaw.ac.at/de/acdh',
    },
  },
}

export const manifestFileName = 'site.webmanifest'

export const openGraphImageName = 'image.webp'
