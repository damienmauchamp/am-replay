import React from 'react'
import { IoPauseSharp, IoPlaySharp } from 'react-icons/io5'
import Button from '../../AppleMusic/Buttons/Button'
import { testButtons } from '@/helpers/tests/buttonsTests'

export default function ButtonTestPage() {
	return (
		<>
			<Button Style="Filled" className="w-[50px]" key={'coucou'}>
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
				key={'pause'}
			>
				Pause
			</Button>

			<div className={'grid grid-cols-3 gap-2 p-4 bg-[#ccc]'}>
				{testButtons().map((buttonType) => {
					const newCollection = [
						{
							...buttonType,
							OnMaterialState: false,
							// State: true,
							disabled: false,
						},
						{
							...buttonType,
							OnMaterialState: true,
							// State: true,
							disabled: false,
						},
						{
							...buttonType,
							OnMaterialState: false,
							// State: false,
							disabled: true,
						},
						{
							...buttonType,
							OnMaterialState: true,
							// State: false,
							disabled: true,
						},
					]

					return (
						<div className="grid grid-cols-2 grid-rows-2 border-2 p-2">
							{newCollection.map((button) => {
								return (
									<Button
										Size={button.Size}
										Style={button.Style}
										disabled={button.disabled}
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
