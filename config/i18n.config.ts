export const locales = ['en', 'de'] as const

export type Locales = typeof locales
export type Locale = Locales[number]

export const defaultLocale: Locale = 'en'
