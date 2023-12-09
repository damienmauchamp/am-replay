import styles from './LibraryAlbum.module.css'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
// import { getImagePalette } from 'react-image-palette'
import { ColorExtractor } from 'react-color-extractor'

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

const defaultSize = 720
export const getImageUrl = (
	album: LibraryAlbum,
	size: number = defaultSize
) => {
	if (!album.attributes.artwork || !album.attributes.artwork.url) {
		// https://is1-ssl.mzstatic.com/image/thumb/Features127/v4/75/f9/6f/75f96fa5-99ca-0854-3aae-8f76f5cb7fb5/source/500x500bb.jpeg
		return '/img/default-cover.jpg'
	}
	return album.attributes.artwork.url
		.replace('{w}', String(size))
		.replace('{h}', String(size))
}

export const getImageAlt = (album: LibraryAlbum) =>
	`${album.attributes.name} by ${album.attributes.artistName}`

const LibraryAlbum = (props: {
	album: LibraryAlbum
	displayedAlbumId: number
}) => {
	// dark mode
	const [mode, setMode] = useState<'dark' | 'light'>('light')

	const getMode = () =>
		window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light'

	// const getMode = () =>
	useEffect(() => {
		setMode(getMode())
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', (event) => {
				// console.log('event')
				// const colorScheme = event.matches ? 'dark' : 'light'
				// console.log(colorScheme) // "dark" or "light"
				// setMode(event.matches ? 'dark' : 'light')
				setMode(getMode())
			})
	}, [])

	// color palette
	const [colors, setColors] = useState<string[]>([])
	const getColors = (newColors: string[]) => {
		setColors(newColors)
	}

	const colorIndexes = {
		light: 0,
		dark: 2,
	}

	const imageUrl = getImageUrl(props.album, defaultSize)
	const imageRef = useRef<HTMLImageElement>(null)

	useEffect(() => {}, [])

	useEffect(() => {
		console.log('colors:', colors)
	}, [colors])

	return (
		<>
			<p>Mode : {mode}</p>
			<ColorExtractor src={imageUrl} getColors={getColors} />
			<div className="flex">
				{colors &&
					colors.map((color: string) => {
						return (
							<div key={color} style={{ backgroundColor: color }}>
								{color}
							</div>
						)
					})}{' '}
			</div>

			<div
				// className={`${styles.album} bg-[${
				// 	colors ? colors[colorIndexes.light] : ''
				// }]`}
				className={styles.album}
				style={{
					backgroundColor: colors ? colors[colorIndexes[mode]] : '',
				}}
			>
				<div>
					<Image
						className={styles.artwork}
						src={imageUrl}
						alt={getImageAlt(props.album)}
						width={defaultSize}
						height={defaultSize}
						ref={imageRef}
					/>
				</div>
				<div className={styles.details}>
					<p>
						ID: {props.displayedAlbumId} - {props.album.id}
					</p>
					<p className="font-semibold">
						{props.album.attributes.name}
					</p>
					<p>{props.album.attributes.artistName}</p>
					<p>{props.album.attributes.releaseDate}</p>
				</div>
			</div>
		</>
	)
}

export default LibraryAlbum
