import Image from 'next/image'
import { Inter } from 'next/font/google'
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import LibraryAlbum from '@/components/LibraryAlbum/LibraryAlbum';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import MusicProvider from '@/core/MusicKitProvider';
import AMLoginButton from '@/components/AMLoginButton/AMLoginButton';


const inter = Inter({ subsets: ['latin'] })

const LIBRARYALBUMS = [
	{
		id: "l.sticiFl",
		type: "library-albums",
		href: "/v1/me/library/albums/l.sticiFl",
		attributes: {
			trackCount: 15,
			genreNames: [
				"Country"
			],
			releaseDate: "2022-02-11",
			name: "Bronco",
			artistName: "Orville Peck",
			artwork: {
				"width": 1200,
				"height": 1200,
				"url": "https://is3-ssl.mzstatic.com/image/thumb/Music116/v4/6d/de/02/6dde02ae-a9fe-f96e-e81f-4f18ad13d2f9/886449873302.jpg/{w}x{h}bb.jpg"
			},
			playParams: {
				"id": "l.sticiFl",
				"kind": "album",
				"isLibrary": true
			},
			dateAdded: "2022-08-06T02:18:57Z"
		}
	},
	{
		id: "l.OGRixf5",
		type: "library-albums",
		href: "/v1/me/library/albums/l.OGRixf5",
		attributes: {
			trackCount: 14,
			genreNames: [
				"Alternative"
			],
			releaseDate: "2022-03-12",
			name: "Dance Fever",
			artistName: "Florence + the Machine",
			artwork: {
				"width": 1200,
				"height": 1200,
				"url": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/93/ce/c5/93cec50d-bb01-3a42-364a-54af31cd73c7/22UMGIM23127.rgb.jpg/{w}x{h}bb.jpg"
			},
			playParams: {
				"id": "l.OGRixf5",
				"kind": "album",
				"isLibrary": true
			},
			dateAdded: "2022-08-06T02:18:51Z"
		}
	}
]

// https://developer.apple.com/documentation/applemusicapi/get_all_library_albums
// GET https://api.music.apple.com/v1/me/library/albums
const LIBRARY_ALBUMS_API_RESPONSE = {
	next: "/v1/me/library/albums?offset=2",
	data: LIBRARYALBUMS
};

//
// let musicProvider = MusicProvider.sharedProvider();
// musicProvider.configure();
// let musicInstance = musicProvider.getMusicInstance();
//

export const getStaticProps = async() => {
	const libraryAlbums: LibraryAlbum[] = LIBRARY_ALBUMS_API_RESPONSE.data;
	return {
		props: {
			// libraryAlbums: libraryAlbums,
			libraryAlbums: [],
		},
		revalidate: 3600,
	}
}


// todo : Error wrap si erreur de chargement du musicKit
// const Home: NextPage<{ libraryAlbums: LibraryAlbum[], musicInstance:any }> = ({ libraryAlbums, musicInstance }) => {
const Home: NextPage<{ libraryAlbums: LibraryAlbum[] }> = ({ libraryAlbums }) => {

	const apiLimit = 100;

	const [loading, setLoading] = useState<boolean>(false)
	const [albumFetching, setAlbumFetching] = useState<boolean>(false)
	const [musicKit, setMusicKit] = useState<any>(null)
	const [displayedAlbumId, setDisplayedAlbumId] = useState<number>(0)
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
	const [albums, setAlbums] = useState<Array<any>>(libraryAlbums)
	const [apiPage, setApiPage] = useState<number>(1)
	const [fetchComplete, setFetchComplete] = useState<boolean>(false)

	const [loop, setLoop] = useState<boolean>(false)

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

		
	const loopMaxPage = 999;
	let loopPages: number[] = []

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

		if (!isAuthorized) {
			return;
		}
		
		setLoading(true)

		console.log('loadAlbums: musicKit.api', musicKit.api)
		console.log('loadAlbums: musicKit.api.library', musicKit.api.library)

		const params = {
			limit: apiLimit,
			offset: (apiPage - 1) * apiLimit
		}
		
		console.log('loadAlbums: params:', params)

		return musicKit.api.library.albums(null, params).then((response: LibraryAlbum[]) => {

			console.log('loadAlbums OK: response', response)

			if (response !== undefined && !response.length) {
				console.log('loadAlbums COMPLETE')
				setFetchComplete(true)
				setLoading(false)
				setAlbumFetching(false)
				return;
			}

			// filtering
			const year = 2023;
			const onlyAlbums = response.filter(a => !String(a.attributes.name).endsWith('- Single')
														&& !String(a.attributes.name).endsWith('- EP')
														// && String(a.attributes.artwork.url)
														)
			const yearAlbums = onlyAlbums.filter(a => String(a.attributes.releaseDate).startsWith(`${year}-`))

			// if (!yearAlbums.length) {
			// 	console.log('loadAlbums[V]: No album found! Retrying next page');
			// 	setApiPage(apiPage + 1)
			// 	return loadAlbums('BACK : ' + apiPage);
			// }

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
		console.log('useEffect', process.env);
		loadMusicKit();
		setIsAuthorized(musicKit?.isAuthorized || false)
		setLoop(false);

		// if (isAuthorized) {
		// 	loadAlbums()
		// }
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

	// useEffect(() => {
	// 	console.log('useEffect.musicKit', musicKit, musicKit?.isAuthorized || false);
	// 	setIsAuthorized(musicKit?.isAuthorized || false)
	// 	loadAlbums()
	// }, [setIsAuthorized])
	  
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
		musicKit.unauthorize().then((response: any) => {
			console.log('response', response)
			console.log('musicKit', musicKit)
			
			setMusicKit(musicKit)
			setIsAuthorized(false)
			
		}).catch(console.error)
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

			<nav>
				AM : <AMLoginButton musicKit={musicKit}
									updateMusicKit={(mk: any) => {
										setMusicKit(mk)
										setIsAuthorized(mk?.isAuthorized || false)
										loadAlbums()
									}}/>
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

				{/* <br/> */}
				{/* <br/> */}
				{/* PARENT :
				<ul>
					<li> - {isAuthorized} : {Number(isAuthorized)}</li>
					<li><button onClick={() => {
						console.log('authorize')

						musicKit.authorize().then((response: any) => {
							console.log('response', response)
						}).catch(console.error)

					}}>authorize</button></li>
					<li><button onClick={() => {
						console.log('unauthorize')

						musicKit.unauthorize().then((response: any) => {
							console.log('response', response)
						}).catch(console.error)

					}}>unauthorize</button></li>
				</ul> */}
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