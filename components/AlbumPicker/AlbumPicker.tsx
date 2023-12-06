import React, { useEffect, useRef, useState } from 'react'
import LibraryAlbum from '../Elements/LibraryAlbum/LibraryAlbum'
import Button from '../AppleMusic/Buttons/Button'
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import { logDebug } from '@/helpers/debug'
import { useMusicKitContext } from '@/context/MusicKitContext'
import tailwindConfig, { iOSTheme } from '@/tailwind.config'
import TinderCard from 'react-tinder-card'
import SegmentedControls from '../AppleMusic/SegmentedControls/SegmentedControls'
import styles from './AlbumPicker.module.css'
import TopTab from './Tabs/TopTab'
import TodoTab from './Tabs/TodoTab'
import moment from 'moment-timezone'

const log = (...args: any) => {
	logDebug('AlbumPicker', 'teal', ...args)
}

interface AlbumPickerProps {}

type YearType = {
	albums: LibraryAlbum[]
	picked: string[]
	todo: string[]
	skipped: string[]
}

// type YearsType = {
// 	[]
// }

const DATATYPE_CODE = 'DataType'
type DataType = {
	// years: YearType[]
	years: { [year: number]: YearType }
	// todo : cache, localStorage, save before closing, button save, ...
	// cache: {
	// 	page: null,
	// },
	timestamp: number
	lastUpdate: number
	lastAction: string
	type: string
}

const STORAGE_KEY = 'amrStoragePicker'
const STORAGE_MINS = 3600

const DEFAULT_YEARLY: YearType = {
	albums: [] as LibraryAlbum[],
	picked: [] as string[],
	todo: [] as string[],
	skipped: [] as string[],
}

const getDefaultState = (year: number): DataType => ({
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
	type: DATATYPE_CODE,
})

