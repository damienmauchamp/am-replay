import React, { useEffect, useState } from 'react'

const withMusicKit = <T extends object>(
	WrappedComponent: React.ComponentType<T>
) => {
	const WithMusicKitSub = (props: Omit<T, keyof WithMusicKitProps>) => {
		//
		const getMusicKitInstance = () =>
			typeof MusicKit !== 'undefined'
				? MusicKit.getInstance()
				: ({} as MusicKit.MusicKitInstance)

		const [mkInstance, setMkInstance] = useState<MusicKit.MusicKitInstance>(
			getMusicKitInstance()
		)
		const [authorized, setAuthorized] = useState<boolean>(
			mkInstance.isAuthorized || false
		)

		const check = ({
			authorizationStatus,
		}: {
			authorizationStatus: number
		}) => {
			console.log(
				`[CHECK ${WrappedComponent.name}] authorizationStatus:`,
				authorizationStatus
			)
			console.log(
				`[CHECK ${WrappedComponent.name}] getMusicKitInstance():`,
				getMusicKitInstance()
			)
			console.log(
				`[CHECK ${WrappedComponent.name}] mkInstance:`,
				mkInstance
			)
			console.log(
				`[CHECK ${WrappedComponent.name}] authorized:`,
				authorized
			)

			if (authorizationStatus === 0) {
				setAuthorized(false)
				return
			}

			setAuthorized(true)
		}

		//
		// const isAuthorized = (): boolean => mkInstance.isAuthorized
		const isAuthorized = (): boolean => mkInstance.isAuthorized

		//
		useEffect(() => {
			// Log data on component mount
			console.log(`Component ${WrappedComponent.name} mounted.`)

			// updating musicKit instance
			setMkInstance(getMusicKitInstance())

			//
			const handler = check as () => void
			mkInstance.addEventListener(
				MusicKit.Events.authorizationStatusDidChange,
				handler
			)

			return () => {
				// Log data on component unmount
				console.log(`Component ${WrappedComponent.name} unmounted.`)

				// Nettoyer les écouteurs d'événements lors du démontage du composant
				mkInstance.removeEventListener(
					MusicKit.Events.authorizationStatusDidChange,
					handler
				)
			}
		}, [])

		useEffect(() => {
			// Log data on component update
			console.log(`Component ${WrappedComponent.name} updated.`)
		})

		return (
			<WrappedComponent
				{...(props as T)}
				mk={mkInstance}
				isAuthorized={isAuthorized}
			/>
		)
	}

	return WithMusicKitSub
}

export default withMusicKit
