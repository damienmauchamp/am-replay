import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import MusicProvider from '@/core/MusicKitProvider'
import { Nav } from '@/components/Nav/Nav'
import { Home } from '@/components/Home/Home'
import MusicKitProvider from '@/components/Providers/MusicKitProvider'
import DebugComponent from '@/components/Tests/DebugComponent'
import { logDebug } from '@/helpers/debug'

const log = (...args: any) => {
	logDebug('index', 'cyan', ...args)
}

// todo : Error wrap si erreur de chargement du musicKit
const Landing: NextPage<{}> = () => {
	const [loading, setLoading] = useState<boolean>(false)
	const [musicKit, setMusicKit] = useState<MusicKit.MusicKitInstance>(
		{} as MusicKit.MusicKitInstance
	)
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false)

	const loadMusicKit = () => {
		log('[loadMusicKit]')

		let musicProvider = MusicProvider.sharedProvider()
		log('[loadMusicKit] musicProvider:', musicProvider)

		musicProvider.configure()

		setMusicKit(musicProvider.getMusicInstance())
	}

	useEffect(() => {
		log('useEffect[musicKit?.isAuthorized]:', musicKit?.isAuthorized)

		loadMusicKit()
		setIsAuthorized(musicKit?.isAuthorized || false)
		// setLoop(false)
	}, [musicKit?.isAuthorized])

	const handleLogin = (mk: MusicKit.MusicKitInstance) => {
		log('(handleLogin) mk:', mk)

		setMusicKit(mk)
		setIsAuthorized(mk?.isAuthorized || false)
	}

	const handleLogout = (): MusicKit.MusicKitInstance => {
		log('(handleLogout)')

		if (!musicKit) {
			setIsAuthorized(false)
			return musicKit
		}

		musicKit.unauthorize()
		setMusicKit(musicKit)
		setIsAuthorized(false)
		// todo : handle reset ? Home not loading
		// resetPage()
		window.location.reload()

		return musicKit
	}

	return (
		<>
			<MusicKitProvider>
				<header>
					<Nav
						musicKit={musicKit}
						onLogin={handleLogin}
						onLogout={handleLogout}
					/>
				</header>

				<main className={`flex flex-col items-center p-4`}>
					<Home musicKit={musicKit} />

					<DebugComponent test={'OUIIII'} />
				</main>
			</MusicKitProvider>
		</>
	)
}

export default Landing
