import MusicKitInstance = MusicKit.MusicKitInstance

declare interface WithMusicKitProps {
	mk: MusicKit.MusicKitInstance
	isAuthorized: () => boolean
	// storybook
	storyProps: any
	// todo : tests
	testMethod: () => void
}

const defaultProps: WithMusicKitProps = {
	// storybook
	storyProps: {},
	// todo : tests
	testMethod: () => {},
}
