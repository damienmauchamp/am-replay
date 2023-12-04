import React, { useEffect, useState } from 'react'
import LibraryAlbum from '../Elements/LibraryAlbum/LibraryAlbum'
import Button from '../AppleMusic/Buttons/Button'
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import { logDebug } from '@/helpers/debug'
import { useMusicKitContext } from '@/context/MusicKitContext'
import tailwindConfig, { iOSTheme } from '@/tailwind.config'

const log = (...args: any) => {
	logDebug('AlbumPicker', 'teal', ...args)
}

interface AlbumPickerProps {}

const AlbumPicker: React.FC<AlbumPickerProps> = ({ ...props }) => {
	const { logged, getInstance, isAuthorized } = useMusicKitContext()
	const [display, setDisplay] = useState<boolean>(false)

	const apiLimit = 100,
		loopMaxPage = 999

	let loopPages: number[] = []

	const [loading, setLoading] = useState<boolean>(false)

	const [apiPage, setApiPage] = useState<number>(1)
	const [fetchComplete, setFetchComplete] = useState<boolean>(false)
	const [loop, setLoop] = useState<boolean>(false)

	const [albumFetching, setAlbumFetching] = useState<boolean>(false)
	const [displayedAlbumId, setDisplayedAlbumId] = useState<number>(0)
	const [albums, setAlbums] = useState<Array<LibraryAlbum>>([])

	const [year, setYear] = useState<number>(new Date().getFullYear())

	const loadAllAlbums = () => {
		setAlbumFetching(true)
		setLoop(true)
	}

	const loadAlbums = (data: any = {}) => {
		log(
			'loadAlbums',
			{
				'isAuthorized()': isAuthorized(),
				display: display,
				logged: logged,
				fetchComplete: fetchComplete,
				apiPage: apiPage,
				loop: loop,
				loopMaxPage: loopMaxPage,
				data: data,
			},
			data
		)

		if (!logged || !isAuthorized()) {
			return
		}

		setLoading(true)

		const params: MusicKit.QueryParameters = {
			limit: apiLimit,
			offset: (apiPage - 1) * apiLimit,
		}

		log('loadAlbums: getInstance().api', getInstance().api)
		log('loadAlbums: getInstance().api.library', getInstance().api.library)
		log('loadAlbums: [albums] params:', params)

		return getInstance()
			.api.library.albums(null, params)
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
					updateAlbums(yearAlbums)
					// setAlbums([...albums, ...yearAlbums])
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
		let looping = false
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
					if (looping) {
						thisDisplayedAlbumId = 0
					} else if (!fetchComplete) {
						loadAlbums()
					}
				}
				break
			default:
				return
		}

		//
		if (
			!albums[thisDisplayedAlbumId] ||
			albumHasCategory(albums[displayedAlbumId].id)
		) {
			displayFirstAlbumWithoutCategory()
			return
		}
		setDisplayedAlbumId(thisDisplayedAlbumId)
	}

	const stopLoading = () => {
		setLoop(false)
	}

	const resetPage = () => {
		stopLoading()
		updateAlbums([], true)
		setDisplayedAlbumId(0)
		setApiPage(1)
	}

	useEffect(() => {
		console.log(`Component AlbumPicker mounted.`)
		log('useEffect[isAuthorized()]:', isAuthorized())

		setDisplay(logged && isAuthorized())
		return () => {
			console.log(`Component AlbumPicker unmounted.`)
		}
	}, [])

	useEffect(() => {
		console.log(`Component AlbumPicker updated.`)
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

	useEffect(() => {
		log('useEffect[display]:', display)
		if (display) {
			// loadAlbums()
		}
	}, [display])

	useEffect(() => {
		log('useEffect[logged]:', logged)
		setDisplay(logged)
	}, [logged])

	/* ------ */

	const DEFAULT_YEARLY = {
		albums: [] as LibraryAlbum[],
		picked: [] as string[],
		todo: [] as string[],
		skipped: [] as string[],
	}
	const DEFAULT_STATE = {
		years: {
			[year]: DEFAULT_YEARLY,
		},
		// todo : cache, localStorage, save before closing, button save, ...
		// cache: {
		// 	page: null,
		// },
		timestamp: Date.now(),
		lastUpdate: Date.now(),
		lastAction: 'init',
	}

	console.log('DEFAULT_STATE', DEFAULT_STATE)

	const [data, setData] = useState(DEFAULT_STATE)

	const updateData = (newData: any, action: string = 'update') => {
		newData.lastUpdate = Date.now()
		newData.lastAction = action
		setData(newData)
	}

	const updateAlbums = (
		newAlbums: LibraryAlbum[],
		reset: boolean = false
	) => {
		const tmp = [...albums, ...newAlbums]

		const dataX = data
		dataX.years[year].albums = tmp
		updateData(dataX, 'albumUpdate')

		setAlbums(tmp)
	}

	const getCurrentId = () => {
		const current = albums[displayedAlbumId]
		if (!current) {
			return null
		}

		return albums[displayedAlbumId].id
	}

	const addCurrentIdTo = (to: 'picked' | 'skipped' | 'todo') => {
		log('(addCurrentIdTo)', to)

		if (!isLibraryItemYearKey(to)) {
			return false
		}

		let currentId = getCurrentId()
		if (!currentId) {
			log('(addCurrentIdTo) No current ID')
			return false
		}

		if (getAlbumCategory(currentId)) {
			log('(addCurrentIdTo) Already in', getAlbumCategory(currentId))
			return true
		}

		log('(addCurrentIdTo) Current ID:', currentId)

		const dataX = data
		dataX.years[year][to].push(currentId)
		updateData(dataX, to)

		return true
	}

	const onAlbumSelect = () => {
		log('(onAlbumSelect)')

		if (addCurrentIdTo('picked')) {
			handlePrevNext('next')
		}
	}

	const onAlbumSkip = () => {
		log('(onAlbumSkip)')

		if (addCurrentIdTo('skipped')) {
			handlePrevNext('next')
		}
	}

	const libraryYearKeys = Array('picked', 'skipped', 'todo')

	type LibraryItemYearKey = 'picked' | 'todo' | 'skipped'
	const isLibraryItemYearKey = (key: string): key is LibraryItemYearKey => {
		return libraryYearKeys.includes(key)
	}

	const getAlbumCategory = (albumId: string) => {
		let actionId = null
		libraryYearKeys.every((element, index) => {
			log('(getAlbumCategory) forEach - element', element, index)
			log(
				'(getAlbumCategory) forEach - data.years[year]',
				data.years[year]
			)

			if (
				isLibraryItemYearKey(element) &&
				data.years[year][element].includes(albumId)
			) {
				log('(getAlbumCategory) INCLUDES', element)
				actionId = element
				return false
			}
			log('(getAlbumCategory) nope', element)
			return true
		})
		return actionId
	}

	const albumHasCategory = (albumId: string) => {
		return getAlbumCategory(albumId) ? true : false
	}

	const getFirstAlbumIdWithoutCategory = () => {
		let firstIndex = null
		albums.every((album, index) => {
			if (!albumHasCategory(album.id)) {
				firstIndex = index
				return false
			}
			return true
		})
		return firstIndex
	}

	const displayFirstAlbumWithoutCategory = () => {
		const firstIndex = getFirstAlbumIdWithoutCategory()
		if (firstIndex !== null) {
			setDisplayedAlbumId(firstIndex)
		}
	}

	const onAlbumUndo = () => {
		log('(onAlbumUndo)', {
			displayedAlbumId: displayedAlbumId,
			lastAlbum: albums[displayedAlbumId] || null,
		})

		// todo
		const lastAlbum = albums[displayedAlbumId - 1] || null
		if (!lastAlbum) {
			log('(onAlbumUndo) no last')
			return
		}

		let dataX = data
		let lastId = lastAlbum.id
		let lastActionId = getAlbumCategory(lastId)

		log('(onAlbumUndo) lastAlbum', lastAlbum)
		log('(onAlbumUndo) lastId', lastId)

		log('(onAlbumUndo) lastActionId', lastActionId)

		if (!lastActionId || !dataX.years[year][lastActionId]) {
			log('(onAlbumUndo) no last action')
			return
		}
		log(
			'(onAlbumUndo) dataX.years[year][lastActionId]',
			dataX.years[year][lastActionId]
		)

		if (Array.isArray(dataX.years[year][lastActionId])) {
			const poppedLastId = (
				dataX.years[year][lastActionId] as string[]
			).pop()
		}

		updateData(dataX, 'undo')

		handlePrevNext('prev')
	}

	const onAlbumTodo = () => {
		log('(onAlbumTodo)')

		if (addCurrentIdTo('todo')) {
			handlePrevNext('next')
		}
	}

	/* ------ */

	const actionButtons = () => {
		const buttonDefaultProps = {
			className: '!w-auto	',
		}

		return (
			<>
				<div className={'grid grid-cols-2 gap-2'}>
					<Button
						className={buttonDefaultProps.className}
						Style="Filled"
						Size="Large"
						Color={iOSTheme.color.pink.DEFAULT}
						onClick={onAlbumSelect}
					>
						Select
					</Button>

					<Button
						className={buttonDefaultProps.className}
						Style="Filled"
						Size="Large"
						Color={iOSTheme.color.grey.DEFAULT}
						onClick={onAlbumSkip}
					>
						Skip
					</Button>

					<Button
						className={buttonDefaultProps.className}
						Style="Filled"
						Size="Large"
						Color={iOSTheme.color.purple.DEFAULT}
						onClick={onAlbumUndo}
					>
						Undo
					</Button>

					<Button
						className={buttonDefaultProps.className}
						Style="Filled"
						Size="Large"
						Color={iOSTheme.color.yellow.DEFAULT}
						onClick={onAlbumTodo}
					>
						Todo
					</Button>
				</div>
			</>
		)
	}

	/* ------ */

	const renderTopButtons = () => {
		return (
			<ul className="flex flex-row gap-2 justify-center py-2">
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
		)
	}

	const renderAlbums = () => {
		const debug = false
		const renderArrows = () =>
			debug && (
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
			)

		return albums.length ? (
			albums[displayedAlbumId] &&
			!albumHasCategory(albums[displayedAlbumId].id) ? (
				<>
					<LibraryAlbum
						album={albums[displayedAlbumId]}
						displayedAlbumId={displayedAlbumId}
					/>
					{renderArrows()}
				</>
			) : (
				'No album left'
			)
		) : (
			'No albums to display yet'
		)
	}

	const renderTotal = () => {
		return (
			<div className={''}>
				<h2>Year : {year}</h2>
				<ul>
					<hr />
					<li>
						Albums counts : {data.years[year]?.albums?.length || 0}
					</li>
					<li>Picked : {data.years[year]?.picked?.length || 0}</li>
					<li>TODO : {data.years[year]?.todo?.length || 0}</li>
					<li>Skipped : {data.years[year]?.skipped?.length || 0}</li>
					<hr />
					<li>Displayed ID : {displayedAlbumId}</li>
					<hr />
				</ul>
			</div>
		)
	}

	const render = () => {
		return (
			<>
				<div className="py-4">
					<h3>Albums {loading ? '(LOADING...)' : ''}</h3>

					{renderTopButtons()}

					{renderAlbums()}
				</div>

				{/* Action buttons */}
				{actionButtons()}

				{renderTotal()}

				<div className="">
					<h3>Debug API</h3>
					<ul>
						<li>displayedAlbumId : {displayedAlbumId}</li>
					</ul>
					<div>
						Nb: {albums ? albums.length : 'NULL'} -{' '}
						{albumFetching ? `Fetching page ${apiPage}...` : 'Done'}
					</div>
					<div>Page : {apiPage}</div>
					<Button
						Style="Bezeled"
						onClick={() => displayFirstAlbumWithoutCategory()}
					>
						displayFirstAlbumWithoutCategory()
					</Button>
					<Button Style="Bezeled" onClick={() => console.log(data)}>
						DATA
					</Button>
				</div>
			</>
		)
	}

	return <>{(display && render()) || 'Please log in'}</>
}

export default AlbumPicker
