import AlbumPicker from '../AlbumPicker/AlbumPicker'

export const Home = (props: { musicKit: MusicKit.MusicKitInstance }) => {
	console.log('Home')

	return (
		<>
			<AlbumPicker musicKit={props.musicKit} />
		</>
	)
}
