import type { StorybookConfig } from '@storybook/nextjs'
import path from 'path'

const config: StorybookConfig = {
	stories: [
		'../stories/**/*.mdx',
		'../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-onboarding',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/nextjs',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	webpackFinal: (config) => {
		console.log('config', config)
		if (config?.resolve?.alias) {
			config.resolve.alias['@'] = path.resolve(__dirname, '../')
		}
		return config
	},
	// webpackFinal: async (config, { configType }) => {
	// 	if (config?.resolve?.alias) {
	// 		config.resolve.alias = {
	// 			...config.resolve.alias,
	// 			'@/': path.resolve(__dirname, '../'),
	// 			// "@/shared": path.resolve(__dirname, "../shared"),
	// 			// "@/app": path.resolve(__dirname, "../app"),
	// 		}
	// 	}
	// 	// config.resolve.alias = {
	// 	//   ...config.resolve.alias,
	// 	//   '@/interfaces': path.resolve(__dirname, "../interfaces"),
	// 	// };

	// 	return config
	// },
}
export default config
