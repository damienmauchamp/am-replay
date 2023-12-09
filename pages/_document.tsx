import { iOSTheme } from '@/tailwind.config'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="test" content="yooo" />
				<link rel="icon" href="/favicon.ico" />

				{/* PWA // todo : complete */}
				<meta
					name="theme-color"
					content={iOSTheme.color.white}
					media="(prefers-color-scheme: light)"
				/>
				<meta
					name="theme-color"
					content={iOSTheme.color.black}
					media="(prefers-color-scheme: dark)"
				/>
				<link rel="apple-touch-icon" href="/logo192.png" />
				<link rel="manifest" href="/manifest.json" />
			</Head>
			<body>
				<Main />
				<script
					src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
					defer
				></script>
				<NextScript />
			</body>
		</Html>
	)
}
