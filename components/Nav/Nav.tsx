import { useContext, useEffect, useState } from 'react'
import classes from './Nav.module.css'
import LoginButton from '../Auth/LoginButton/LoginButton'
import LogoutButton from '../Auth/LogoutButton/LogoutButton'
import { logDebug } from '@/helpers/debug'
import { useMusicKitContext } from '@/context/MusicKitContext'

const log = (...args: any) => {
	logDebug('Nav', 'green', ...args)
}

const DEBUG = true

export const Nav = (props: {}) => {
	const { logged, getInstance } = useMusicKitContext()

	const render = () => {
		if (logged) {
			// User is logged in
			return <div>[NAV] Logged in</div>
		} else {
			// User is not logged in
			return <div>[NAV] Logged out</div>
		}
	}

	log('render:', {
		logged: logged,
	})

	const header = () => {
		const headers = {
			Authorization: `Bearer ${getInstance().developerToken}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Music-User-Token': getInstance().musicUserToken,
		}
		log('(Headers) headers:', headers)
		return headers
	}

	// region debug
	const debug = () =>
		DEBUG ? (
			<div id="nav--debug" className="p-4">
				<div>[NAV] Logged {logged ? 'in' : 'out'}</div>
				<hr />
				<button onClick={() => header()}>getHeaders()</button>
				<ul>
					<li>Nav.logged: {Number(logged)}</li>
					<li>
						<button
							onClick={() => {
								console.log(getInstance())
							}}
						>
							Nav.getInstance()
						</button>
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
				<LoginButton />
				<LogoutButton />
			</nav>

			{debug()}
		</>
	)
}
