import AlbumPicker from '../AlbumPicker/AlbumPicker'
import ButtonTestPage from '../Tests/Pages/ButtonTestPage'

export const Home = (props: { musicKit: MusicKit.MusicKitInstance }) => {
	return (
		<>
			<ButtonTestPage />
			<AlbumPicker />
		</>
	)
}
