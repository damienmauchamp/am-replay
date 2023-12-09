import styles from './UICollectionView.module.css'

import React from 'react'

type Props = {
	items: any[]
}

const UICollectionView = ({ items, ...props }: Props) => {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-uiNavigation">
			{items.map((item) => item)}
		</div>
	)
}

export default UICollectionView