const isDataType = (obj: any): obj is DataType => {
	return obj.type === DATATYPE_CODE
}

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

	const tabsRef = useRef()
	const tabsItems = [
		{
			label: 'Picker',
			value: 'picker',
			ref: useRef(),
		},
		{ label: 'Top', value: 'top', ref: useRef() },
		{
			label: 'Todolist',
			value: 'todolist',
			ref: useRef(),
		},
	]
	const [year, setYear] = useState<number>(new Date().getFullYear())
	const [tab, setTab] = useState<number>(0)

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
				const currentAlbumIds = albums.map((a) => a.id)
				console.log('currentAlbumIds', currentAlbumIds)
				const uniqueAlbums: LibraryAlbum[] = libraryAlbums.filter(
					(a) => !currentAlbumIds.includes(a.id)
				)
				const onlyAlbums: LibraryAlbum[] = uniqueAlbums.filter(
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
		// updateAlbums([], true)
		updateData(getDefaultState(year))
		setDisplayedAlbumId(0)
		setApiPage(1)
	}

	useEffect(() => {
		console.log(`Component AlbumPicker mounted.`)

		// if (getStorageData()) {
		// 	setData(getStorageData())
		// }
		console.log('getStorageData', getStorageData())
		console.log('initData', initData())
		if (logged && isAuthorized()) {
			const init = initData()
			updateData(init, 'initData')
			if (init.years[year].albums.length) {
				console.log('go first')
				displayFirstAlbumWithoutCategory()
				// setAlbums(init.years[year].albums)
			}
			setDisplay(true)
		}

		return () => {
			console.log(`Component AlbumPicker unmounted.`)
		}
	}, [])

	useEffect(() => {
		console.log(`Component AlbumPicker updated.`)

		if (!loop) {
			setAlbumFetching(false)
			return
		}

		if (fetchComplete || (loopMaxPage !== null && apiPage > loopMaxPage)) {
			setAlbumFetching(false)
			setLoop(false)
			return
		}

		if (loopPages.includes(apiPage)) {
			setAlbumFetching(false)
			setLoop(false)
			return
		}

		loopPages.push(apiPage)

		loadAlbums()
	}, [apiPage, loop])

	useEffect(() => {
		if (display) {
			// loadAlbums()
		}
	}, [display])

	useEffect(() => {
		setDisplay(logged)
	}, [logged])

	/* ------ */

	const [data, setData] = useState(getDefaultState(year))

	const getStorageData = () => {
		const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		if (isDataType(storage)) {
			log('[getStorageData] Storage retrieved')
			return storage
		}

		log('[getStorageData] No storage retrieved')
		return null
	}
	const setStorageData = (data: any) => {
		console.log('setStorageData', data)
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	}
	const resetStorageData = () => {
		localStorage.removeItem(STORAGE_KEY)
	}

	const initData = () => {
		const storage = getStorageData()
		const isValid =
			storage &&
			moment().diff(moment(storage?.lastUpdate), 'minutes') < STORAGE_MINS
		console.log('[init] isValid:', isValid, storage)
		return isValid ? storage : getDefaultState(year)
	}

	const updateData = (newData: any, action: string = 'update') => {
		newData.lastUpdate = Date.now()
		newData.lastAction = action
		setData(newData)
		setStorageData(newData)
		setAlbums(newData.years[year].albums)
	}

	const updateAlbums = (
		newAlbums: LibraryAlbum[],
		reset: boolean = false
	) => {
		const tmp = [...albums, ...newAlbums]

		const dataX = data
		dataX.years[year].albums = tmp
		updateData(dataX, 'albumUpdate')

		// setAlbums(tmp)
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
			if (
				isLibraryItemYearKey(element) &&
				data.years[year][element].includes(albumId)
			) {
				actionId = element
				return false
			}
			return true
		})

		console.log('getAlbumCategory =>', albumId, actionId)
		return actionId
	}

	const albumHasCategory = (albumId: string) => {
		return getAlbumCategory(albumId) ? true : false
	}

	const getFirstAlbumIdWithoutCategory = () => {
		// todo : prendre en compte le displayedId
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

	const onAlbumTabDelete = (identifier: string, albumId: string) => {
		log('[onAlbumTabDelete] callback:', identifier, albumId)
	}

	const onAlbumTabTodo = (identifier: string, albumId: string) => {
		log('[onAlbumTabTodo] callback:', identifier, albumId)
	}

	const onAlbumTabCancel = (identifier: string, albumId: string) => {
		log('[onAlbumTabCancel] callback:', identifier, albumId)
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
			<ul className="flex flex-row flex-wrap gap-2 justify-center py-2">
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
				<li>
					<Button Style="Filled" onClick={() => resetStorageData()}>
						resetStorage()
					</Button>
				</li>
			</ul>
		)
	}

	const debug = false
	const renderDebugArrows = () =>
		debug && (
			<div className={'flex flex-row items-center justify-between py-4'}>
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

	// region test

	const getNextAlbum = () => {
		const next = albums[displayedAlbumId]
		if (next && !albumHasCategory(next.id)) {
			console.log('getNextAlbum.next', next)
			return next
		}

		const nextIndex = getFirstAlbumIdWithoutCategory()
		if (
			nextIndex !== null &&
			albums[nextIndex] &&
			!albumHasCategory(nextIndex)
		) {
			setDisplayedAlbumId(nextIndex)
			return albums[nextIndex]
		}
		return false
	}
	const renderAlbums = () => {
		console.log('renderAlbums albums.length:', albums.length)

		getNextAlbum()
		console.log('displayedAlbumId', displayedAlbumId)

		return albums.length ? (
			getNextAlbum() ? (
				<>
					<LibraryAlbum
						album={albums[displayedAlbumId]}
						displayedAlbumId={displayedAlbumId}
					/>
					{renderDebugArrows()}
				</>
			) : (
				'No album left'
			)
		) : (
			'No albums to display yet'
		)
	}

	const renderNewAlbums = () => {
		return 'Nope.'

		if (!albums.length) {
			return 'No card to display'
		}

		if (!getNextAlbum()) {
			return 'No card left'
		}

		// todo useMemo/ref=childRef ...

		return (
			<>
				{' '}
				<div className="cardContainer">
					{albums.map((album, index) => (
						<TinderCard
							// ref={albums[index]}
							className="swipe"
							onSwipe={(dir) => {
								console.log('(onSwipe)', dir)
								switch (dir) {
									case 'left':
										break
									case 'right':
										break
									case 'up':
									case 'down':
										break
								}
								// alert('(onSwipe) dir:' + dir)
							}}
							onCardLeftScreen={(dir) => {
								console.log('(onCardLeftScreen)', dir)
								switch (dir) {
									case 'left':
										onAlbumSkip()
										break
									case 'right':
										onAlbumSelect()
										break
									case 'up':
									case 'down':
										onAlbumTodo()
										break
								}
							}}
						>
							<LibraryAlbum
								key={`album-${index}`}
								// album={albums[displayedAlbumId]}
								// displayedAlbumId={displayedAlbumId}
								album={album}
								displayedAlbumId={displayedAlbumId}
							/>
						</TinderCard>
					))}
				</div>
				{renderDebugArrows()}
			</>
		)
	}
	// endregion test

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

	// region render Tabs

	const renderTab = (index: number, content: React.JSX.Element) => {
		return (
			<div
				// className={`${styles.page} ${
				className={`${styles.tab} ${
					(tab === index && styles.show) || ''
				}`}
			>
				{content}
			</div>
		)
	}

	const renderTabPicker = () => {
		return (
			<>
				<section id="topButtons">
					<div>
						<h3>TopButtons</h3>
					</div>
					{renderTopButtons()}
				</section>

				<section
					className="flex flex-col justify-center"
					id="albumsOld"
				>
					<div>
						<h3>Albums {loading ? '(LOADING...)' : ''}</h3>
					</div>

					<div className="max-w-sm">
						{renderAlbums()}

						{/* Action buttons */}
						{actionButtons()}

						{renderTotal()}
					</div>
				</section>

				<section id="albums">
					<h3>Albums cards {loading ? '(LOADING...)' : ''}</h3>

					{/* <div className="py-4"> */}
					{renderNewAlbums()}
				</section>

				<section id="debug">
					{/* <div className="py-4"> */}
					<h3>Debug API</h3>
					<ul>
						<li>displayedAlbumId : {displayedAlbumId}</li>
					</ul>
					<div>
						Nb: {albums ? albums.length : 'NULL'} -{' '}
						{albumFetching ? `Fetching page ${apiPage}...` : 'Done'}
					</div>
					<div>apiPage : {apiPage}</div>
					<div>Tab : {tab}</div>
					<Button
						Style="Bezeled"
						onClick={() => displayFirstAlbumWithoutCategory()}
					>
						displayFirstAlbumWithoutCategory()
					</Button>
					<Button Style="Bezeled" onClick={() => console.log(data)}>
						DATA
					</Button>
				</section>
			</>
		)
	}

	// endregion render Tabs

	const render = () => {
		return (
			<>
				<div className={styles.page}>
					<h2>Hello</h2>

					<SegmentedControls
						controlRef={tabsRef}
						name={'yoo'}
						items={tabsItems}
						selected={tab}
						onSelect={(index, prev, item) => {
							log('(onSelectSegment)', index, prev, item)
							setTab(index)
						}}
						// style={{ width: '100%' }}
					/>

					<div className="overflow-y-auto	">
						{renderTab(0, renderTabPicker())}
						{renderTab(
							1,
							<TopTab
								identifier="picked"
								albums={data.years[year].albums}
								picked={data.years[year].picked}
								//
								canCancel={true}
								onCancel={onAlbumTabCancel}
								canTodo={true}
								onTodo={onAlbumTabTodo}
								canDelete={true}
								onDelete={onAlbumTabDelete}
							/>
						)}
						{renderTab(
							2,
							<TodoTab
								identifier="todo"
								albums={data.years[year].albums}
								todo={data.years[year].todo}
								//
								canCancel={true}
								onCancel={onAlbumTabCancel}
								canDelete={true}
								onDelete={onAlbumTabDelete}
							/>
						)}
					</div>
				</div>
			</>
		)
	}

	return <>{(display && render()) || 'Please log in'}</>
}

export default AlbumPicker
