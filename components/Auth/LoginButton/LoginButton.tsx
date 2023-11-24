import { useEffect, useState } from 'react'
import classes from './LoginButton.module.css'
import withMusicKit from '@/hoc/WithMusicKit'

interface LoginButtonProps extends WithMusicKitProps {
	onLogin: (musicKit: MusicKit.MusicKitInstance) => void
}

const log = (...args: any) => {
	console.log('%c[LoginButton]', 'color:pink', ...args)
}

const LoginButton: React.FC<LoginButtonProps> = ({ ...props }) => {
	const [loading, setLoading] = useState<boolean>(true)
	const [isLogging, setIsLogging] = useState<boolean>(false)
	const [logged, setLogged] = useState<boolean>(
		props.mk?.isAuthorized || false
	)

	const handleLogin = () => {
		log('(handleLogin) props.mk?.isAuthorized', props.mk?.isAuthorized)

		if (logged) {
			// Already logged
			log('(handleLogin) Already logged')
			return
		}

		setIsLogging(true)

		//
		return props.mk
			.authorize()
			.then((response: any) => {
				log('(handleLogin) authorized reponse:', response)

				// updating musicKit
				// todo : see if needed
				props.onLogin(props.mk)

				setIsLogging(false)
				setLogged(true)
			})
			.catch((err: any) => {
				log('(handleLogin) authorized ERROR:', err)
				console.error(err)

				// updating musicKit
				// todo : see if needed
				props.onLogin(props.mk)

				setIsLogging(false)
			})
	}

	useEffect(() => {
		log('(useEffect[])', logged)
		log('(useEffect[]) MusicKit:', MusicKit)
		log('(useEffect[]) MusicKit.getInstance():', MusicKit.getInstance())
		log('(useEffect[]) props.testMethod():', props.testMethod())

		setTimeout(() => {
			setLoading(false)
		}, 500)
	}, [])

	useEffect(() => {
		log('useEffect[props.isAuthorized]:', props.isAuthorized)
		log('useEffect[props.mk.isAuthorized]:', props.mk.isAuthorized)
		setLogged(props.mk.isAuthorized)
	}, [props.mk.isAuthorized])

	// todo : tests
	const handleTestMethod = () => {
		props.testMethod()
	}

	return (
		<>
			<button onClick={handleTestMethod}>testMethod()</button>
			{loading ? (
				<div>loading...</div>
			) : (
				<button
					className={
						logged
							? classes.buttonBgConnected
							: isLogging
							  ? classes.buttonBgLogging
							  : classes.buttonBg
					}
					onClick={handleLogin}
				>
					{logged ? 'Logged' : isLogging ? 'Logging in' : 'Login'}
				</button>
			)}
		</>
	)
}

export default withMusicKit(LoginButton)
// export const LoginButtonComponent = LoginButton
