import React from 'react'
import LibraryAlbum from '../../Elements/LibraryAlbum/LibraryAlbum'
import AlbumPickerTab, { TabsProps } from './AlbumPickerTab'

interface TodoTabProps extends TabsProps {
	todo: string[]
}

const TodoTab: React.FC<TodoTabProps> = ({ todo, ...props }) => {
	return <AlbumPickerTab title="Picked albums" list={todo} {...props} />
}

export default TodoTab
