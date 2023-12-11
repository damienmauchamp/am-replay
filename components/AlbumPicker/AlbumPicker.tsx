import React, {useEffect, useRef, useState} from 'react'
import LibraryAlbum from '../Elements/LibraryAlbum/LibraryAlbum'
import Button from '../AppleMusic/Buttons/Button'
import {IoArrowBack, IoArrowForward} from 'react-icons/io5'
import {logDebug} from '@/helpers/debug'
import {useMusicKitContext} from '@/context/MusicKitContext'
import tailwindConfig, {iOSTheme} from '@/tailwind.config'
import TinderCard from 'react-tinder-card'
import SegmentedControls from '../AppleMusic/SegmentedControls/SegmentedControls'
import styles from './AlbumPicker.module.css'
import TopTab from './Tabs/TopTab'
import TodoTab from './Tabs/TodoTab'
import moment from 'moment-timezone'

/**
 * @todo save before closing
 */

const log = (...args: any) => {
	logDebug('AlbumPicker', 'teal', ...args)
}

const DATATYPE_CODE = 'DataType'
const STORAGE_KEY = 'amrStoragePicker'
const STORAGE_EXPIRING = false
const STORAGE_MINS = 3600
const CURRENT_YEAR = new Date().getFullYear()

interface AlbumPickerProps {
}

type YearType = {
	albums: LibraryAlbum[]
	picked: string[]
	todo: string[]
	skipped: string[]
}
type APIDataType = {
	page: number
}
type ActionType = {
	timestamp: number
	action: string
}
type DataType = {
	// years: YearType[]
	years: { [year: number]: YearType }
	// cache: {
	// 	page: null,
	// },
	timestamp: number
	lastUpdate: number
	lastAction: string
	currentYear: number
	actions: ActionType[]
	type: string
	api: APIDataType
}

// todo : cache, localStorage, save before closing, button save, ...
const DEFAULT_YEAR_TYPE: APIDataType = {
	page: 1
}

// const DEFAULT_YEARLY: YearType = {
// 	albums: [] as LibraryAlbum[],
// 	picked: [] as string[],
// 	todo: [] as string[],
// 	skipped: [] as string[],
// 	// api: {...DEFAULT_YEAR_TYPE} as APIDataType,
// }

const getDefaultYearlyState = () => ({
	albums: [] as LibraryAlbum[],
	picked: [] as string[],
	todo: [] as string[],
	skipped: [] as string[],

	// const array = DEFAULT_YEARLY
	// array.albums =[]
	// array.picked =[]
	// array.todo =[]
	// array.skipped =[]
	// return DEFAULT_YEARLY
	// return {...DEFAULT_YEARLY}
	// return {...DEFAULT_YEARLY, api: {...DEFAULT_YEAR_TYPE}}
})

const getDefaultState = (year: number): DataType => ({
	years: {
		[year]: getDefaultYearlyState(),
	},
	timestamp: Date.now(),
	lastUpdate: Date.now(),
	currentYear: CURRENT_YEAR,
	actions: [],
	lastAction: 'init',
	type: DATATYPE_CODE,
	api: DEFAULT_YEAR_TYPE,
})

const isDataType = (obj: any): obj is DataType => {
	return obj.type === DATATYPE_CODE
}

