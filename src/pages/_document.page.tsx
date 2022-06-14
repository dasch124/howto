import { InitialThemeScript } from '@stefanprobst/next-theme'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document(): JSX.Element {
  return (
    <Html>
      <Head>
        <link
          crossOrigin="anonymous"
          href="https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10..0,100..900&display=swap"
          rel="stylesheet"
        />
        {process.env['NEXT_PUBLIC_ALGOLIA_APP_ID'] != null ? (
          <link
            crossOrigin="anonymous"
            href={`https://${process.env['NEXT_PUBLIC_ALGOLIA_APP_ID']}-dsn.algolia.net/`}
            rel="preconnect"
          />
        ) : null}
        <InitialThemeScript />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
