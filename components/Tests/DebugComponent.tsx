import React from 'react'
import withMusicKit from '@/hoc/WithMusicKit'

interface DebugProps extends WithMusicKitProps {
	test: string
}

const Debug: React.FC<DebugProps> = ({ ...props }) => {
	// Utilisez la propriété mk dans votre composant
	return (
		<div className="my-4">
			<h3>Debug</h3>
			<li>Debug.test : {props.test}</li>
			<li>Debug.isAuthorized() : {Number(props.isAuthorized())}</li>
			<li>
				Debug.mk.isAuthorized : {Number(props.mk.isAuthorized || false)}
			</li>
		</div>
	)
}

export default withMusicKit(Debug)
