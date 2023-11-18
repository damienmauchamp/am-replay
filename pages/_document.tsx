import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"></Script>
      </body>
    </Html>
  )
}
