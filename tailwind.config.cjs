/** @typedef {import('tailwindcss').Config} TailwindConfig */

/** @type {TailwindConfig} */
const config = {
  content: ['./src/**/*.@(css|tsx)'],
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
      },
      gridTemplateColumns: {
        prose: 'var(--grid-columns-prose)',
      },
      zIndex: {
        dialog: 'var(--z-dialog)',
      },
    },
  },
}

module.exports = config
