import React from 'react'
import withMusicKit from '@/hoc/WithMusicKit'

interface MyComponentProps extends WithMusicKitProps {
	test: string
}

const MyComponent: React.FC<MyComponentProps> = ({ ...props }) => {
	// Utilisez la propriété mk dans votre composant
	return (
		<div>
			MyComponent
			<li>MyComponent.test : {props.test}</li>
			<li>MyComponent.isAuthorized() : {Number(props.isAuthorized())}</li>
			<li>
				MyComponent.mk.isAuthorized :{' '}
				{Number(props.mk.isAuthorized || false)}
			</li>
		</div>
	)
}

export default withMusicKit(MyComponent)
