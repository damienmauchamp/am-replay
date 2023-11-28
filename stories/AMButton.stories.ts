import type { Meta, StoryObj } from '@storybook/react'

import Button from '@/components/AppleMusic/Buttons/Button'
import { IoPlaySharp } from 'react-icons/io5'
import { testButtons } from '@/helpers/tests/buttonsTests'

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
const testButton = testButtons().map((testButton) => {
	return {
		args: { ...testButton, children: 'Play', Icon: IoPlaySharp },
	}
})[0]

export const Default: Story = testButton as Story

export const TextIcon: Story = {
	args: {
		...testButton.args,
		LabelType: 'SymbolText',
	},
}
export const TextOnly: Story = {
	args: {
		...testButton.args,
		Icon: null,
		LabelType: 'Text',
	},
}
export const IconOnly: Story = {
	args: {
		...testButton.args,
		children: null,
		LabelType: 'Symbol',
	},
}
