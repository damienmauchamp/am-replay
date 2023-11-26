import React, { ReactNode, useEffect, useState } from 'react'
import { logDebug } from '@/helpers/debug'

const log = (...args: any) => {
	logDebug('MusicKitProvider', '#dc638b', ...args)
}

interface MusicKitProviderProps {
	children: ReactNode
}

export default function MusicKitProvider(props: MusicKitProviderProps) {
	const [ready, setReady] = useState<boolean>(false)

	useEffect(() => {
		// log('(useEffect)')

		// setTimeout(() => {
		log('(useEffect) MusicKit:', MusicKit || 'nope')
		setReady(true)
		// }, 1000)
	}, [])

	return <>{ready ? props.children : '<MusicKitProvider.Loader>'}</>
}
