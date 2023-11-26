import withMusicKit from '@/hoc/WithMusicKit'
import React, { useEffect, useState } from 'react'
import LibraryAlbum from '../Elements/LibraryAlbum/LibraryAlbum'
import Button from '../AppleMusic/Buttons/Button'
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import { logDebug } from '@/helpers/debug'

const log = (...args: any) => {
	logDebug('AlbumPicker', 'teal', ...args)
}

interface AlbumPickerProps extends WithMusicKitProps {}

const AlbumPicker: React.FC<AlbumPickerProps> = ({
	mk,
	isAuthorized,
	...props
}) => {
	log('AlbumPicker mk:', mk, isAuthorized())

	if (!isAuthorized()) {
		return 'Please log in'
	}
	const apiLimit = 100,
		loopMaxPage = 999

	let loopPages: number[] = []

	const [loading, setLoading] = useState<boolean>(false)
	// const [authorized, setAuthorized] = useState<boolean>(isAuthorized())

	const [apiPage, setApiPage] = useState<number>(1)
	const [fetchComplete, setFetchComplete] = useState<boolean>(false)
	const [loop, setLoop] = useState<boolean>(false)

	const [albumFetching, setAlbumFetching] = useState<boolean>(false)
	const [displayedAlbumId, setDisplayedAlbumId] = useState<number>(0)
	const [albums, setAlbums] = useState<Array<LibraryAlbum>>([])

	const loadAllAlbums = () => {
		setAlbumFetching(true)
		setLoop(true)
	}

	const loadAlbums = (data: any = {}) => {
		log(
			'loadAlbums',
			{
				'isAuthorized()': isAuthorized(),
				fetchComplete: fetchComplete,
				apiPage: apiPage,
				loop: loop,
				loopMaxPage: loopMaxPage,
				data: data,
			},
			data
		)

		if (!isAuthorized() || !mk || !mk.api) {
			return
		}

		setLoading(true)

		log('loadAlbums: mk.api', mk.api)
		log('loadAlbums: mk.api.library', mk.api.library)

		const params: MusicKit.QueryParameters = {
			limit: apiLimit,
			offset: (apiPage - 1) * apiLimit,
		}

		log('loadAlbums: params:', params)

		return mk.api.library
			.albums(null, params)
			.then((response: MusicKit.Resource[]) => {
				log('loadAlbums OK: response', response)

				if (response !== undefined && !response.length) {
					log('loadAlbums COMPLETE')
					setFetchComplete(true)
					setLoading(false)
					setAlbumFetching(false)
					return
				}

				const libraryAlbums: LibraryAlbum[] = response as LibraryAlbum[]

				// filtering
				const year = 2023
				const onlyAlbums: LibraryAlbum[] = libraryAlbums.filter(
					(a) =>
						!String(a.attributes.name).endsWith('- Single') &&
						!String(a.attributes.name).endsWith('- EP')
					// && String(a.attributes.artwork.url)
				)
				const yearAlbums: LibraryAlbum[] = onlyAlbums.filter((a) =>
					String(a.attributes.releaseDate).startsWith(`${year}-`)
				)

				if (yearAlbums.length) {
					log('loadAlbums[V]: setAlbums:', [...albums, ...yearAlbums])
					setAlbums([...albums, ...yearAlbums])
				}
				setLoading(false)
				setApiPage(apiPage + 1)

				log('loadAlbums[V]: albums:', albums)
				log('loadAlbums[V]: apiPage:', apiPage)
			})
			.catch((error: any) => {
				console.error('loadAlbums OK: error', error)
				setLoading(false)
			})
	}

	const handlePrevNext = (direction: string) => {
		let numberLibraryAlbums = albums.length
		let thisDisplayedAlbumId = displayedAlbumId

		switch (direction) {
			case 'prev':
				thisDisplayedAlbumId--
				if (thisDisplayedAlbumId < 0) {
					thisDisplayedAlbumId = numberLibraryAlbums - 1
				}
				break
			case 'next':
				thisDisplayedAlbumId++
				if (thisDisplayedAlbumId >= numberLibraryAlbums) {
					thisDisplayedAlbumId = 0
				}
				break
			default:
				return
		}

		setDisplayedAlbumId(thisDisplayedAlbumId)
	}

	const stopLoading = () => {
		setLoop(false)
	}

	const resetPage = () => {
		stopLoading()
		setAlbums([])
		setDisplayedAlbumId(0)
		setApiPage(1)
	}

	useEffect(() => {
		log('useEffect[isAuthorized]:', isAuthorized)

		if (isAuthorized()) {
			loadAlbums()
		}
		// }, [authorized])
	}, [])

	useEffect(() => {
		log('useEffect[apiPage, loop]:', apiPage, loop)

		if (!loop) {
			setAlbumFetching(false)
			return
		}

		if (fetchComplete || (loopMaxPage !== null && apiPage > loopMaxPage)) {
			log('useEffect[apiPage, loop]: stop')
			setAlbumFetching(false)
			setLoop(false)
			return
		}

		if (loopPages.includes(apiPage)) {
			log('useEffect[apiPage, loop]: wtf', apiPage)
			setAlbumFetching(false)
			setLoop(false)
			return
		}

		loopPages.push(apiPage)

		loadAlbums()
	}, [apiPage, loop])

	return (
		<div>
			<div className="">
				<h3>Albums</h3>

				{albums.length ? (
					<>
						<LibraryAlbum
							album={albums[displayedAlbumId]}
							displayedAlbumId={displayedAlbumId}
						/>
						<div
							className={
								'flex flex-row items-center justify-between py-4'
							}
						>
							<IoArrowBack
								size={48}
								className="cursor-pointer"
								onClick={() => handlePrevNext('prev')}
							/>
							<IoArrowForward
								size={48}
								className="cursor-pointer"
								onClick={() => handlePrevNext('next')}
							/>
						</div>
					</>
				) : (
					'No albums to display yet'
				)}
			</div>

			<div className="">
				<h3>Debug API</h3>
				{loading ? 'LOADING...' : ''}

				<br />
				<div>
					Nb: {albums ? albums.length : 'NULL'} -{' '}
					{albumFetching ? `Fetching page ${apiPage}...` : 'Done'}
				</div>
				<div>Page : {apiPage}</div>

				<ul>
					<li>
						<Button Style="Filled" onClick={() => loadAlbums()}>
							loadAlbums()
						</Button>
					</li>
					<li>
						<Button Style="Filled" onClick={() => loadAllAlbums()}>
							loadAllAlbums()
						</Button>
					</li>
					<li>
						<Button Style="Filled" onClick={() => stopLoading()}>
							stopLoading()
						</Button>
					</li>
					<li>
						<Button Style="Filled" onClick={() => resetPage()}>
							resetPage()
						</Button>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default withMusicKit(AlbumPicker)
