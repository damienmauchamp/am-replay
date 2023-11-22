import Image from 'next/image'
import { Inter } from 'next/font/google'
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import LibraryAlbum from '@/components/LibraryAlbum/LibraryAlbum';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import MusicProvider from '@/core/MusicKitProvider';
import AMLoginButton from '@/components/AMLoginButton/AMLoginButton';
import { LIBRARY_ALBUMS_API_RESPONSE } from '@/data/LibraryAlbumsExample'

const inter = Inter({ subsets: ['latin'] })

// static props
export const getStaticProps = async() => {
	const libraryAlbums: LibraryAlbum[] = LIBRARY_ALBUMS_API_RESPONSE.data;
	return {
		props: {
			libraryAlbums: [] as LibraryAlbum[],
			// libraryAlbums: libraryAlbums,
		},
		revalidate: 3600,
	}
}


// todo : Error wrap si erreur de chargement du musicKit
const Home: NextPage<{ libraryAlbums: LibraryAlbum[] }> = ({ libraryAlbums }) => {

	const apiLimit = 100;

	const [loading, setLoading] = useState<boolean>(false)
	const [albumFetching, setAlbumFetching] = useState<boolean>(false)
	const [musicKit, setMusicKit] = useState<MusicKit.MusicKitInstance>()
	const [displayedAlbumId, setDisplayedAlbumId] = useState<number>(0)
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
	const [albums, setAlbums] = useState<Array<any>>(libraryAlbums)
	const [apiPage, setApiPage] = useState<number>(1)
	const [fetchComplete, setFetchComplete] = useState<boolean>(false)
	const [loop, setLoop] = useState<boolean>(false)
	
	const loopMaxPage = 999;
	let loopPages: number[] = []

	const loadMusicKit = () => {
		console.log('loadMusicKit')

		let musicProvider = MusicProvider.sharedProvider();
		console.log('musicProvider', musicProvider);
		
		musicProvider.configure();

		setMusicKit(musicProvider.getMusicInstance());
		
		// let musicInstance = musicProvider.getMusicInstance();
		// console.log('musicInstance', musicInstance);
		// console.log('musicProvider.getMusicInstance()', musicProvider.getMusicInstance());
		
		// setMusicKit(musicInstance);
	}

	const loadAllAlbums = () => {
		setAlbumFetching(true)
		setLoop(true);
	}

	const loadAlbums = (data: any = {}) => {

		console.log('loadAlbums', {
			isAuthorized: isAuthorized,
			fetchComplete: fetchComplete,
			apiPage: apiPage,
			loop: loop,
			loopMaxPage: loopMaxPage,
			data: data,
		}, data)

		if (!isAuthorized || !musicKit || !musicKit.api) {
			return;
		}
		
		setLoading(true)

		console.log('loadAlbums: musicKit.api', musicKit.api)
		console.log('loadAlbums: musicKit.api.library', musicKit.api.library)

		const params :MusicKit.QueryParameters = {
			limit: apiLimit,
			offset: (apiPage - 1) * apiLimit
		}
		
		console.log('loadAlbums: params:', params)

		return musicKit.api.library.albums(null, params).then((response: MusicKit.Resource[]) => {

			console.log('loadAlbums OK: response',  response)

			if (response !== undefined && !response.length) {
				console.log('loadAlbums COMPLETE')
				setFetchComplete(true)
				setLoading(false)
				setAlbumFetching(false)
				return;
			}

			const libraryAlbums :LibraryAlbum[] = response as LibraryAlbum[]

			// filtering
			const year = 2023;
			const onlyAlbums :LibraryAlbum[] = libraryAlbums.filter(a => !String(a.attributes.name).endsWith('- Single')
														&& !String(a.attributes.name).endsWith('- EP')
														// && String(a.attributes.artwork.url)
														)
			const yearAlbums :LibraryAlbum[] = onlyAlbums.filter(a => String(a.attributes.releaseDate).startsWith(`${year}-`))

			if (yearAlbums.length) {
				console.log('loadAlbums[V]: setAlbums:', [...albums, ...yearAlbums])
				setAlbums([...albums, ...yearAlbums])
			}
			setLoading(false)
			setApiPage(apiPage + 1)

			console.log('loadAlbums[V]: albums:', albums)
			console.log('loadAlbums[V]: apiPage:', apiPage)

		}).catch((error:any) => {
			console.error('loadAlbums OK: error', error)
			setLoading(false)
		})
	}

	useEffect(() => {
		if (isAuthorized) {
			loadAlbums()
		}
	}, [isAuthorized])

	useEffect(() => {
		console.log('useEffect', process.env);
		loadMusicKit();
		setIsAuthorized(musicKit?.isAuthorized || false)
		setLoop(false);
	}, [musicKit?.isAuthorized]);

	useEffect(() => {
		console.log('useEffect.loop', loop);
		if (!loop) {
			setAlbumFetching(false)
			return;
		}

		if (fetchComplete || apiPage > loopMaxPage) {
			console.log('stop');
			setAlbumFetching(false)
			setLoop(false)
			return;
		}

		if (loopPages.includes(apiPage)) {
			console.log('bah wtf?', apiPage)
			setAlbumFetching(false)
			setLoop(false)
			return;
		}

		loopPages.push(apiPage)

		loadAlbums();
	}, [apiPage, loop])
	  
	const handlePrevNext = (direction: string) => {

		let numberLibraryAlbums = albums.length
		let thisDisplayedAlbumId = displayedAlbumId

		switch(direction) {
			case 'prev':
				thisDisplayedAlbumId--
				if(thisDisplayedAlbumId < 0) {
					thisDisplayedAlbumId = numberLibraryAlbums - 1
				}  
				break;
			case 'next': 
				thisDisplayedAlbumId++
				if(thisDisplayedAlbumId >= numberLibraryAlbums) {
					thisDisplayedAlbumId = 0
				}
				break;
			default: return;
		}

		setDisplayedAlbumId(thisDisplayedAlbumId)
	}

	const handleLogout = () => {
		if (!musicKit) {
			setIsAuthorized(false)
			return;
		}

		musicKit.unauthorize().then((response: any) => {
			setMusicKit(musicKit)
			setIsAuthorized(false)
		}).catch(console.error)
	}

	const updateMusicKit = (mk: any) => {
		setMusicKit(mk)
		setIsAuthorized(mk?.isAuthorized || false)
		loadAlbums()
	}

	const stopLoading = () => {
		setLoop(false);
	}

	const resetPage = () => {
		stopLoading()
		setAlbums([])
		setApiPage(1);
	}

	return (
		<main className={`flex min-h-screen flex-col items-center justify-between p-12 ${inter.className}`}>

			<nav className='flex flex-row flex-wrap gap-2'>
				AM : <AMLoginButton musicKit={musicKit}
									updateMusicKit={updateMusicKit}/>
				{isAuthorized ? 
					<>
						<br/>
						<button onClick={handleLogout}>Logout</button>
					</>
					: ''}
				{isAuthorized ? 
					<>
						<br/>
						<button onClick={() => loadAlbums()}>loadAlbums()</button>
					</>
					: ''}
				{isAuthorized ? 
					<>
						<br/>
						<button onClick={() => loadAllAlbums()}>loadAllAlbums()</button>
					</>
					: ''}
				{isAuthorized ? 
					<>
						<br/>
						<button onClick={() => stopLoading()}>stopLoading()</button>
					</>
					: ''}
				{isAuthorized ? 
					<>
						<br/>
						<button onClick={() => resetPage()}>resetPage()</button>
					</>
					: ''}
			</nav>

			<div className=''>
				{loading ? 'LOADING...' : ''}
				

				{ albums.length
					?  <>
						<LibraryAlbum album={albums[displayedAlbumId]}
									displayedAlbumId={displayedAlbumId}/>

							<div className={'flex flex-row items-center justify-between py-4'}>
								<IoArrowBack size={48} className="cursor-pointer" onClick={() => handlePrevNext('prev')} />
								<IoArrowForward size={48} className="cursor-pointer" onClick={() => handlePrevNext('next')} />
							</div>
						</>
					: 'No albums to display yet'}

				<br />
				<div>Nb: { albums ? albums.length : 'NULL'} - {albumFetching ? `Fetching page ${apiPage}...` : 'Done'}</div>
				<div>Page : { apiPage }</div>
			</div>
		</main>
	)

}

export default Home;