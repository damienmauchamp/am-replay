// 'use client'
import { useEffect, useState } from 'react'
import classes from './LogoutButton.module.css'
import withMusicKit from '@/hoc/WithMusicKit'
import Button from '@/components/AppleMusic/Buttons/Button'
import { IoLogOut, IoLogOutOutline } from 'react-icons/io5'
import { logDebug } from '@/helpers/debug'
import { useMusicKitContext } from '@/context/MusicKitContext'
import MusicProvider from '@/core/MusicKitProvider'

const log = (...args: any) => {
	logDebug('LogoutButton', 'purple', ...args)
}

// interface LogoutButtonProps extends WithMusicKitProps {
interface LogoutButtonProps {
	onLogout?: () => void
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ ...props }) => {
	const { logged, getInstance, updateLogin } = useMusicKitContext()
	// const { musicKit, setMusicKit } = useMusicKitContext()
	// const [logged, setLogged] = useState<boolean>(
	// 	musicKit.isAuthorized || false
	// )

	/**
	 * Logout
	 */
	const handleLogout = async () => {
		log('(handleLogout)', {
			// musicKit: musicKit,
			// isAuthorized: musicKit.isAuthorized,
			date: Date.now(),
		})

		// Logging out
		// props.onLogout()
		// await musicKit.unauthorize()
		await getInstance().unauthorize()

		// Updating
		let intervalId = setInterval(() => {
			log('(handleLogout) setInterval()', {
				getInstance: getInstance(),
				// musicKit: musicKit,
				// isAuthorized: musicKit.isAuthorized,
				date: Date.now(),
			})

			// if (!musicKit.isAuthorized) {
			if (!getInstance().isAuthorized) {
				clearInterval(intervalId)

				// setMusicKit(props.mk)
				log('(handleLogout) post unauthorize OK :', {
					getInstance: getInstance(),
					// musicKit: musicKit,
					// isAuthorized: musicKit.isAuthorized,
					// authorize: musicKit.authorize || 'nooon',
					date: Date.now(),
				})

				props.onLogout && props.onLogout()

				updateLogin()

				// setMusicKit(musicKit)
				// setMusicKit({ ...musicKit, isAuthorized: false })

				// let musicProvider = MusicProvider.sharedProvider()
				// log('TESTST', musicProvider.getMusicInstance())
				// setMusicKit(musicProvider.getMusicInstance())

				// log(
				// 	'(handleLogout) setMusicKit(musicKit)',
				// 	musicKit.isAuthorized,
				// 	musicKit,
				// 	'instance:',
				// 	window.MusicKit.getInstance()
				// )
				// // setMusicKit(musicKit)
				// // setMusicKit((prevMusicKit) => ({ ...prevMusicKit, isAuthorized: true }));
				// // setMusicKit((prevMusicKit) => ({
				// // 	// ...prevMusicKit,
				// // 	...musicKit,
				// // }))
				// setMusicKit((prevMusicKit) => ({
				// 	...prevMusicKit,
				// 	...window.MusicKit.getInstance(),
				// }))
				// // setMusicKit((prevMusicKit) => musicKit)
				// // setMusicKit((prevMusicKit) => {
				// // 	const newww = {
				// // 		...prevMusicKit,
				// // 		...musicKit,
				// // 	}
				// // 	log('(handleLogout.setMusicKit) newww', {
				// // 		newww:newww,
				// // 		musicKit:musicKit,
				// // 		prevMusicKit:prevMusicKit,
				// // 	})
				// // 	return newww
				// // })
				// log(
				// 	'(handleLogout) POST setMusicKit:',
				// 	musicKit.isAuthorized,
				// 	musicKit
				// )

				// setLogged(musicKit.isAuthorized)

				// // log('musicKit.isAuthorized', musicKit.isAuthorized)

				// // Set logged out
				// // setLogged(false)
				// // setAuthorized(false)
			}
		}, 500)
	}

	// useEffect(() => {
	// 	log('(useEffect) mounted', { logged: logged, musicKit: musicKit })
	// }, [])
	// useEffect(() => {
	// 	log('(useEffect) updated', { logged: logged, musicKit: musicKit })
	// 	// setLogged(musicKit.isAuthorized)
	// })
	// useEffect(() => {
	// 	log('(useEffect[musicKit]) updated', {
	// 		logged: logged,
	// 		musicKit: musicKit,
	// 	})
	// 	// setLogged(musicKit.isAuthorized)
	// }, [musicKit])

	// useEffect(() => {
	// 	log('useEffect[props.isAuthorized]:', props.isAuthorized)
	// 	log('useEffect[props.mk.isAuthorized]:', props.mk.isAuthorized)
	// 	setLogged(props.mk.isAuthorized)
	// }, [props.mk.isAuthorized])

	// useEffect(() => {
	// 	log('(useEffect[musicKit?.isAuthorized]) setLogged', {
	// 		logged: musicKit?.isAuthorized,
	// 		musicKit: musicKit,
	// 	})
	// 	setLogged(musicKit?.isAuthorized)
	// }, [musicKit?.isAuthorized])

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
			<button onClick={() => updateLogin(true)}>
				LOGOUT.updateLogin(true)
			</button>
		</>
	)
}

// LogoutButton.defaultProps = {
// 	onLogout: () => {},
// }

// export default withMusicKit(LogoutButton)
export default LogoutButton
