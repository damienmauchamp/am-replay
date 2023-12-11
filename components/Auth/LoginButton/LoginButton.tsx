import React, {useEffect, useState} from 'react'
import classes from './LoginButton.module.css'
import Button from '@/components/AppleMusic/Buttons/Button'
import {IoLogInOutline, IoPerson} from 'react-icons/io5'
import {logDebug} from '@/helpers/debug'
import {useMusicKitContext} from '@/context/MusicKitContext'

const log = (...args: any) => {
	logDebug('LoginButton', 'pink', ...args)
}

interface LoginButtonProps {
	onLogin?: () => void
}

const LoginButton: React.FC<LoginButtonProps> = ({...props}) => {
	const {loading, logged, getInstance, updateLogin} = useMusicKitContext()
	const [buttonLoading, setButtonLoading] = useState<boolean>(loading)
	const [isLogging, setIsLogging] = useState<boolean>(false)

	const afterLogin = () => {
		// Updating
		updateLogin()
		props.onLogin && props.onLogin()
		setIsLogging(false)
	}

	const handleLogin = () => {
		if (getInstance().isAuthorized) {
			// Already logged
			log('(handleLogin) Already logged')
			updateLogin()
			return
		}

		setIsLogging(true)

		return getInstance()
			.authorize()
			.then((response: any) => {
				log('(handleLogin) authorized reponse:', response, {
					musicKit: getInstance(),
					unauthorize: getInstance().unauthorize || 'ta mère',
				})
				afterLogin()
			})
			.catch((err: any) => {
				log('(handleLogin) authorized ERROR:', err)
				console.error(err)
				afterLogin()
			})
	}

	useEffect(() => {
		setButtonLoading(loading)
	}, [])

	useEffect(() => {
		setButtonLoading(loading)
	}, [loading])

	return (
		<>
			{buttonLoading ? (
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
					Icon={logged ? IoPerson : IoLogInOutline}
				>
					{logged ? 'Logged' : isLogging ? 'Logging in' : 'Login'}
				</Button>
			)}
		</>
	)
}

export default LoginButton
