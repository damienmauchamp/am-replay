import React, { ReactNode, useEffect, useState } from 'react'

const log = (...args: any) => {
	console.log('%c[MusicKitProvider]', 'color:#dc638b', ...args)
}

interface MusicKitProviderProps {
	children: ReactNode
}

export default function MusicKitProvider(props: MusicKitProviderProps) {
	const [ready, setReady] = useState<boolean>(false)

	console.log('MusicKitProvider')

	useEffect(() => {
		log('(useEffect)')

		setTimeout(() => {
			console.log('OOOOOOOOOOOOOOOO=>', MusicKit || 'nope')
			setReady(true)
		}, 1000)
	}, [])

	return (
		<>
			<div>MusicKitProvider</div>
			{ready ? props.children : '<MusicKitProvider.Loader>'}
		</>
	)
}
