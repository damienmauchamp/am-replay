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
	Color?: string
	textStyle?: CSSProperties
	iconStyle?: CSSProperties
}

const defaultProps: ButtonProps = {
	disabled: false,
	OnMaterialState: false,
	// LabelType: ButtonLabelType.Text,
}

const Button = ({
	children,
	Icon,
	OnMaterialState,
	LabelType,
	Color,
	textStyle,
	iconStyle,
	ref,
	...props
}: ButtonProps) => {
	const debug = () => {
		console.log('[Button] debug:', {
			Size: props.Size,
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

	const buttonStyle = () => {
		let style = {}

		if (Color) {
			if (props.Style === ButtonStyle.Bezeled && !props.disabled) {
				style = {
					...style,
					backgroundColor: `rgba(${colorToRgbString(
						Color
					)} / var(--tw-bg-opacity))`,
				}
			}

			if (props.Style === ButtonStyle.Filled && !props.disabled) {
				style = {
					...style,
					backgroundColor: Color,
				}
			}
		}

		return style
	}

	const buttonElementsStyle = () => {
		let style = {}

		if (Color && !props.disabled && props.Style !== ButtonStyle.Filled) {
			style = {
				...style,
				color: Color,
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
				${classes['button' + props.Size]}
				${classes['button' + props.Style]}
				${classes['button' + LabelType]}
				${classes['buttonState' + (!props.disabled ? 'Enabled' : 'Disabled')]}
				${classes['buttonOnMaterialState' + (OnMaterialState ? 'On' : 'Off')]}
				`}
				onClick={handleClick}
				style={{ ...props.style, ...buttonStyle() }}
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
						className="buttonLabel"
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

Button.defaultProps = defaultProps

const ButtonWithRef = forwardRef(
	(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => (
		<Button {...props} ref={ref} />
	)
)

export default ButtonWithRef
// export default Button
