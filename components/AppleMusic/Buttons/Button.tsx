import { colorToRgbString, colorToRgbaString } from '@/helpers/colors'
import classes from './Button.module.css'
import React, {
	ButtonHTMLAttributes,
	ReactNode,
	CSSProperties,
	ForwardedRef,
	forwardRef,
} from 'react'

enum ButtonSize {
	Large = 'Large',
	Medium = 'Medium',
	Small = 'Small',
}

enum ButtonStyle {
	Borderless = 'Borderless',
	BezeledGray = 'BezeledGray',
	Bezeled = 'Bezeled',
	Filled = 'Filled',
}

enum ButtonLabelType {
	Symbol = 'Symbol',
	SymbolText = 'Symbol + Text',
	Text = 'Text',
}

type ColorProps =
	| undefined
	| string
	| {
			DEFAULT: string
			light: string
			dark: string
	  }

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/**
	 * Le texte ou le composant qui sera affiché à l'intérieur du bouton.
	 */
	children?: ReactNode

	/**
	 * Un ref qui peut être utilisé pour accéder à l'élément DOM du bouton.
	 */
	ref?: React.Ref<HTMLButtonElement>

	// icon?: IconType
	Icon?: React.ElementType

	// Large/Play sans icone
	// Mode: Light
	Size?: ButtonSize | string
	Style?: ButtonStyle | string
	OnMaterialState?: boolean
	LabelType?: ButtonLabelType | string
	// Label: string (Play)

	//
	Color?: ColorProps
	textStyle?: CSSProperties
	iconStyle?: CSSProperties
}

const defaultProps: ButtonProps = {
	disabled: false,
	OnMaterialState: false,
	// LabelType: ButtonLabelType.Text,
}

const ButtonComponent = ({
	children,
	Icon,
	OnMaterialState,
	LabelType,
	Color,
	Style,
	Size,
	textStyle,
	iconStyle,
	ref,
	...props
}: ButtonProps) => {
	const debug = () => {
		console.log('[Button] debug:', {
			Size: Size,
			'classes.button': classes.button,
		})
	}

	if (!LabelType && Icon) {
		LabelType = children
			? ButtonLabelType.SymbolText
			: ButtonLabelType.Symbol
	} else if (!LabelType && children) {
		LabelType = Icon ? ButtonLabelType.SymbolText : ButtonLabelType.Text
	}

	const handleClick = (e: any) => {
		if (props.onClick) {
			return props.onClick(e)
		}
		debug()
	}

	const getColor = (color: ColorProps) => {
		if (!color) {
			return ''
		}
		return typeof color === 'string' ? color : color.DEFAULT || color.light
	}

	const buttonStyle = () => {
		let style = {}

		if (getColor(Color)) {
			if (Style === ButtonStyle.Bezeled && !props.disabled) {
				style = {
					...style,
					backgroundColor: `rgba(${colorToRgbString(
						getColor(Color)
					)} / var(--tw-bg-opacity))`,
				}
			}

			if (Style === ButtonStyle.Filled && !props.disabled) {
				style = {
					...style,
					backgroundColor: getColor(Color),
				}
			}
		}

		return style
	}

	const buttonElementsStyle = () => {
		let style = {}

		if (
			getColor(Color) &&
			!props.disabled &&
			Style !== ButtonStyle.Filled
		) {
			style = {
				...style,
				color: getColor(Color),
			}
		}

		return style
	}

	return (
		<>
			<button
				ref={ref}
				{...props}
				className={`
				${props.className || ''} 
				${classes.button} 
				${classes['button' + Size]}
				${classes['button' + Style]}
				${classes['button' + LabelType]}
				${classes['buttonState' + (!props.disabled ? 'Enabled' : 'Disabled')]}
				${classes['buttonOnMaterialState' + (OnMaterialState ? 'On' : 'Off')]}
				`}
				style={{ ...props.style, ...buttonStyle() }}
				onClick={handleClick}
			>
				{LabelType !== ButtonLabelType.Text && Icon ? (
					<>
						<div
							className="buttonIcon"
							style={{
								...iconStyle,
								...buttonElementsStyle(),
							}}
						>
							<Icon />
						</div>
					</>
				) : (
					''
				)}
				{LabelType !== ButtonLabelType.Symbol ? (
					<div
						className={classes.buttonLabel}
						style={{
							...buttonElementsStyle(),
							...textStyle,
						}}
					>
						{children}
					</div>
				) : (
					''
				)}
			</button>
		</>
	)
}

ButtonComponent.defaultProps = defaultProps

const ButtonWithRef = forwardRef(
	(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => (
		<Button {...props} ref={ref} />
	)
)

export const Button = ButtonComponent
export default Button
// export default React.memo(ButtonWithRef)
// export default React.memo(ButtonWithRef)
export const ButtonMemo = React.memo(ButtonWithRef)
export const ButtonWithoutRef = Button
export const ButtonMemoWithoutRef = React.memo(Button)
