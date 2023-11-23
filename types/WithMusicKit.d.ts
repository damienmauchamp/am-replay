import MusicKitInstance = MusicKit.MusicKitInstance

declare interface WithMusicKitProps {
	mk: MusicKit.MusicKitInstance
	isAuthorized: () => boolean
}
