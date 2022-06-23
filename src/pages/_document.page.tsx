import { InitialThemeScript } from '@stefanprobst/next-theme'
import { Head, Html, Main, NextScript } from 'next/document'

import { typesenseHost, typesensePort, typesenseProtocol } from '~/config/search.config'

export default function Document(): JSX.Element {
  return (
    <Html>
      <Head>
        <link
          crossOrigin="anonymous"
          href="https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10..0,100..900&display=swap"
          rel="stylesheet"
        />
        {typesenseProtocol != null && typesenseHost != null && typesensePort != null ? (
          <link
            crossOrigin="anonymous"
            href={`${typesenseProtocol}://${typesenseHost}:${typesensePort}`}
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
