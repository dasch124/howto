/** @typedef {import('tailwindcss').Config} TailwindConfig */

/** @type {TailwindConfig} */
const config = {
  content: ['./(src|stories)/**/*.@(css|tsx)'],
  corePlugins: {
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
    textOpacity: false,
  },
  plugins: [
    // @ts-expect-error Missing module declaration.
    require('@tailwindcss/forms'),
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
        'informative-text': 'var(--color-informative-text)',
        'informative-background': 'var(--color-informative-background)',
        'notice-text': 'var(--color-notice-text)',
        'notice-background': 'var(--color-notice-background)',
        'positive-text': 'var(--color-positive-text)',
        'positive-background': 'var(--color-positive-background)',
        'negative-text': 'var(--color-negative-text)',
        'negative-background': 'var(--color-negative-background)',
      },
      gridTemplateColumns: {
        page: 'var(--grid-columns-page)',
        prose: 'var(--grid-columns-prose)',
      },
      zIndex: {
        dialog: 'var(--z-dialog)',
      },
    },
  },
}

module.exports = config
