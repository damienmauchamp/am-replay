import AlbumPicker from '../AlbumPicker/AlbumPicker'

export const Home = (props: {
	musicKit: MusicKit.MusicKitInstance
	// updateMusicKit: Function,
	// handleLogout: Function,
}) => {
	console.log('Home')

	return (
		<>
			<AlbumPicker musicKit={props.musicKit} />
		</>
	)
}