const AlbumPicker: React.FC<AlbumPickerProps> = ({...props}) => {
	const {loading, logged, getInstance, isAuthorized} = useMusicKitContext()
	const [display, setDisplay] = useState<boolean>(false)

	const apiLimit = 100,
		loopMaxPage = 999

	let loopPages: number[] = []

	const [albumLoading, setAlbumLoading] = useState<boolean>(false)

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
		{label: 'Top', value: 'top', ref: useRef()},
		{
			label: 'Todolist',
			value: 'todolist',
			ref: useRef(),
		},
	]
	const [tab, setTab] = useState<number>(0)

	// region Year
	const [needsToFetchAlbums, setNeedsToFetchAlbums] = useState<boolean>(false)
	const [year, setYear] = useState<number>(CURRENT_YEAR)
	const yearRef = useRef<HTMLSelectElement>(null);
	const startYear = 1950;
	const yearRange = () => {
		let years = []
		for (let y = startYear; y <= CURRENT_YEAR; y++) {
			years.push(y)
		}
		return years
	}
	const initYearAlbum = (newYear?: number, save: boolean = true) => {
		let newData = data
		newYear = newYear || year
		if (!newData.years[newYear]) {
			newData.years[newYear] = getDefaultYearlyState()
		}
		if (save) {
			updateData(newData, `setYearTo${newYear}`)
		}
		return newData
	}
	const onYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		// console.clear()
		setYear(Number(event.currentTarget.value))
	}

	useEffect(() => {
		console.log('YEAR CHANGED', year)

		// readying data for the new year
		initYearAlbum()

		// need to fetch if no next
		if (!getNextAlbum()) {
			console.log('need to fetch')
			loadAlbums() // todo : fetch until
		}

		// reset displayedId
		// setDisplayedAlbumId(0)

		console.log('DONE YEAR CHANGE')
	}, [year])

	// region YearAPI
	const [apiPage, setApiPage] = useState<number>(1)
	// const getApiPage = (apiYear?: number | string) => {
	// 	apiYear = Number(apiYear || year)
	// 	return data.years[apiYear]?.api?.page || 1
	// }
	// endregion YearAPI

	// endregion Year

	const loadAllAlbums = () => {
		setAlbumFetching(true)
		setLoop(true)
	}

	const loadAlbums = (options: any = {}) => {
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
				options: options,
			},
			options
		)

		if (!logged || !isAuthorized()) {
			return
		}

		setAlbumLoading(true)

		const params: MusicKit.QueryParameters = {
			limit: apiLimit,
			offset: (apiPage - 1) * apiLimit,
		}

		log('loadAlbums: getInstance().api', getInstance().api)
		log('loadAlbums: getInstance().api.library', getInstance().api.library)
		log('loadAlbums: [albums] params:', params)
		log('loadAlbums: [albums] year:', year)
		log('loadAlbums: [albums] options:', options)

		let loopData = data;
		log('loadAlbums[V]: loopData', JSON.stringify(loopData))

		return getInstance()
			.api.library.albums(null, params)
			.then((response: MusicKit.Resource[]) => {
				log('loadAlbums OK: response', response)

				if (response !== undefined && !response.length || !response) {
					log('loadAlbums COMPLETE')
					setFetchComplete(true)
					setAlbumLoading(false)
					setAlbumFetching(false)
					return
				}

				const libraryAlbums: LibraryAlbum[] = response.filter(
					(a) =>
						!String(a.attributes.name).endsWith('- Single') &&
						!String(a.attributes.name).endsWith('- EP') &&
						a.attributes.releaseDate
					// && String(a.attributes.artwork.url)
				) as LibraryAlbum[]

				log('loadAlbums[V]: libraryAlbums', libraryAlbums)

				libraryAlbums.forEach(newAlbum => {
					const albumReleaseDate = newAlbum.attributes.releaseDate;
					const matches = String(albumReleaseDate).match(/(\d{4})-\d{2}-\d{2}/)
					if (!matches) {
						return true;
					}

					const albumYear = Number(matches[1]);
					if (!loopData.years[albumYear]) {
						loopData = initYearAlbum(albumYear, false)
					}

					if (loopData.years[albumYear].albums.find((a: LibraryAlbum) => a.id === newAlbum.id)) {
						// already in there
						return true;
					}

					// ok
					loopData.years[albumYear].albums.push(newAlbum)
				})
				log('loadAlbums[V]: loopData:', loopData)
				if (!loopData) {
					console.error('nOOOOOOOOOOO loopData')
					return false;
				}

				updateData(loopData, 'fetching')

				setAlbumLoading(false)
				setApiPage(apiPage + 1)

				log('loadAlbums[V]: albums:', albums)
				log('loadAlbums[V]: apiPage:', apiPage)
			})
			.catch((error: any) => {
				console.error('loadAlbums OK: error', error)
				setAlbumLoading(false)
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
		updateData(getDefaultState(year), 'resetPage')
		setDisplayedAlbumId(0)
		setApiPage(1)
	}

	useEffect(() => {
		console.log(`Component AlbumPicker mounted.`)

		// if (getStorageData()) {
		// 	setData(getStorageData())
		// }
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

	const updateApiPage = () => {
		updateData({...data, api: apiPage}, `setApiPage(${apiPage},${year}):`)
	}
	useEffect(() => {
		console.log('API PAGE CHANGED', apiPage)

		updateApiPage()

	}, [apiPage])

	useEffect(() => {
		console.log('API/LOOP PAGE CHANGED', apiPage, loop, {
			needsToFetchAlbums: needsToFetchAlbums,
		})

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

		// todo : if !isFetching?
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
		const isValid = !STORAGE_EXPIRING && storage &&
			moment().diff(moment(storage?.lastUpdate), 'minutes') < STORAGE_MINS
		return isValid ? storage : getDefaultState(year)
	}

	const updateData = (newData: any, action: string = 'update', yearData?: number | string) => {
		const timestamp = Date.now();
		newData.lastUpdate = timestamp
		newData.lastAction = action

		newData.actions = newData.actions || []
		newData.actions.push({
			timestamp: timestamp,
			action: action,
		})

		yearData = yearData || year

		setAlbums(newData.years[yearData].albums)
		setData(newData)
		setStorageData(newData)
		// setApiPage(getApiPage(yearData))
	}

	useEffect(() => {
		console.log('DATA CHANGED')
	}, [data]);
	useEffect(() => {
		console.log('ALBUMS CHANGED')
		getNextAlbum()
	}, [albums]);

	const updateAlbums = (
		newAlbums: LibraryAlbum[]
	) => {
		// const tmp = [...albums, ...newAlbums]

		const dataX = data

		// dataX.years[year].albums = tmp
		log('loadAlbums[V]: updateAlbums:', [...dataX.years[year].albums, ...newAlbums])
		dataX.years[year].albums = [...dataX.years[year].albums, ...newAlbums]
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
		if (!data.years[year]) {
			return null;
		}

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
		return actionId
	}

	const albumHasCategory = (albumId: string) => !!getAlbumCategory(albumId)

	const getFirstAlbumIdWithoutCategory = () => {
		// todo : start from displayedId ?
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
			<ul className="grid grid-cols-2 md:grid-cols-4 gap-2 justify-center py-2">
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

		const allllllll = data.years[year]?.albums || []
		const nextIndex = getFirstAlbumIdWithoutCategory()

		if (nextIndex === null) {
			return false
		}

		if (allllllll[nextIndex]) {
			if (displayedAlbumId !== nextIndex) {
				setDisplayedAlbumId(nextIndex)
			}
			return allllllll[nextIndex]
		}
		return false
	}
	const renderAlbums = () => {
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
					<hr/>
					<li>
						Albums counts : {data.years[year]?.albums?.length || 0}
					</li>
					<li>Picked : {data.years[year]?.picked?.length || 0}</li>
					<li>TODO : {data.years[year]?.todo?.length || 0}</li>
					<li>Skipped : {data.years[year]?.skipped?.length || 0}</li>
					<hr/>
					<li>Displayed ID : {displayedAlbumId}</li>
					<hr/>
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
					className="flex flex-col  "
					id="albumsOld"
				>
					<h3>Albums {albumLoading ? '(LOADING...)' : ''}</h3>
					<div className='flex flex-col justify-center items-center'>

						<div className="flex flex-col gap-4 max-w-sm">
							{renderAlbums()}

							{/* Action buttons */}
							{actionButtons()}

							{renderTotal()}
						</div>
					</div>
				</section>

				<section id="albums">
					<h3>Albums cards {albumLoading ? '(LOADING...)' : ''}</h3>

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
					<h2>Current year : {year} (p. {apiPage})</h2>

					<select ref={yearRef}
						style={{background: 'black', color: 'white'}}
						value={year}
						onChange={onYearChange}>
						{yearRange().map(y => {
							return <option key={y} value={y}>{y}</option>
						})}
					</select>

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
								albums={data.years[year]?.albums || []}
								picked={data.years[year]?.picked || []}
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
								albums={data.years[year]?.albums || []}
								todo={data.years[year]?.todo || []}
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

	return <>{(display && render()) || (loading && 'Loading...') || 'Please log in'}</>
}

export default AlbumPicker
