import SegmentedControls, {
	SegmentedControlsItem,
} from '@/components/AppleMusic/SegmentedControls/SegmentedControls'
import React, { useRef } from 'react'

export default function SegmentedControlsTestPage() {
	const defaultValues = {
		style: {},
		onSelect: (
			index: number,
			prev: number,
			item: SegmentedControlsItem
		) => {
			console.log('onSelect:', index, '/ prev :', prev, 'item:', item)
		},
	}

	const values = [...Array(5)].map((x, i) => {
		return {
			...defaultValues,
			// labels: [...Array(i + 1)].map(
			// 	(value, index) => `Label ${index + 1} `
			// ),
			items: [...Array(i + 1)].map((value, index) => ({
				label: `Label ${index + 1} `,
				value: `label-${index + 1}`,
				ref: useRef(),
			})),
		}
	})

	return (
		<div className="p-4 bg-[#ccc]">
			<h2>Normal 3x + minWidth(500): </h2>
			<SegmentedControls
				controlRef={useRef()}
				name="normal"
				// labels={['first option', '2nd option', 'Troisième']}
				items={[
					{
						label: 'first option',
						value: 'firstoption',
						ref: useRef(),
					},
					{
						label: '2nd option',
						value: '2ndoption',
						ref: useRef(),
					},
					{
						label: 'Troisième',
						value: 'troisième',
						ref: useRef(),
					},
				]}
				style={
					{
						// minWidth: 500,
						// maxWidth: 600,
					}
				}
				// resize={false}
			/>

			{values.map((value, index) => {
				return (
					<React.Fragment key={`cs-${index}`}>
						<h2>x{index + 1} : </h2>
						<SegmentedControls
							controlRef={useRef()}
							key={`cs-test-${index}`}
							name={`generated_${index}`}
							items={value.items}
							// labels={value.labels}
							onSelect={value.onSelect}
							// resize={false}
						/>
					</React.Fragment>
				)
			})}

			<h2>Vide : </h2>
			<SegmentedControls controlRef={useRef()} name="empty" />
		</div>
	)
}
