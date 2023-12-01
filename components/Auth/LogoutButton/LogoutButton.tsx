import { useEffect, useState } from 'react'
import Button from '@/components/AppleMusic/Buttons/Button'
import { IoLogOutOutline } from 'react-icons/io5'
import { logDebug } from '@/helpers/debug'
import { useMusicKitContext } from '@/context/MusicKitContext'

const log = (...args: any) => {
	logDebug('LogoutButton', 'purple', ...args)
}

interface LogoutButtonProps {
	onLogout?: () => void
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ ...props }) => {
	const { logged, getInstance, updateLogin } = useMusicKitContext()
	const [display, setDisplay] = useState<boolean>(false)

	const afterLogout = () => {
		props.onLogout && props.onLogout()
		updateLogin()
	}

	const handleLogout = async () => {
		// Logging out
		await getInstance().unauthorize()

		let intervalId = setInterval(() => {
			if (!getInstance().isAuthorized) {
				clearInterval(intervalId)
				// Updating
				afterLogout()
			}
		}, 500)
	}

	useEffect(() => {
		setDisplay(logged)
	}, [])

	useEffect(() => {
		log('useEffect[logged]:', logged)
		setDisplay(logged)
	}, [logged])

	return (
		<>
			{/* {logged && ( */}
			{display && (
				<Button
					onClick={handleLogout}
					Color="#FF2D55"
					Style="Filled"
					Icon={IoLogOutOutline}
				>
					Logout
				</Button>
			)}
		</>
	)
}

export default LogoutButton
