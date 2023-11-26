import React from 'react'
import { IoPauseSharp, IoPlaySharp } from 'react-icons/io5'
import Button from '../AM/Button'

export default function ButtonTestPage() {
	const testButtonsProps = {
		Icon: IoPlaySharp,
		// Color: 'yellow',
		Color: '#FF2D55',
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

	const testButtons = () => {
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

	return (
		<>
			<Button Style="Filled" className="w-[50px]">
				Coucou
			</Button>

			<Button
				Size="Medium"
				Style="Bezeled"
				className="w-[50px]"
				// Color="green"
				// Color="#ff0"
				Color="green"
				// style={{
				// 	backgroundColor: 'green',
				// }}
				textStyle={{
					color: 'red',
				}}
				iconStyle={{
					color: 'yellow',
					// fontSize: 50,
				}}
				// LabelType="TextSymbol"
				Icon={IoPauseSharp}
			>
				Pause
			</Button>

			<div className={'grid grid-cols-3 gap-2 p-4 bg-[#ccc]'}>
				{testButtons().map((buttonType) => {
					const newCollection = [
						{
							...buttonType,
							OnMaterialState: false,
							State: true,
						},
						{
							...buttonType,
							OnMaterialState: true,
							State: true,
						},
						{
							...buttonType,
							OnMaterialState: false,
							State: false,
						},
						{
							...buttonType,
							OnMaterialState: true,
							State: false,
						},
					]

					return (
						<div className="grid grid-cols-2 grid-rows-2 border-2 p-2">
							{newCollection.map((button) => {
								return (
									<Button
										Size={button.Size}
										Style={button.Style}
										State={button.State}
										OnMaterialState={button.OnMaterialState}
										Icon={button.Icon}
										LabelType={button.LabelType}
										Color={button.Color}
										textStyle={button.textStyle}
										iconStyle={button.iconStyle}
										key={Date.now() * Math.random()}
									>
										Play
									</Button>
								)
							})}
						</div>
					)
				})}
			</div>
		</>
	)
}
