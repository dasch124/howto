export const matomoBaseUrl = new URL(
  process.env['NEXT_PUBLIC_MATOMO_BASE_URL'] ?? 'https://matomo.acdh.oeaw.ac.at',
)
export const matomoId = process.env['NEXT_PUBLIC_MATOMO_ID']
