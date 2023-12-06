import React from 'react'
import LibraryAlbum, {
	getImageAlt,
	getImageUrl,
} from '../../Elements/LibraryAlbum/LibraryAlbum'
import Image from 'next/image'
import Button from '@/components/AppleMusic/Buttons/Button'
import { IoMdTrash } from 'react-icons/io'
import { iOSTheme } from '@/tailwind.config'
import { IoChevronBackCircle, IoReader } from 'react-icons/io5'

export interface TabsProps {
	identifier: string
	albums: LibraryAlbum[]
	//
	canCancel?: boolean
	onCancel?: (identifier: string, albumId: string) => void
	canTodo?: boolean
	onTodo?: (identifier: string, albumId: string) => void
	canDelete?: boolean
	onDelete?: (identifier: string, albumId: string) => void
}

interface AlbumPickerTabProps extends TabsProps {
	title: string
	list: string[]
	albums: LibraryAlbum[]
}

const defaultCallback = (identifier: string, albumId: string) => albumId
const defaultProps = {
	canCancel: false,
	onCancel: defaultCallback,
	canTodo: false,
	onTodo: defaultCallback,
	canDelete: false,
	onDelete: defaultCallback,
}

const AlbumPickerTab: React.FC<AlbumPickerTabProps> = ({
	title,
	list,
	albums,
	//
	canCancel,
	onCancel,
	canTodo,
	onTodo,
	canDelete,
	onDelete,
	//
	...props
}) => {
	if (!canTodo) {
		onTodo = defaultCallback
	}

	if (!canDelete) {
		onDelete = defaultCallback
	}

	return (
		<>
			<section>
				<div>
					<h3>
						{title} ({list.length})
					</h3>
				</div>

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
										<div className="flex flex-col justify-center items-center gap-1">
											{canCancel && (
												<Button
													Icon={IoChevronBackCircle}
													Style="Filled"
													Color={
														iOSTheme.color.purple
													}
													title="Cancel"
													onClick={() =>
														onCancel &&
														onCancel(
															props.identifier,
															libraryAlbum.id
														)
													}
												></Button>
											)}
											{canTodo && (
												<Button
													Icon={IoReader}
													Style="Filled"
													Color={
														iOSTheme.color.yellow
													}
													title="Todo"
													onClick={() =>
														onTodo &&
														onTodo(
															props.identifier,
															libraryAlbum.id
														)
													}
												></Button>
											)}
											{canDelete && (
												<Button
													Icon={IoMdTrash}
													Style="Filled"
													Color={iOSTheme.color.grey}
													title="Remove (skip)"
													onClick={() =>
														onDelete &&
														onDelete(
															props.identifier,
															libraryAlbum.id
														)
													}
												></Button>
											)}
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

AlbumPickerTab.defaultProps = defaultProps

export default AlbumPickerTab
