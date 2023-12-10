import MusicProvider from '@/core/MusicKitProvider'
import { logDebug } from '@/helpers/debug'
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
}

const defaultMusicKit = {} as MusicKit.MusicKitInstance

const getInstance = () => {
	if (typeof window === 'undefined' || typeof MusicKit === 'undefined') {
		return defaultMusicKit
	}
	return MusicProvider.get()
}

const isAuthorized = () => getInstance()?.isAuthorized || false

const defaultContext = {
	logged: false,
	updateLogin: () => {},
	getInstance: getInstance,
	isAuthorized: isAuthorized,
	musicKit: defaultMusicKit,
	setMusicKit: (() => {}) as React.Dispatch<
		React.SetStateAction<MusicKitInstance>
	>,
}

const MusicKitContext = createContext<MusicKitContextProps>(defaultContext)

export const MusicKitContextProvider = ({
	children,
	...props
}: MusicKitContextProviderProps) => {
	const [logged, setLogged] = useState<boolean>(isAuthorized())
	const [musicKit, setMusicKit] =
		useState<MusicKit.MusicKitInstance>(defaultMusicKit)

	const updateLogin = (testing: boolean = false) => {
		if (testing) {
			setLogged(!logged)
			return
		}
		setLogged(isAuthorized())
	}

	return (
		<MusicKitContext.Provider
			value={{
				logged,
				updateLogin,
				getInstance,
				isAuthorized,
				musicKit,
				setMusicKit,
			}}
		>
			{children}
		</MusicKitContext.Provider>
	)
}

export const useMusicKitContext = () => useContext(MusicKitContext)
