import { colorToRgbString, colorToRgbaString } from '@/helpers/colors'
import classes from './Button.module.css'
import React, { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react'

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
	State?: boolean
	OnMaterialState?: boolean
	LabelType?: ButtonLabelType | string
	// Label: string (Play)

	//
	Color?: string
	textStyle?: CSSProperties
	iconStyle?: CSSProperties
}

const defaultProps: ButtonProps = {
	State: true,
	OnMaterialState: false,
	// LabelType: ButtonLabelType.Text,
}

const Button = ({ children, Icon, ref, ...props }: ButtonProps) => {
	const debug = () => {
		console.log('[Button] debug:', {
			Size: props.Size,
			'classes.button': classes.button,
		})
	}

	if (!props.LabelType && Icon) {
		props.LabelType = children
			? ButtonLabelType.SymbolText
			: ButtonLabelType.Symbol
	}

	const handleClick = (e: any) => {
		if (props.onClick) {
			return props.onClick(e)
		}
		debug()
	}

	const buttonStyle = () => {
		let style = {}

		if (props.Color) {
			if (props.Style === ButtonStyle.Bezeled && props.State) {
				style = {
					...style,
					backgroundColor: `rgba(${colorToRgbString(
						props.Color
					)} / var(--tw-bg-opacity))`,
				}
			}

			if (props.Style === ButtonStyle.Filled && props.State) {
				style = {
					...style,
					backgroundColor: props.Color,
				}
			}
		}

		return style
	}

	const buttonElementsStyle = () => {
		let style = {}

		if (props.Color && props.State && props.Style !== ButtonStyle.Filled) {
			style = {
				...style,
				color: props.Color,
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
				${classes['button' + props.LabelType]}
				${classes['buttonState' + (props.State ? 'Enabled' : 'Disabled')]}
				${classes['buttonOnMaterialState' + (props.OnMaterialState ? 'On' : 'Off')]}
				`}
				onClick={handleClick}
				data-Size={props.Size}
				data-Style={props.Style}
				data-LabelType={props.LabelType}
				data-State={props.State}
				data-OnMaterialState={props.OnMaterialState}
				style={{ ...props.style, ...buttonStyle() }}
			>
				{props.LabelType !== ButtonLabelType.Text && Icon ? (
					<>
						<div
							className="buttonIcon"
							style={{
								...props.iconStyle,
								...buttonElementsStyle(),
							}}
						>
							<Icon />
						</div>
					</>
				) : (
					''
				)}
				{props.LabelType !== ButtonLabelType.Symbol ? (
					<div
						className="buttonLabel"
						style={{
							...buttonElementsStyle(),
							...props.textStyle,
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

export default Button
