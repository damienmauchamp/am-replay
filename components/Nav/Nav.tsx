import {} from 'react'
import classes from './Nav.module.css'
import LoginButton from '../Auth/LoginButton/LoginButton'
import LogoutButton from '../Auth/LogoutButton/LogoutButton'
import { logDebug } from '@/helpers/debug'
import { useMusicKitContext } from '@/context/MusicKitContext'

const log = (...args: any) => {
	logDebug('Nav', 'green', ...args)
}

export const Nav = (props: {}) => {
	return (
		<>
			<nav className={classes.nav}>
				<LoginButton />
				<LogoutButton />
			</nav>
		</>
	)
}
