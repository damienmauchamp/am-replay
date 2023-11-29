import { useEffect, useState } from 'react'
import classes from './LoginButton.module.css'
import withMusicKit from '@/hoc/WithMusicKit'
import Button from '@/components/AppleMusic/Buttons/Button'
import { IoLogInOutline } from 'react-icons/io5'
import { logDebug } from '@/helpers/debug'
import { useMusicKitContext } from '@/context/MusicKitContext'
import MusicProvider from '@/core/MusicKitProvider'

// interface LoginButtonProps extends WithMusicKitProps {
interface LoginButtonProps {
	onLogin?: () => void
}

// const defaultProps = {
// 	onLogin: () => {},
// }

const log = (...args: any) => {
	logDebug('LoginButton', 'pink', ...args)
}

const LoginButton: React.FC<LoginButtonProps> = ({ ...props }) => {
	const { logged, getInstance, updateLogin } = useMusicKitContext()

	//////

	// const { musicKit, setMusicKit } = useMusicKitContext()

	const [loading, setLoading] = useState<boolean>(true)
	const [isLogging, setIsLogging] = useState<boolean>(false)

	// todo : logged global (context)
	// const [logged, setLogged] = useState<boolean>(
	// 	musicKit?.isAuthorized || false
	// )

	log('CONST')
	const render = () => {
		log('RENDER')
		// if (musicKit.isAuthorized) {
		if (logged) {
			// User is logged in
			return (
				<div>
					([LOGIN] Logged in) -{' '}
					<button onClick={() => updateLogin(true)}>
						LOGIN.updateLogin(true)
					</button>
				</div>
			)
		} else {
			// User is not logged in
			return (
				<div>
					([LOGIN] Logged out) -{' '}
					<button onClick={() => updateLogin(true)}>
						LOGIN.updateLogin(true)
					</button>
				</div>
			)
		}
	}

	const handleLogin = () => {
		// log('(handleLogin) musicKit', musicKit)
		// log('(handleLogin) musicKit?.isAuthorized', musicKit?.isAuthorized)

		// if (logged) {
		// if (musicKit.isAuthorized) {
		if (getInstance().isAuthorized) {
			// Already logged
			log('(handleLogin) Already logged')
			return
		}

		setIsLogging(true)

		//
		// return musicKit
		return getInstance()
			.authorize()
			.then((response: any) => {
				log('(handleLogin) authorized reponse:', response, {
					musicKit: getInstance(),
					unauthorize: getInstance().unauthorize || 'ta mère',
				})

				// updating musicKit
				// todo : see if needed
				// props.onLogin(props.mk)
				props.onLogin && props.onLogin()

				setIsLogging(false)

				updateLogin()

				// setLogged(true)
				// setMusicKit(musicKit)
				// setMusicKit({ ...musicKit, isAuthorized: true })

				// // let musicProvider = MusicProvider.sharedProvider()
				// // log('TESTST', musicProvider.getMusicInstance())
				// // setMusicKit(musicProvider.getMusicInstance())
				// log(
				// 	'(handleLogin) musicKit.unauthorize:',
				// 	musicKit.unauthorize || 'nOOOON'
				// )

				// log(
				// 	'(handleLogin) setMusicKit(musicKit)',
				// 	musicKit.isAuthorized,
				// 	musicKit,
				// 	'instance:',
				// 	window.MusicKit.getInstance()
				// )
				// // setMusicKit(musicKit)
				// // setMusicKit((prevMusicKit) => ({
				// // 	// ...prevMusicKit,
				// // 	...musicKit,
				// // }))
				// // setMusicKit((prevMusicKit) => ({ ...prevMusicKit, isAuthorized: true }));
				// setMusicKit((prevMusicKit) => ({
				// 	...prevMusicKit,
				// 	// ...musicKit,
				// 	// isAuthorized: true,
				// 	...window.MusicKit.getInstance(),
				// }))
				// setMusicKit(window.MusicKit.getInstance())
				// setMusicKit((prevMusicKit) => musicKit)
				// setMusicKit((prevMusicKit) => {
				// 	const newww = {
				// 		...prevMusicKit,
				// 		...musicKit,
				// 	}
				// 	log('(handleLogin.setMusicKit) newww', {
				// 		newww: newww,
				// 		musicKit: musicKit,
				// 		prevMusicKit: prevMusicKit,
				// 	})
				// 	return newww
				// })
				// log(
				// 	'(handleLogin) POST setMusicKit:',
				// 	musicKit.isAuthorized,
				// 	musicKit
				// )

				// setLogged(musicKit.isAuthorized)
			})
			.catch((err: any) => {
				log('(handleLogin) authorized ERROR:', err)
				console.error(err)

				// updating musicKit
				// todo : see if needed
				// props.onLogin(props.mk)
				props.onLogin && props.onLogin()

				setIsLogging(false)
			})
	}

	// useEffect(() => {
	// 	log('(useEffect[]) mounted', { logged: logged, musicKit: musicKit })
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

	useEffect(() => {
		// 	// log('(useEffect[])', logged)
		// 	// log('(useEffect[])', musicKit.isAuthorized)
		// 	// log('(useEffect[]) MusicKit:', MusicKit)
		// 	// log('(useEffect[]) musicKit:', musicKit)
		// 	// log('(useEffect[]) MusicKit.getInstance():', MusicKit.getInstance())
		// 	// log('(useEffect[]) props.testMethod():', props.testMethod())

		// 	setTimeout(() => {
		setLoading(false)
		// 	}, 500)
	}, [])

	// useEffect(() => {
	// 	log('useEffect[props.isAuthorized]:', props.isAuthorized)
	// 	log('useEffect[props.mk.isAuthorized]:', props.mk.isAuthorized)
	// 	setLogged(props.mk.isAuthorized)
	// }, [props.mk.isAuthorized])

	const renderButton = () => {
		log('(RenderButton) logged:', logged)

		return loading ? (
			<div>loading...</div>
		) : (
			<Button
				className={
					logged
						? classes.buttonBgConnected
						: isLogging
						  ? classes.buttonBgLogging
						  : classes.buttonBg
				}
				onClick={handleLogin}
				Icon={logged ? null : IoLogInOutline}
			>
				{logged ? 'Logged' : isLogging ? 'Logging in' : 'Login'}
			</Button>
		)
	}

	return (
		<>
			{renderButton()}
			{/* {render()} */}
			{/* debug
			<button
				onClick={() => {
					props.testMethod()
				}}
			>
				testMethod()
			</button> */}
		</>
	)
}

// LoginButton.defaultProps = defaultProps

export default LoginButton
// export default withMusicKit(LoginButton)
// export const LoginButtonComponent = LoginButton
