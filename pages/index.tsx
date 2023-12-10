import { NextPage } from 'next'
import { Nav } from '@/components/Nav/Nav'
import { Home } from '@/components/Home/Home'
import { MusicKitContextProvider } from '@/context/MusicKitContext'
import TestsNavLinks from '@/components/Tests/TestsNavLinks'
import Head from 'next/head'

interface LandingProps {}

// todo : Error wrap if error while loading musicKit
const Landing: NextPage<LandingProps> = () => {
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
