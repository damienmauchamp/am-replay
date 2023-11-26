import { useEffect, useState } from 'react'
import classes from './AMLoginButton.module.css'
import { logDebug } from '@/helpers/debug'

const log = (...args: any) => {
	logDebug('AMLoginButton', 'red', ...args)
}

const AMLoginButton = (props: {
	musicKit: MusicKit.MusicKitInstance
	onLogin: (musicKit: MusicKit.MusicKitInstance) => void
}) => {
	const [loading, setLoading] = useState<boolean>(true)
	const [isLogging, setIsLogging] = useState<boolean>(false)
	const [logged, setLogged] = useState<boolean>(
		props.musicKit?.isAuthorized || false
	)

	log('logged:', logged)
	log('render:', {
		loading: loading,
		isLogging: isLogging,
		logged: logged,
		'props.musicKit': props.musicKit,
		'props.onLogin': props.onLogin,
	})

	/**
	 * Login
	 */
	const handleLogin = () => {
		log(
			'(handleLogin) props.musicKit?.isAuthorized',
			props.musicKit?.isAuthorized
		)

		if (logged) {
			// Already logged
			log('(handleLogin) Already logged')
			return
		}

		setIsLogging(true)

		//
		return props.musicKit
			.authorize()
			.then((response: any) => {
				log('(handleLogin) authorized reponse:', response)

				// updating musicKit
				props.onLogin(props.musicKit)

				setIsLogging(false)
				setLogged(true)
			})
			.catch((err: any) => {
				log('(handleLogin) authorized ERROR:', err)
				console.error(err)

				// updating musicKit
				props.onLogin(props.musicKit)

				setIsLogging(false)
			})
	}

	useEffect(() => {
		log('(useEffect[])', logged)
		log('(useEffect[]) MusicKit:', MusicKit)
		log('(useEffect[]) MusicKit.getInstance():', MusicKit.getInstance())
		// log('useEffect[]: ', {
		// 	'props.musicKit?.isAuthorized': props.musicKit?.isAuthorized,
		// })
		// setLogged(props.musicKit?.isAuthorized);

		setTimeout(() => {
			setLoading(false)
		}, 500)
	}, [])

	useEffect(() => {
		log(
			'useEffect[props.musicKit?.isAuthorized]:',
			props.musicKit?.isAuthorized
		)
		setLogged(props.musicKit?.isAuthorized)
	}, [props.musicKit?.isAuthorized])

	return (
		<>
			{loading ? (
				<div>LOADING...</div>
			) : (
				<button
					className={
						logged ? classes.buttonBgConnected : classes.buttonBg
					}
					onClick={handleLogin}
				>
					{logged ? 'Logged' : isLogging ? 'Logging in' : 'Login'}
				</button>
			)}
		</>
	)
}

export default AMLoginButton
