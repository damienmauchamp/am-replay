import React from 'react'
import LibraryAlbum, {
	getImageAlt,
	getImageUrl,
} from '../../Elements/LibraryAlbum/LibraryAlbum'
import Image from 'next/image'
import Button from '@/components/AppleMusic/Buttons/Button'
import { IoMdTrash } from 'react-icons/io'
import { iOSTheme } from '@/tailwind.config'

export interface TabsProps {
	identifier: string
	albums: LibraryAlbum[]
	onDelete?: (identifier: string, albumId: string) => void
	// onDelete?: () => {}
}

interface AlbumPickerTabProps extends TabsProps {
	title: string
	list: string[]
	albums: LibraryAlbum[]
}

const AlbumPickerTab: React.FC<AlbumPickerTabProps> = ({
	title,
	list,
	albums,
	...props
}) => {
	return (
		<>
			<h2>renderTabTop</h2>

			<section>
				<h3>
					{title} ({list.length})
				</h3>

				<ul className="flex flex-col gap-2">
					{list.map((albumId: string) => {
						const libraryAlbum = albums.find(
							(album) => album.id === albumId
						)

						return (
							libraryAlbum && (
								<li>
									{/* <div className="grid grid-cols-2"> */}
									<div className="flex gap-2">
										<Image
											className="w-1/4"
											src={getImageUrl(libraryAlbum, 300)}
											alt={getImageAlt(libraryAlbum)}
											width={300}
											height={300}
										/>
										<div className={'flex flex-col grow'}>
											<p>{albumId}</p>
											<p>
												{libraryAlbum?.attributes.name}
											</p>
											<p>
												{
													libraryAlbum?.attributes
														.artistName
												}
											</p>
											<p>
												{
													libraryAlbum?.attributes
														.releaseDate
												}
											</p>
										</div>
										<div className="flex items-center">
											<Button
												Icon={IoMdTrash}
												Style="Filled"
												Color={
													iOSTheme.color.red.DEFAULT
												}
												title="Remove"
												onClick={() =>
													props.onDelete &&
													props.onDelete(
														props.identifier,
														libraryAlbum.id
													)
												}
											></Button>
										</div>
									</div>
								</li>
							)
						)
					})}
				</ul>
			</section>
		</>
	)
}

AlbumPickerTab.defaultProps = {
	onDelete: (albumId: string) => albumId,
}

export default AlbumPickerTab
