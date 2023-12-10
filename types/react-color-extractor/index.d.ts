declare module 'react-color-extractor' {
	import * as React from 'react'

	interface ColorExtractorProps {
		src: string
		getColors: (colors: string[]) => void
	}

	export class ColorExtractor extends React.Component<ColorExtractorProps> {}

	interface SwatchProps {
		color: string
		index: number
		onSwatchHover?: () => void
	}

	export const Swatch: React.FC<SwatchProps>

	interface SwatchesProps {
		colors: string[]
		renderSwatches?: (colors: string[]) => React.ReactNode
	}

	export const Swatches: React.FC<SwatchesProps>

	interface RGBColor {
		r: number
		g: number
		b: number
	}

	export function rgbToHex(color: RGBColor): string

	// Ajoutez d'autres types en fonction de vos besoins
}
