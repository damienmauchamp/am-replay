import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Nav } from '@/components/Nav/Nav'
import { Home } from '@/components/Home/Home'
import MusicKitProvider from '@/components/Providers/MusicKitProvider'
import { logDebug } from '@/helpers/debug'
import {
	MusicKitContextProvider,
	useMusicKitContext,
} from '@/context/MusicKitContext'

const log = (...args: any) => {
	logDebug('index', 'cyan', ...args)
}

// todo : Error wrap si erreur de chargement du musicKit
const Landing: NextPage<{}> = () => {
	// const [loading, setLoading] = useState<boolean>(false)
	// const { musicKit, setMusicKit } = useMusicKitContext()
	const { logged } = useMusicKitContext()

	useEffect(() => {
		log('(useEffect) mounted')
	}, [])
	useEffect(() => {
		log('(useEffect) updated')
	})

	return (
		<MusicKitContextProvider>
			<>
				<header>
					<Nav />
				</header>

				<main className={`flex flex-col items-center p-4`}>
					<div>Index.logged: {Number(logged)}</div>
					<Home />
				</main>
			</>
		</MusicKitContextProvider>
	)
}

export default Landing
