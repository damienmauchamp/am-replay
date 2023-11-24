import type { Meta, StoryObj } from '@storybook/react'

// import { LoginButtonComponent as LoginButton } from '@/components/Auth/LoginButton/LoginButton'
import LoginButton from '../../components/Auth/LoginButton/LoginButton'
// import LogoutButton from '@/components/Auth/LogoutButton/LogoutButton'

const meta = {
	title: 'Nav/Buttons/Login',
	component: LoginButton,
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
} satisfies Meta<typeof LoginButton>

export default meta
type Story = StoryObj<typeof meta>

export const Logged: Story = {
	args: {
		onLogin: () => console.log('storybook.onLogin'),
		// musicKit: {} as MusicKit.MusicKitInstance,
		// storyProps: ',ope',
	},
}

// export const Logged: Story = {
// 	args: {
// 		logged: true,
// 	},
// }
// export const Logged: Story = {
// 	args: {
// 		logged: true,
// 	},
// }
// export const Logged: Story = {
// 	args: {
// 		logged: true,
// 	},
// }
