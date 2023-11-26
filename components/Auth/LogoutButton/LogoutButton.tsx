import { useEffect, useState } from 'react'
import classes from './LogoutButton.module.css'
import withMusicKit from '@/hoc/WithMusicKit'
import Button from '@/components/AM/Button'
import { IoLogOut, IoLogOutOutline } from 'react-icons/io5'

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

	return (
		<>
			{logged ? (
				<Button
					onClick={handleLogout}
					Color="#FF2D55"
					Style="Filled"
					Icon={IoLogOutOutline}
				>
					Logout
				</Button>
			) : (
				''
			)}
		</>
	)
}

export default withMusicKit(LogoutButton)
