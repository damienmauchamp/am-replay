import React from 'react'
import LibraryAlbum from '../../Elements/LibraryAlbum/LibraryAlbum'
import AlbumPickerTab, { TabsProps } from './AlbumPickerTab'

interface TopTabProps extends TabsProps {
	picked: string[]
}

const TopTab: React.FC<TopTabProps> = ({ picked, ...props }) => {
	return <AlbumPickerTab title="Top albums" list={picked} {...props} />
}

export default TopTab
