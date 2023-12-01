'use client'
import React, { ReactNode, useEffect, useState } from 'react'
import { logDebug } from '@/helpers/debug'
import { type } from 'os'
import { useMusicKitContext } from '@/context/MusicKitContext'
import MusicProvider from '@/core/MusicKitProvider'

const log = (...args: any) => {
	logDebug('MusicKitProvider', '#dc638b', ...args)
}

interface MusicKitProviderProps {
	children: ReactNode
}

export default function MusicKitProvider(props: MusicKitProviderProps) {
	const { musicKit, setMusicKit } = useMusicKitContext()
	const [ready, setReady] = useState<boolean>(false)

	log('MusicKitProvider')

	const loadMusicKit = () => {
		log('(loadMusicKit)')

		let musicProvider = MusicProvider.sharedProvider()
		log('(loadMusicKit) musicProvider:', musicProvider)

		musicProvider.configure()
		log(
			'(loadMusicKit) musicProvider.getMusicInstance():',
			musicProvider.getMusicInstance()
		)

		setMusicKit(musicProvider.getMusicInstance())
	}

	const waitTillReady = (n: number = 0): any => {
		const error = typeof MusicKit === 'undefined'

		log('(waitTillReady)', n, error, typeof MusicKit, MusicKit)

		if (n > 5 && error) {
			throw new Error("Can't load MusicKit")
		}

		if (!error) {
			setReady(true)
			loadMusicKit()
			return true
		}

		return setTimeout(() => {
			return waitTillReady(n + 1)
		}, 500)
	}

	// useEffect(() => {
	// 	log(
	// 		'(useEffect) MusicKit:',
	// 		typeof MusicKit === 'undefined' ? MusicKit : undefined
	// 	)
	// })

	useEffect(() => {
		log('(useEffect[]) Mounted')
		log(
			'(useEffect[]) MusicKit:',
			typeof MusicKit === 'undefined' ? MusicKit : undefined
		)
		waitTillReady()
		// }, [])
	}, [])

	return <>{ready ? props.children : '<MusicKitProvider.Loader>'}</>
}
