import { IoPlaySharp } from 'react-icons/io5'

const colorPink = '#FF2D55'

const testButtonsProps = {
	Icon: IoPlaySharp,
	// Color: 'yellow',
	Color: colorPink,
	textStyle: {
		fontWeight: 'bold',
	} as React.CSSProperties,
}

const testButtonsType = [
	{
		...testButtonsProps,
		Style: 'Borderless',
	},
	{
		...testButtonsProps,
		Style: 'BezeledGray',
	},
	{
		...testButtonsProps,
		Style: 'Bezeled',
	},
	{
		...testButtonsProps,
		Style: 'Filled',
	},
]

export const testButtons = () => {
	let buttons: any[] = []

	let labelTypeButtons: any[] = []
	testButtonsType.forEach((button) => {
		labelTypeButtons = [
			...labelTypeButtons,
			{
				...button,
				LabelType: 'SymbolText',
			},
			{
				...button,
				LabelType: 'Symbol',
			},
			{
				...button,
				LabelType: 'Text',
			},
		]
	})
	// return labelTypeButtons

	let sizeButtons: any[] = []
	labelTypeButtons.forEach((button) => {
		sizeButtons = [
			...sizeButtons,
			{
				...button,
				Size: 'Small',
			},
			{
				...button,
				Size: 'Medium',
			},
			{
				...button,
				Size: 'Large',
			},
		]
	})
	return sizeButtons
}
