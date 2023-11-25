import { Inter } from 'next/font/google'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import LibraryAlbum from '@/components/LibraryAlbum/LibraryAlbum'
import {
	IoArrowBack,
	IoArrowForward,
	IoPauseOutline,
	IoPauseSharp,
	IoPlaySharp,
} from 'react-icons/io5'
import MusicProvider from '@/core/MusicKitProvider'
import { LIBRARY_ALBUMS_API_RESPONSE } from '@/data/LibraryAlbumsExample'
import { Nav } from '@/components/Nav/Nav'
import { Home } from '@/components/Home/Home'
import MusicKitProvider from '@/components/Providers/MusicKitProvider'
import MyComponent from '@/components/Tests/MyComponent'
import Button from '@/components/AM/Button'

const inter = Inter({ subsets: ['latin'] })

const log = (...args: any) => {
	console.log('%c[index]', 'color:cyan', ...args)
}

// static props
export const getStaticProps = async () => {
	const libraryAlbums: LibraryAlbum[] = LIBRARY_ALBUMS_API_RESPONSE.data
	return {
		props: {
			libraryAlbums: [] as LibraryAlbum[],
			// libraryAlbums: libraryAlbums,
		},
		revalidate: 3600,
	}
}

// todo : Error wrap si erreur de chargement du musicKit
const Landing: NextPage<{ libraryAlbums: LibraryAlbum[] }> = ({
	libraryAlbums,
}) => {
	const [loading, setLoading] = useState<boolean>(false)
	const [musicKit, setMusicKit] = useState<MusicKit.MusicKitInstance>(
		{} as MusicKit.MusicKitInstance
	)

	const apiLimit = 100

	const [albumFetching, setAlbumFetching] = useState<boolean>(false)
	const [displayedAlbumId, setDisplayedAlbumId] = useState<number>(0)
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
	const [albums, setAlbums] = useState<Array<any>>(libraryAlbums)
	const [apiPage, setApiPage] = useState<number>(1)
	const [fetchComplete, setFetchComplete] = useState<boolean>(false)
	const [loop, setLoop] = useState<boolean>(false)

	const loopMaxPage = 999
	let loopPages: number[] = []

	const loadMusicKit = () => {
		console.log('loadMusicKit')

		let musicProvider = MusicProvider.sharedProvider()
		console.log('musicProvider', musicProvider)

		musicProvider.configure()

		setMusicKit(musicProvider.getMusicInstance())

		// let musicInstance = musicProvider.getMusicInstance();
		// console.log('musicInstance', musicInstance);
		// console.log('musicProvider.getMusicInstance()', musicProvider.getMusicInstance());

		// setMusicKit(musicInstance);
	}

	const loadAllAlbums = () => {
		setAlbumFetching(true)
		setLoop(true)
	}

	const loadAlbums = (data: any = {}) => {
		console.log(
			'loadAlbums',
			{
				isAuthorized: isAuthorized,
				fetchComplete: fetchComplete,
				apiPage: apiPage,
				loop: loop,
				loopMaxPage: loopMaxPage,
				data: data,
			},
			data
		)

		if (!isAuthorized || !musicKit || !musicKit.api) {
			return
		}

		setLoading(true)

		console.log('loadAlbums: musicKit.api', musicKit.api)
		console.log('loadAlbums: musicKit.api.library', musicKit.api.library)

		const params: MusicKit.QueryParameters = {
			limit: apiLimit,
			offset: (apiPage - 1) * apiLimit,
		}

		console.log('loadAlbums: params:', params)

		return musicKit.api.library
			.albums(null, params)
			.then((response: MusicKit.Resource[]) => {
				console.log('loadAlbums OK: response', response)

				if (response !== undefined && !response.length) {
					console.log('loadAlbums COMPLETE')
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
					console.log('loadAlbums[V]: setAlbums:', [
						...albums,
						...yearAlbums,
					])
					setAlbums([...albums, ...yearAlbums])
				}
				setLoading(false)
				setApiPage(apiPage + 1)

				console.log('loadAlbums[V]: albums:', albums)
				console.log('loadAlbums[V]: apiPage:', apiPage)
			})
			.catch((error: any) => {
				console.error('loadAlbums OK: error', error)
				setLoading(false)
			})
	}

	useEffect(() => {
		log('useEffect[isAuthorized]:', isAuthorized)

		if (isAuthorized) {
			loadAlbums()
		}
	}, [isAuthorized])

	useEffect(() => {
		log('useEffect[musicKit?.isAuthorized]:', musicKit?.isAuthorized)

		loadMusicKit()
		setIsAuthorized(musicKit?.isAuthorized || false)
		setLoop(false)
	}, [musicKit?.isAuthorized])

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

	const handleLogin = (mk: MusicKit.MusicKitInstance) => {
		log('(handleLogin) mk:', mk)

		setMusicKit(mk)
		setIsAuthorized(mk?.isAuthorized || false)
		loadAlbums()
	}

	const handleLogout = () => {
		log('(handleLogout)')

		if (!musicKit) {
			setIsAuthorized(false)
			return musicKit
		}

		musicKit.unauthorize()
		setMusicKit(musicKit)
		setIsAuthorized(false)
		resetPage()

		return musicKit
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

	const testButtonsType = [
		{
			Style: 'Borderless',
			Icon: IoPlaySharp,
		},
		{
			Style: 'BelezedGray',
			Icon: IoPlaySharp,
		},
		{
			Style: 'Belezed',
			Icon: IoPlaySharp,
		},
		{
			Style: 'Filled',
			Icon: IoPlaySharp,
		},
	]

	const testButtons = () => {
		let buttons: any[] = []

		let labelTypeButtons: any[] = []
		testButtonsType.forEach((button) => {
			labelTypeButtons = [
				...labelTypeButtons,
				{
					...button,
					LabelType: 'SymbolText',
				},
				{
					...button,
					LabelType: 'Symbol',
				},
				{
					...button,
					LabelType: 'Text',
				},
			]
		})
		// return labelTypeButtons

		let sizeButtons: any[] = []
		labelTypeButtons.forEach((button) => {
			sizeButtons = [
				...sizeButtons,
				{
					...button,
					Size: 'Small',
				},
				{
					...button,
					Size: 'Medium',
				},
				{
					...button,
					Size: 'Large',
				},
			]
		})
		return sizeButtons
	}

	return (
		<>
			<MusicKitProvider>
				<Nav
					musicKit={musicKit}
					onLogin={handleLogin}
					onLogout={handleLogout}
				/>

				<Button Style="Filled" className="w-[50px]">
					Coucou
				</Button>

				<Button
					Size="Medium"
					Style="Filled"
					className="w-[50px]"
					style={{
						backgroundColor: 'green',
					}}
					textStyle={{
						color: 'red',
					}}
					iconStyle={{
						color: 'yellow',
						// fontSize: 50,
					}}
					LabelType="TextSymbol"
					Icon={IoPauseSharp}
				>
					Pause
				</Button>

				<div className={'grid grid-cols-3 gap-2 p-4 bg-[#ccc]'}>
					{testButtons().map((buttonType) => {
						const newCollection = [
							{
								...buttonType,
								OnMaterialState: false,
								State: true,
							},
							{
								...buttonType,
								OnMaterialState: true,
								State: true,
							},
							{
								...buttonType,
								OnMaterialState: false,
								State: false,
							},
							{
								...buttonType,
								OnMaterialState: true,
								State: false,
							},
						]

						return (
							<div className="grid grid-cols-2 grid-rows-2 border-2 p-2">
								{newCollection.map((button) => {
									return (
										<Button
											Size={button.Size}
											Style={button.Style}
											State={button.State}
											OnMaterialState={
												button.OnMaterialState
											}
											Icon={button.Icon}
											LabelType={button.LabelType}
										>
											Play
										</Button>
									)
								})}
							</div>
						)
					})}
				</div>

				<MyComponent test={'OUIIII'} />

				<main
					className={`flex min-h-screen flex-col items-center p-12 ${inter.className}`}
				>
					<Home musicKit={musicKit} />

					{isAuthorized ? (
						<>
							<div className="flex flex-row flex-wrap gap-2">
								<button onClick={() => loadAlbums()}>
									loadAlbums()
								</button>
								<button onClick={() => loadAllAlbums()}>
									loadAllAlbums()
								</button>
								<button onClick={() => stopLoading()}>
									stopLoading()
								</button>
								<button onClick={() => resetPage()}>
									resetPage()
								</button>
							</div>

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
											onClick={() =>
												handlePrevNext('prev')
											}
										/>
										<IoArrowForward
											size={48}
											className="cursor-pointer"
											onClick={() =>
												handlePrevNext('next')
											}
										/>
									</div>
								</>
							) : (
								'No albums to display yet'
							)}
						</>
					) : (
						'Please log in'
					)}

					<div className="">
						{loading ? 'LOADING...' : ''}

						<br />
						<div>
							Nb: {albums ? albums.length : 'NULL'} -{' '}
							{albumFetching
								? `Fetching page ${apiPage}...`
								: 'Done'}
						</div>
						<div>Page : {apiPage}</div>
					</div>
				</main>
			</MusicKitProvider>
		</>
	)
}

export default Landing
