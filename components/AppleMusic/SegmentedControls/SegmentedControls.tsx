import classes from './SegmentedControls.module.css'

import React, { CSSProperties, useState } from 'react'

interface SegmentedControlsProps {
	selected?: number
	onSelect?: (index: number, prev: number) => void
	labels: string[]
	style?: CSSProperties
}

const defaultProps: SegmentedControlsProps = {
	selected: 0,
	onSelect: (index: number, prev: number) => {},
	labels: [],
}

const SegmentedControls = ({ labels, ...props }: SegmentedControlsProps) => {
	const [selected, setSelected] = useState<number>(props.selected || 0)
	const n = labels.length

	const toggle = (index: number) => {
		// todo : check if element exists
		const prev = selected
		setSelected(index)
		props.onSelect && props.onSelect(index, prev)
	}

	const renderLabel = (index: number) => {
		const isSelected = index === selected

		return (
			<div
				key={`${Date.now()}-${index}`}
				className={`${classes.button} ${
					isSelected ? classes.selected : ''
				}`}
				onClick={() => toggle(index)}
			>
				<div className={classes.label}>{labels[index]}</div>
			</div>
		)
	}

	const renderSeparator = (index: number) => {
		if (n <= 2) {
			return ''
		}

		if (index >= n - 1) {
			// last element
			return ''
		}

		const nextLeft = index + 1 === selected,
			nextRight = index === selected,
			nextTo = nextLeft || nextRight

		return (
			<div
				key={index}
				className={`${classes.separator} ${
					!nextTo && 'bg-neutral-400'
				}`}
				data-next={Number(nextTo)}
			></div>
		)
	}

	// 2 : 118px
	// 3 : 174px (+56)
	// 4 : 230px (+56)
	// 5 : 286px (+56)
	const width = 6 + 56 * n

	return (
		<>
			{labels.length ? (
				<div
					className={classes.segment}
					style={props.style && { ...props.style }}
				>
					{labels.map((x, i) => (
						<>
							{renderLabel(i)}
							{renderSeparator(i)}
						</>
					))}
				</div>
			) : null}
		</>
	)
}

SegmentedControls.defaultProps = defaultProps

export default SegmentedControls
