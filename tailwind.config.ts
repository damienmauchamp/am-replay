import type { Config } from 'tailwindcss'

/**
 * [iOS17] Colors from Apple Design Resources - iOS 17
 * https://www.figma.com/community/file/1248375255495415511
 */
export const iOSTheme = {
	color: {
		red: {
			light: '#FF3B30',
			DEFAULT: '#FF3B30',
			dark: '#FF453A',
		},
		orange: {
			light: '#FF9500',
			DEFAULT: '#FF9500',
			dark: '#FF9F0A',
		},
		yellow: {
			light: '#FFCC00',
			DEFAULT: '#FFCC00',
			dark: '#FFD60A',
		},
		green: {
			light: '#34C759',
			DEFAULT: '#34C759',
			dark: '#30D158',
		},
		mint: {
			light: '#00C7BE',
			DEFAULT: '#00C7BE',
			dark: '#63E6E2',
		},
		teal: {
			light: '#30B0C7',
			DEFAULT: '#30B0C7',
			dark: '#40CBE0',
		},
		cyan: {
			light: '#32ADE6',
			DEFAULT: '#32ADE6',
			dark: '#64D2FF',
		},
		blue: {
			light: '#007AFF',
			DEFAULT: '#007AFF',
			dark: '#0A84FF',
		},
		indigo: {
			light: '#5856D6',
			DEFAULT: '#5856D6',
			dark: '#5E5CE6',
		},
		purple: {
			light: '#AF52DE',
			DEFAULT: '#AF52DE',
			dark: '#BF5AF2',
		},
		pink: {
			light: '#FF2D55',
			DEFAULT: '#FF2D55',
			dark: '##FF375F',
		},
		brown: {
			light: '#A2845E',
			DEFAULT: '#A2845E',
			dark: '#AC8E68',
		},
		black: '#000000',
		grey: {
			light: '#8E8E93',
			DEFAULT: '#8E8E93',
			dark: '#8E8E93',
		},
		grey2: {
			light: '#AEAEB2',
			DEFAULT: '#AEAEB2',
			dark: '#636366',
		},
		grey3: {
			light: '#C7C7CC',
			DEFAULT: '#C7C7CC',
			dark: '#48484A',
		},
		grey4: {
			light: '#D1D1D6',
			DEFAULT: '#D1D1D6',
			dark: '#3A3A3C',
		},
		grey5: {
			light: '#E5E5EA',
			DEFAULT: '#E5E5EA',
			dark: '#2C2C2E',
		},
		grey6: {
			light: '#F2F2F7',
			DEFAULT: '#F2F2F7',
			dark: '#1C1C1E',
		},
		white: '#FFFFFF',
	},
}

/**
 * Theme colors
 */
// export const primaryColor = iOSTheme.color.blue
export const primaryColor = iOSTheme.color.pink
export const buttonColor = primaryColor

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				primaryColor: primaryColor,
				buttonColor: buttonColor,
				// searchInputBg: {
				// 	light: '#EEEEEF',
				// 	DEFAULT: '#EEEEEF',
				// 	dark: '#1c1c1e',
				// },
				searchInputBg: {
					light: '#71717a', // zinc-500
					DEFAULT: '#71717a', // zinc-500
					dark: '#1c1c1e', // todo
				},
				searchInputText: {
					light: '#333333', // zinc-700
					DEFAULT: '#333333', // zinc-700
					dark: '#98989f', // todo
				},
				// searchInputText: {
				// 	light: '#838388',
				// 	DEFAULT: '#838388',
				// 	dark: '#98989f',
				// },
				// searchInputBg: iOSTheme.color.grey,
				// searchInputText: iOSTheme.color.grey,
				// iOS17
				...iOSTheme.color,
			},
			spacing: {
				// uiNavigation: '1rem' // px-4
				uiNavigation: '1.25rem', // px-5
			},
		},
	},
	plugins: [],
}
export default config
