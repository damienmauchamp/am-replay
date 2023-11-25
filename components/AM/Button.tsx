import classes from './Button.module.css'
import React, {
	forwardRef,
	ForwardedRef,
	ReactElement,
	HTMLProps,
	ButtonHTMLAttributes,
	useRef,
	ReactNode,
	CSSProperties,
} from 'react'
import { IconType } from 'react-icons'

import { IoPlaySharp } from 'react-icons/io5'
import { Style } from 'util'
// import io, { IoPlaySharp } from 'react-icons/io5'

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

// enum ButtonState {
// 	Enabled = true,
// 	Disabled = false,
// }

// enum OnMaterialState {

// }

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
	textStyle?: CSSProperties
	iconStyle?: CSSProperties
}

const defaultProps: ButtonProps = {
	// Size: ButtonSize.Large,
	// Style: ButtonStyle.Filled,
	State: true,
	OnMaterialState: false,
	LabelType: ButtonLabelType.Text,
}

const Button = ({ children, Icon, ref, ...props }: ButtonProps) => {
	const debug = () => {
		console.log('[Button] debug:', {
			Size: props.Size,
			'classes.button': classes.button,
		})
	}

	// // defining LabelType
	// if (Icon && children) {
	// 	props.LabelType = ButtonLabelType.SymbolText
	// } else if (Icon) {
	// 	props.LabelType = ButtonLabelType.Symbol
	// } else {
	// 	props.LabelType = ButtonLabelType.Text
	// }

	const handleClick = (e: any) => {
		if (props.onClick) {
			return props.onClick(e)
		}
		debug()
	}

	const capitalized = (word: string) =>
		word.charAt(0).toUpperCase() + word.slice(1)

	console.log('props.className', props.className)

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
			>
				{props.LabelType !== ButtonLabelType.Text && Icon ? (
					<>
						<div className="buttonIcon" style={props.iconStyle}>
							<Icon />
						</div>
					</>
				) : (
					''
				)}
				{props.LabelType !== ButtonLabelType.Symbol ? (
					<div className="buttonLabel" style={props.textStyle}>
						{children}
					</div>
				) : (
					''
				)}
			</button>

			{/* <div class="w-[66px] h-7 px-2.5 py-1 bg-blue-600 bg-opacity-20 rounded-[40px] justify-center items-center gap-[3px] inline-flex">
				<div class="text-center text-blue-600 text-[15px] font-normal font-['SF Pro'] leading-tight">
					􀊄
				</div>
				<div class="text-blue-600 text-[15px] font-normal font-['SF Pro'] leading-tight">
					Play
				</div>
			</div> */}
		</>
	)
}

Button.defaultProps = defaultProps

export default Button
