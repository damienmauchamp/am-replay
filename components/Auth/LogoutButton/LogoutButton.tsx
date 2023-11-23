import { useEffect, useState } from 'react'
import classes from './LogoutButton.module.css'
import withMusicKit from '@/hoc/WithMusicKit'

interface LogoutButtonProps extends WithMusicKitProps {
	onLogout: () => void
}

const log = (...args: any) => {
	console.log('%c[LogoutButton]', 'color:purple', ...args)
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ ...props }) => {
	const [logged, setLogged] = useState<boolean>(
		props.isAuthorized // props.mk?.isAuthorized || false
	)

	/**
	 * Logout
	 */
	const handleLogout = async () => {
		log('(handleLogout)')

		// Logging out
		// props.onLogout()
		await props.mk.unauthorize()
		// setMusicKit(props.mk)

		props.onLogout()

		// Set logged out
		setLogged(false)
		// setAuthorized(false)
	}

	useEffect(() => {
		log('useEffect[props.isAuthorized]:', props.isAuthorized)
		log('useEffect[props.mk.isAuthorized]:', props.mk.isAuthorized)
		setLogged(props.mk.isAuthorized)
	}, [props.mk.isAuthorized])

	return <>{logged ? <button onClick={handleLogout}>Logout</button> : ''}</>
}

export default withMusicKit(LogoutButton)
