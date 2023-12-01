import SegmentedControls from '@/components/AppleMusic/SegmentedControls/SegmentedControls'
import React from 'react'

export default function SegmentedControlsTestPage() {
	const defaultValues = {
		style: {},
		onSelect: (index: number, prev: number) => {
			console.log('onSelect:', index, '/ prev :', prev)
		},
	}

	const values = [...Array(5)].map((x, i) => {
		return {
			...defaultValues,
			labels: [...Array(i + 1)].map(
				(value, index) => `Label ${index + 1} `
			),
		}
	})

	return (
		<>
			<div className="p-4 bg-[#ccc]">
				<h2>Normal 3x + minWidth(500): </h2>
				<SegmentedControls
					labels={['first option', '2nd option', 'Troisième']}
					style={{
						minWidth: 500,
					}}
				/>

				{values.map((value, index) => {
					return (
						<>
							<h2>x{index}</h2>
							<SegmentedControls
								labels={value.labels}
								onSelect={value.onSelect}
							/>
						</>
					)
				})}

				<h2>Vide : </h2>
				<SegmentedControls />
			</div>
		</>
	)
}
