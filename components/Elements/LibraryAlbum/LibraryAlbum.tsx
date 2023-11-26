import classes from './LibraryAlbum.module.css'
import Image from 'next/image'

type LibraryAlbum = {
	id: string
	type: string // 'library-albums'
	href: string
	attributes: LibraryAlbumAttributes
}

type LibraryAlbumAttributes = {
	trackCount: number
	genreNames: string[]
	releaseDate: string
	name: string
	artistName: string
	artwork: LibraryAlbumArtwork
	playParams: object
	dateAdded: string
}

type LibraryAlbumArtwork = {
	width: number
	height: number
	url: string
}

const LibraryAlbum = (props: {
	album: LibraryAlbum
	displayedAlbumId: number
}) => {
	const defaultSize = 500

	const getImageUrl = (album: LibraryAlbum, size: number = defaultSize) => {
		if (!album.attributes.artwork || !album.attributes.artwork.url) {
			// https://is1-ssl.mzstatic.com/image/thumb/Features127/v4/75/f9/6f/75f96fa5-99ca-0854-3aae-8f76f5cb7fb5/source/500x500bb.jpeg
			return '/img/default-cover.jpg'
		}
		return album.attributes.artwork.url
			.replace('{w}', String(size))
			.replace('{h}', String(size))
	}

	return (
		<>
			<div>
				<Image
					className={classes.artwork}
					src={getImageUrl(props.album, defaultSize)}
					alt={`${props.album.attributes.name} by ${props.album.attributes.artistName}`}
					width={defaultSize}
					height={defaultSize}
				/>
				<p>ID: {props.displayedAlbumId}</p>
				<p>{props.album.attributes.name}</p>
				<p>{props.album.attributes.artistName}</p>
				<p>{props.album.attributes.releaseDate}</p>
			</div>
		</>
	)
}

export default LibraryAlbum