import React, { ReactNode, useEffect, useState } from 'react'
import { logDebug } from '@/helpers/debug'
import { type } from 'os'

const log = (...args: any) => {
	logDebug('MusicKitProvider', '#dc638b', ...args)
}

interface MusicKitProviderProps {
	children: ReactNode
}

export default function MusicKitProvider(props: MusicKitProviderProps) {
	const [ready, setReady] = useState<boolean>(false)

	const waitTillReady = (n: number = 0): any => {
		const error = typeof MusicKit === 'undefined'

		if (n > 5 && error) {
			throw new Error("Can't load MusicKit")
		}

		if (!error) {
			setReady(true)
			return true
		}

		return setTimeout(() => {
			return waitTillReady(n + 1)
		}, 500)
	}

	useEffect(() => {
		log(
			'(useEffect) MusicKit:',
			typeof MusicKit === 'undefined' ? MusicKit : undefined
		)
		waitTillReady()
	}, [])

	return <>{ready ? props.children : '<MusicKitProvider.Loader>'}</>
}
