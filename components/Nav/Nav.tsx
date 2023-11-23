import { useEffect, useState } from 'react'
import AMLoginButton from '../AMLoginButton/AMLoginButton'
import classes from './Nav.module.css'
import withMusicKit from '@/hoc/WithMusicKit'
import LoginButton from '../Auth/LoginButton/LoginButton'
import LogoutButton from '../Auth/LogoutButton/LogoutButton'

const DEBUG = true

const log = (...args: any) => {
	console.log('%c[Nav]', 'color:green', ...args)
}

export const Nav = (props: {
	musicKit: MusicKit.MusicKitInstance
	onLogin: (musicKit: MusicKit.MusicKitInstance) => void
	onLogout: () => MusicKit.MusicKitInstance
	// onLogout: () => void
	// onLogout: () => MusicKit.MusicKitInstance
}) => {
	const [logged, setLogged] = useState<boolean>(
		props.musicKit?.isAuthorized || false
	)
	const [musicKit, setMusicKit] = useState<MusicKit.MusicKitInstance>(
		props.musicKit
	)

	// if (props.musicKit !== ({} as MusicKit.MusicKitInstance)) {
	if (props.musicKit !== musicKit) {
		setMusicKit(props.musicKit)
	}

	log('render:', {
		'props.musicKit': props.musicKit,
		'props.onLogin': props.onLogin,
		'props.onLogout': props.onLogout,
		logged: logged,
		musicKit: musicKit,
	})

	/**
	 * Login
	 * - updating musicKit
	 * @param musicKit
	 */
	const handleLogin = (musicKit: MusicKit.MusicKitInstance) => {
		log('(onLogin) musicKit:', musicKit)

		// Applying on Nav
		setMusicKit(musicKit)

		// Applying to parent
		return props.onLogin(musicKit)
	}

	/**
	 * Logout
	 */
	const handleLogout = () => {
		log('(handleLogout)')

		// Logging out
		props.onLogout()
		musicKit.unauthorize()
		setMusicKit(musicKit)

		// Set logged out
		setLogged(false)
	}

	useEffect(() => {
		log('(useEffect) MusicKit.getInstance():', MusicKit.getInstance(), {
			Authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Music-User-Token': MusicKit.getInstance().musicUserToken,
		})

		// MusicKit.getInstance().addEventListener(
		// 	MusicKit.Events.authorizationStatusDidChange,
		// 	(e: any) => {
		// 		console.log('MusicKit.Events.authorizationStatusDidChange', e)
		// 	}
		// )
	})

	/**
	 * Updating logged
	 */
	useEffect(() => {
		log(
			'(useEffect[musicKit?.isAuthorized]) musicKit?.isAuthorized:',
			musicKit?.isAuthorized
		)
		setLogged(musicKit?.isAuthorized)
	}, [musicKit?.isAuthorized])

	// region debug
	const debug = () =>
		DEBUG ? (
			<div id="nav--debug" className="p-4">
				<button
					onClick={() => {
						console.log('Headers: musicKit:', musicKit)
						const headers = {
							Authorization: `Bearer ${musicKit.developerToken}`,
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'Music-User-Token': musicKit.musicUserToken,
						}
						console.log('Headers: headers:', headers)
						return headers
					}}
				>
					getHeaders()
				</button>

				<ul>
					<li>logged: {Number(logged)}</li>
					<li>
						isAuthorized: {Number(musicKit?.isAuthorized || false)}
					</li>
				</ul>
			</div>
		) : (
			''
		)
	// endregion debug

	return (
		<>
			<nav className={classes.nav}>
				<LoginButton onLogin={handleLogin} />
				<LogoutButton onLogout={handleLogout} />

				{/* <div>||| OLD : </div>
				<AMLoginButton musicKit={musicKit} onLogin={handleLogin} />
				{logged ? <button onClick={handleLogout}>Logout</button> : ''} */}
			</nav>

			{debug()}
		</>
	)
}
