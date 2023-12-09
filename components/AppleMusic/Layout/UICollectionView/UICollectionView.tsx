import styles from './UICollectionView.module.css'

import React from 'react'

type Props = {
	items: any[]
}

const UICollectionView = ({ items, ...props }: Props) => {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{items.map((item) => {
				return <div>{item}</div>
			})}
		</div>
	)
}

export default UICollectionView
