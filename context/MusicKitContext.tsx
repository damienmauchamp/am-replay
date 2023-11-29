// 'use client'

import MusicKitProvider from '@/components/Providers/MusicKitProvider'
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
	// musicKit: MusicKit.MusicKitInstance
	// setMusicKit: React.Dispatch<React.SetStateAction<MusicKit.MusicKitInstance>>
	//
	logged: boolean
	updateLogin: Function
	getInstance: Function
}

const defaultMusicKit = {} as MusicKit.MusicKitInstance // todo : loading

const getInstance = () => {
	log('(getInstance)')
	if (typeof window === 'undefined' || typeof MusicKit === 'undefined') {
		return defaultMusicKit
	}
	return MusicProvider.get()
}

const defaultContext = {
	// musicKit: defaultMusicKit,
	// setMusicKit: () => {
	// 	console.log('%cDEFAULT setMusicKit !!!!', 'color:red')
	// },
	//
	logged: false,
	updateLogin: () => {},
	getInstance: getInstance,
}

const MusicKitContext = createContext<MusicKitContextProps>(defaultContext)

export const MusicKitContextProvider = ({
	children,
	...props
}: MusicKitContextProviderProps) => {
	// const [musicKit, setMusicKit] = useState<MusicKit.MusicKitInstance>(
	// 	defaultContext.musicKit
	// )
	const [logged, setLogged] = useState<boolean>(
		getInstance()?.isAuthorized || false
	)

	//
	const updateLogin = (testing: boolean = false) => {
		log('(updateLogin)', {
			// musicKit: musicKit,
			logged: logged,
			getInstance: getInstance(),
		})

		if (testing) {
			log(
				'(updateLogin(TEST)) setLogged(newLogged), newLogged =',
				!logged
			)
			setLogged(!logged)
			return
		}

		const newLogged = getInstance()?.isAuthorized || false
		log('(updateLogin) setLogged(newLogged), newLogged =', newLogged)
		setLogged(newLogged)
	}

	useEffect(() => {
		log('MOUNTED', {
			// musicKit: musicKit,
			logged: logged,
			getInstance: getInstance(),
		})
	}, [])

	// useEffect(() => {
	// 	log('MUSICKIT CHANGED', {
	// 		musicKit: musicKit,
	// 		logged: logged,
	// 		getInstance: getInstance(),
	// 	})
	// }, [musicKit])

	const NumberOrNull = (number: any) => {
		if (typeof number === 'undefined') {
			return 'undefined'
		}
		if (number === null) {
			return 'NULL'
		}
		if (isNaN(number)) {
			return `NaN(${number})`
		}
		return Number(number)
	}

	return (
		<MusicKitContext.Provider value={{ logged, updateLogin, getInstance }}>
			<>
				<ul>
					<li>
						<button
							onClick={() => {
								console.log(getInstance())
							}}
						>
							MusicKitContext.Provider getInstance()
						</button>
					</li>
					<li>
						<button
							onClick={() => {
								console.log(updateLogin())
							}}
						>
							MusicKitContext.Provider updateLogin()
						</button>
					</li>
					<li>
						<button
							onClick={() => {
								console.log(updateLogin(true))
							}}
						>
							MusicKitContext.Provider updateLogin(true)
						</button>
					</li>
					{/* <li>
						musicKit.isAuthorized:{' '}
						{NumberOrNull(musicKit.isAuthorized)}
					</li> */}
					<li>
						getInstance().isAuthorized:{' '}
						{NumberOrNull(getInstance().isAuthorized || null)}
					</li>
					<li>logged: {NumberOrNull(logged)}</li>
				</ul>
				<hr />
				{children}
			</>
		</MusicKitContext.Provider>
	)
}

export const useMusicKitContext = () => useContext(MusicKitContext)
