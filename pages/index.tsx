import { NextPage } from 'next'
import { Nav } from '@/components/Nav/Nav'
import { Home } from '@/components/Home/Home'
import { logDebug } from '@/helpers/debug'
import {
	MusicKitContextProvider,
	useMusicKitContext,
} from '@/context/MusicKitContext'
import TestsNavLinks from '@/components/Tests/TestsNavLinks'
import Head from 'next/head'

const log = (...args: any) => {
	logDebug('index', 'cyan', ...args)
}

// todo : Error wrap if error while loading musicKit
const Landing: NextPage<{}> = () => {
	const { logged } = useMusicKitContext()

	return (
		<MusicKitContextProvider>
			<>
				<Head>
					{/* Title */}
					<title>AMReplay</title>
					<meta property="og:title" content="AMReplay" key="title" />
				</Head>
				<header>
					<Nav />
				</header>

				<main className={`flex flex-col items-center p-4`}>
					<Home />
				</main>
				<footer>
					<TestsNavLinks />
				</footer>
			</>
		</MusicKitContextProvider>
	)
}

export default Landing
