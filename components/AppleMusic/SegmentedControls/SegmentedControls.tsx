import classes from './SegmentedControls.module.css'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'

// region props
export interface SegmentedControlsProps {
	selected?: number
	onSelect?: (
		index: number,
		prev: number,
		item: SegmentedControlsItem
	) => void
	items: SegmentedControlsItem[]
	style?: CSSProperties
	name: string
	controlRef: any
	resize: boolean
}

export interface SegmentedControlsItem {
	label: string
	value: string | number
	ref: any
}

const defaultProps: SegmentedControlsProps = {
	selected: 0,
	onSelect: () => {},
	items: [],
	// labels: [],
	style: {},
	name: String(`sc-${Date.now() * Math.random()}`),
	controlRef: { current: null },
	resize: true,
}
// endregion props

const SegmentedControls = ({
	items,
	// labels,
	onSelect,
	name,
	controlRef,
	resize,
	...props
}: SegmentedControlsProps) => {
	const [selected, setSelected] = useState<number>(props.selected || 0)
	const uniqid = name + String(Date.now() * Math.random())
	const componentReady = useRef(false)
	const [componentWidth, setComponentWidth] = useState(null)

	// Triggers for useEffect
	let useEffectTriggers = [selected, onSelect, controlRef, items]
	if (resize) {
		useEffectTriggers = [...useEffectTriggers, componentWidth]
	}

	// region state
	const toggle = (index: number) => {
		// todo : check if element exists
		const prev = selected
		setSelected(index)
		// props.onSelect && props.onSelect(index, prev, items[index])
		onSelect && onSelect(index, prev, items[index])
	}
	// endregion state

	// region rendering
	const renderItem = (index: number) => {
		const isSelected = index === selected
		const item = items[index]

		return (
			<div
				key={`button-${name}-${uniqid}b${index}`}
				ref={item.ref}
				className={`${classes.button} ${
					isSelected ? classes.selected : ''
				}`}
			>
				<input
					type="radio"
					value={item.value}
					id={item.label}
					name={name}
					onChange={() => toggle(index)}
					checked={isSelected}
				/>
				<label htmlFor={item.label} className={classes.label}>
					{item.label}
				</label>
				{/* <div className={classes.label}>{labels[index]}</div> */}
			</div>
		)
	}

	const renderSeparator = (index: number) => {
		if (items.length <= 2) {
			return ''
		}

		if (index >= items.length - 1) {
			// last element
			return ''
		}

		const nextLeft = index + 1 === selected,
			nextRight = index === selected,
			nextTo = nextLeft || nextRight

		return (
			<div
				key={`sep-${name}-${uniqid}s${index}`}
				className={`${classes.separator} ${
					!nextTo && 'bg-neutral-400'
				}`}
				data-next={Number(nextTo)}
			></div>
		)
	}
	// endregion rendering

	// region resizing
	const handleResize = () => {
		setComponentWidth(controlRef.current.offsetWidth)
	}
	// endregion resizing

	const updateSelectedElement = () => {
		if (!items.length) {
			return
		}

		const activeSegmentRef = items[selected].ref
		const { offsetWidth, offsetLeft } = activeSegmentRef.current
		const { style } = controlRef.current

		style.setProperty('--highlight-width', `${offsetWidth}px`)
		style.setProperty('--highlight-x-pos', `${offsetLeft}px`)
	}

	useEffect(() => {
		componentReady.current = true
		updateSelectedElement()
		resize && window.addEventListener('resize', handleResize)
		return () => {
			resize && window.removeEventListener('resize', handleResize)
		}
	}, [])

	useEffect(() => {
		updateSelectedElement()
	}, [useEffectTriggers])

	return (
		<div
			ref={controlRef}
			className={`controls-container ${classes.container}`}
			style={props.style && { ...props.style }}
		>
			<div
				className={`controls ${classes.controls} ${classes.segment}  ${
					componentReady.current ? 'ready' : 'idle'
				}`}
				style={props.style && { ...props.style }}
			>
				{items.map((x, i) => (
					<React.Fragment key={`fragment-${name}-${i}`}>
						{renderItem(i)}
						{renderSeparator(i)}
					</React.Fragment>
				))}
			</div>
		</div>
	)
}

SegmentedControls.defaultProps = defaultProps

export default SegmentedControls
