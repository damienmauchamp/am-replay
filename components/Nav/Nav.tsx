import { useEffect, useState } from 'react'
import AMLoginButton from '../AMLoginButton/AMLoginButton'
import classes from './Nav.module.css'

const DEBUG = true

export const Nav = (props: {
	musicKit: MusicKit.MusicKitInstance, 
	updateMusicKit: Function,
	handleLogout: Function,
}) => {

	const [logged, setLogged] = useState<boolean>(props.musicKit?.isAuthorized || false)

	/**
	 * Updating musicKit
	 * @param musicKit 
	 */
	const updateMusicKit = (musicKit: MusicKit.MusicKitInstance) => {

		// Applying on Nav
		props.musicKit = musicKit;

		// Applying to parent
		props.updateMusicKit(musicKit)
	}

	/**
	 * Logout
	 */
	const handleLogout = () => {
		props.handleLogout()
		setLogged(false)
	}
	
	/**
	 * Updating logged
	 */
	useEffect(() => {
		setLogged(props.musicKit?.isAuthorized);
	}, [props.musicKit?.isAuthorized])

	// region debug
	const debug = () => DEBUG ? (
		<div id="nav--debug" className='p-4'>

			<button onClick={() => {
				console.log('Headers: props.musicKit:', props.musicKit)
				const headers = {
					Authorization: `Bearer ${props.musicKit.developerToken}`,
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Music-User-Token': props.musicKit.musicUserToken,
				}
				console.log('Headers: headers:', headers)
				return headers;
			}}>getHeaders()</button>

			<ul>
				<li>logged: { Number(logged) }</li>
				<li>isAuthorized: { Number(props.musicKit?.isAuthorized || false) }</li>
			</ul>

		</div>
	) : ''
	// endregion debug

	return (
		<>
			<nav className={classes.nav}>

				<AMLoginButton musicKit={props.musicKit} updateMusicKit={updateMusicKit}/>

				{logged ? <button onClick={handleLogout}>Logout</button> : ''}

			</nav>

			{debug()}
		</>
	)
}