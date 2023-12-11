import MusicProvider from '@/core/MusicKitProvider'
import {logDebug} from '@/helpers/debug'
import React, {
	createContext,
	ReactElement,
	useContext,
	useEffect,
	useState,
} from 'react'

const log = (...args: any) => {
	logDebug('MusicKitContext', 'orange', ...args)
}

interface MusicKitContextProviderProps {
	children?: ReactElement
}

interface MusicKitContextProps {
	logged: boolean
	updateLogin: Function
	getInstance: Function
	isAuthorized: Function
	musicKit: MusicKit.MusicKitInstance
	setMusicKit: React.Dispatch<React.SetStateAction<MusicKitInstance>>
	loading: boolean
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultMusicKit = {} as MusicKit.MusicKitInstance

const getInstance = () => {
	if (typeof window === 'undefined' || typeof MusicKit === 'undefined') {
		return defaultMusicKit
	}
	return MusicProvider.get()
}

const instanceIsLoaded = () => getInstance() !== defaultMusicKit

const isAuthorized = () => getInstance()?.isAuthorized || false

const defaultContext = {
	logged: false,
	updateLogin: () => {
	},
	getInstance: getInstance,
	isAuthorized: isAuthorized,
	//
	musicKit: defaultMusicKit,
	setMusicKit: (() => {
	}) as React.Dispatch<
		React.SetStateAction<MusicKitInstance>
	>,
	//
	loading: true,
	setLoading: (() => {
	}) as React.Dispatch<React.SetStateAction<boolean>>,
}

const MusicKitContext = createContext<MusicKitContextProps>(defaultContext as MusicKitContextProps)

export const MusicKitContextProvider = ({
											children,
											...props
										}: MusicKitContextProviderProps) => {
	const [logged, setLogged] = useState<boolean>(isAuthorized())
	const [musicKit, setMusicKit] =
		useState<MusicKit.MusicKitInstance>(defaultMusicKit)
	const [loading, setLoading] = useState<boolean>(true)

	const updateLogin = (testing: boolean = false) => {
		if (testing) {
			setLogged(!logged)
			return
		}

		setLogged(isAuthorized())
		setMusicKit(getInstance())
		setLoading(!instanceIsLoaded())
	}

	useEffect(() => {
		window.addEventListener('load', function () {
			log("WINDOW loaded! - setAuthorized:", isAuthorized())
			updateLogin()
		})

		updateLogin()
	}, [])

	return (
		<MusicKitContext.Provider
			value={{
				logged,
				updateLogin,
				getInstance,
				isAuthorized,
				musicKit,
				setMusicKit,
				loading,
				setLoading,
			}}
		>
			{children}
		</MusicKitContext.Provider>
	)
}

export const useMusicKitContext = () => useContext(MusicKitContext)
