import MusicKitInstance = MusicKit.MusicKitInstance

declare interface WithMusicKitProps {
	mk: MusicKit.MusicKitInstance
	isAuthorized: () => boolean
	// todo : tests
	testMethod: () => void
}

const defaultProps: WithMusicKitProps = {
	// todo : tests
	testMethod: () => {},
}
