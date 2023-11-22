import { useEffect, useState } from 'react'
import classes from './AMLoginButton.module.css'


const AMLoginButton = (props: { musicKit: MusicKit.MusicKitInstance, updateMusicKit: Function }) => {

	const [loading, setLoading] = useState<boolean>(true)
	const [logged, setLogged] = useState<boolean>(props.musicKit?.isAuthorized || false)

	console.log('AM logged:', logged);

	const handleLogin = () => {
		console.log('handleLogin', props.musicKit?.isAuthorized);

		if (logged) {
			// Already logged
			console.log('Already logged');
			return;
		}

		setLoading(true);

		console.log('props.musicKit', props.musicKit);

		// 
		props.musicKit.authorize().then((response: any) => {
			console.log('OK !', response);

			props.updateMusicKit(props.musicKit)

			setLoading(false);
			setLogged(true);
		}).catch((err: any) => {
			console.log('NOPE', err);

			props.updateMusicKit(props.musicKit)

			console.error(err);
			setLoading(false);
			// props.musicKit?.isAuthorized = false;
		})

		// setTimeout(() => {

		// 	console.log('logged now');
		// 	setLogged(true);

		// }, 2500);
	}

	useEffect(() => {

		// console.log('useEffect[]: ', {
		// 	'props.musicKit?.isAuthorized': props.musicKit?.isAuthorized,
		// })
		// setLogged(props.musicKit?.isAuthorized);

		setTimeout(() => {
			setLoading(false);
		}, 500)
	}, []);

	useEffect(() => {
		console.log('useEffect: props.musicKit?.isAuthorized =', props.musicKit?.isAuthorized)
		
		setLogged(props.musicKit?.isAuthorized);

	}, [props.musicKit?.isAuthorized])

	return (
		<>
			{loading ? 
				<div>LOADING...</div> : 
				<>
					<button className={logged ? classes.buttonBgConnected : classes.buttonBg}
							onClick={handleLogin}>{logged ? 'Logged!' : 'Login'}</button>
					
					<br />
				</>
						}
		</>
	)
}

export default AMLoginButton