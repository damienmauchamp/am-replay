import Image from 'next/image'
import { Inter } from 'next/font/google'
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import LibraryAlbum from '@/components/LibraryAlbum/LibraryAlbum';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'

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

export const getStaticProps = async() => {
	const libraryAlbums: LibraryAlbum[] = LIBRARY_ALBUMS_API_RESPONSE.data;
	return {
		props: {
			libraryAlbums: libraryAlbums
		},
		revalidate: 3600,
	}
}


const Home: NextPage<{ libraryAlbums: LibraryAlbum[] }> = ({ libraryAlbums }) => {

	const [displayedAlbumId, setDisplayedAlbumId] = useState<number>(0)
	
	const handlePrevNext = (direction: string) => {

		let numberLibraryAlbums = libraryAlbums.length
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

	return (
		<main className={`flex min-h-screen flex-col items-center justify-between p-12 ${inter.className}`}>

			<div className=''>

				{ libraryAlbums.length
					?  <>
						<LibraryAlbum album={libraryAlbums[displayedAlbumId]}
									displayedAlbumId={displayedAlbumId}/>

							<div className={'flex flex-row items-center justify-between py-4'}>
								<IoArrowBack size={48} className="cursor-pointer" onClick={() => handlePrevNext('prev')} />
								<IoArrowForward size={48} className="cursor-pointer" onClick={() => handlePrevNext('next')} />
							</div>
						</>
					: 'No albums to display yet'}

			</div>
		</main>
	)

}

export default Home;