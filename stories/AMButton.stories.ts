import type { Meta, StoryObj } from '@storybook/react'

import Button from '@/components/AppleMusic/Buttons/Button'
import { IoPlaySharp } from 'react-icons/io5'

const meta = {
	title: 'AM/Buttons',
	component: Button,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'centered',
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		// onLogin: () => console.log('storybook.onLogin'),
		// storyProps: {} as any,
		// backgroundColor: { control: 'color' },
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

//

export const ButtonA1: Story = {
	args: {
		children: 'Play',
		Size: 'Small',
		Style: 'Borderless',
		State: true,
		OnMaterialState: false,
		Icon: IoPlaySharp,
		LabelType: 'SymbolText',
	},
}
export const ButtonA2: Story = {
	args: {
		children: 'Play',
		Size: 'Small',
		Style: 'Borderless',
		State: true,
		OnMaterialState: true,
		Icon: IoPlaySharp,
		LabelType: 'SymbolText',
	},
}
export const ButtonA3: Story = {
	args: {
		children: 'Play',
		Size: 'Small',
		Style: 'Borderless',
		State: false,
		OnMaterialState: false,
		Icon: IoPlaySharp,
		LabelType: 'SymbolText',
	},
}
export const ButtonA4: Story = {
	args: {
		children: 'Play',
		Size: 'Small',
		Style: 'Borderless',
		State: false,
		OnMaterialState: true,
		Icon: IoPlaySharp,
		LabelType: 'SymbolText',
	},
}

export const TextIcon: Story = {
	args: {
		children: 'Play',
		Icon: IoPlaySharp,
	},
}
export const TextOnly: Story = {
	args: {
		children: 'Play',
	},
}
export const IconOnly: Story = {
	args: {
		Icon: IoPlaySharp,
	},
}
