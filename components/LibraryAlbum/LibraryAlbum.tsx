import classes from './LibraryAlbum.module.css'
import Image from 'next/image';

type LibraryAlbum = {
	id: string;
	type: string; // 'library-albums'
	href: string;
	attributes: LibraryAlbumAttributes;
}

type LibraryAlbumAttributes = {
	trackCount: number;
	genreNames: string[];
	releaseDate: string;
	name: string;
	artistName: string;
	artwork: LibraryAlbumArtwork;
	playParams: object;
	dateAdded: string;
}

type LibraryAlbumArtwork = {
	width: number;
	height: number;
	url: string;
}

const LibraryAlbum = (props: {album: LibraryAlbum, displayedAlbumId: number}) => {

	const defaultSize = 500;

	const getImageUrl = (album: LibraryAlbum, size:number = defaultSize) => {
		if (!album.attributes.artwork || !album.attributes.artwork.url) {
			return '/img/default-cover.jpg';
		}
		return album.attributes.artwork.url
			.replace('{w}', String(size))
			.replace('{h}', String(size));
	}

	return (
		<>
			<div>
				<Image 	className={classes.artwork} 
						src={getImageUrl(props.album, defaultSize)} 
						alt={`${props.album.attributes.name} by ${props.album.attributes.artistName}`}
						width={defaultSize} height={defaultSize} />
				<p>ID: {props.displayedAlbumId}</p>
				<p>{props.album.attributes.name}</p>
				<p>{props.album.attributes.artistName}</p>
				<p>{props.album.attributes.releaseDate}</p>
			</div>
		</>
	)
}

export default LibraryAlbum