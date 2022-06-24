/** @typedef {import('tailwindcss').Config} TailwindConfig */

/** @type {TailwindConfig} */
const config = {
  content: ['./src/**/*.@(css|tsx)'],
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
  plugins: [
    require('@tailwindcss/forms'),
    // @ts-expect-error Missing module declaration.
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss'),
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        'muted-background': 'var(--color-muted-background)',
        border: 'var(--color-border)',
        'accent-primary-background': 'var(--color-accent-primary-background)',
        'accent-primary-text': 'var(--color-accent-primary-text)',
        'accent-secondary-background': 'var(--color-accent-secondary-background)',
        'accent-secondary-text': 'var(--color-accent-secondary-text)',
        'heading-text': 'var(--color-heading-text)',
        text: 'var(--color-text)',
        'muted-text': 'var(--color-muted-text)',
        'highlighted-text': 'var(--color-highlighted-text)',
        'text-inverted': 'var(--color-text-inverted)',
      },
      gridTemplateColumns: {
        prose: 'var(--grid-columns-prose)',
      },
      zIndex: {
        dialog: 'var(--z-dialog)',
      },
      /** @type {({ theme }: { theme: (token: string) => string}) => unknown} */
      typography: ({ theme }) => {
        return {
          DEFAULT: {
            css: {
              '--tw-prose-body': theme('colors.text'),
              '--tw-prose-headings': theme('colors.heading-text'),
              '--tw-prose-lead': theme('colors.text'),
              '--tw-prose-links': theme('colors.accent-primary-text'),
              '--tw-prose-bold': theme('colors.text'),
              '--tw-prose-counters': theme('colors.muted-text'),
              '--tw-prose-bullets': theme('colors.muted-text'),
              '--tw-prose-hr': theme('colors.border'),
              '--tw-prose-quotes': theme('colors.text'),
              '--tw-prose-quote-borders': theme('colors.border'),
              '--tw-prose-captions': theme('colors.muted-text'),
              '--tw-prose-code': theme('colors.text'),
              // '--tw-prose-pre-code': theme('colors.text'),
              // '--tw-prose-pre-bg': theme('colors.text'),
              '--tw-prose-th-borders': theme('colors.border'),
              '--tw-prose-td-borders': theme('colors.border'),

              // '--tw-prose-body': theme('colors.gray[700]'),
              // '--tw-prose-headings': theme('colors.gray[900]'),
              // '--tw-prose-lead': theme('colors.gray[600]'),
              // '--tw-prose-links': theme('colors.gray[900]'),
              // '--tw-prose-bold': theme('colors.gray[900]'),
              // '--tw-prose-counters': theme('colors.gray[500]'),
              // '--tw-prose-bullets': theme('colors.gray[300]'),
              // '--tw-prose-hr': theme('colors.gray[200]'),
              // '--tw-prose-quotes': theme('colors.gray[900]'),
              // '--tw-prose-quote-borders': theme('colors.gray[200]'),
              // '--tw-prose-captions': theme('colors.gray[500]'),
              // '--tw-prose-code': theme('colors.gray[900]'),
              '--tw-prose-pre-code': theme('colors.gray[200]'),
              '--tw-prose-pre-bg': theme('colors.gray[800]'),
              // '--tw-prose-th-borders': theme('colors.gray[300]'),
              // '--tw-prose-td-borders': theme('colors.gray[200]'),

              maxWidth: 'none',

              '[data-permalink]': {
                position: 'relative',
              },
              '[data-permalink] > a': {
                position: 'absolute',
                transform: 'translateX(-1.5rem)',
                opacity: 0,
              },
              '[data-permalink]:hover > a': {
                opacity: 1,
              },
              '[data-permalink] > a:focus-visible': {
                opacity: 1,
              },
              ':first-child[data-permalink] > :where(h1, h2, h3, h4, h5, h6)': {
                marginBlockStart: 0,
              },
              '.footnotes': {
                fontSize: theme('fontSize.lg')[0],
              },
            },
          },
        }
      },
    },
  },
}

module.exports = config
