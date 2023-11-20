import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import MusicProvider from '@/core/MusicKitProvider';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js" defer></script>
      </body>
    </Html>
  )
}
