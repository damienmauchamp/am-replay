import MusicKitInstance = MusicKit.MusicKitInstance

declare interface WithMusicKitProps {
	mk: MusicKit.MusicKitInstance
	isAuthorized: () => boolean
	// storybook
	storyProps: any
	// todo : delete testMethod
	testMethod: () => void
}

const defaultProps: WithMusicKitProps = {
	// storybook
	storyProps: {},
	// todo : delete testMethod
	testMethod: () => {},
}
