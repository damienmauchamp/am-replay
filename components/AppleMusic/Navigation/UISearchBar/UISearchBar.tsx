import React, { ForwardedRef, HTMLProps, forwardRef } from 'react'
import styles from './UISearchBar.module.css'

export interface UISearchBarProps extends HTMLProps<HTMLDivElement> {}

// export const defaultProps: UISearchBarProps = {}

const UISearchBar = forwardRef(
	({ ...props }: UISearchBarProps, ref: ForwardedRef<HTMLDivElement>) => {
		return (
			<div ref={ref} {...props}>
				UISearchBar
			</div>
		)
	}
)

// UISearchBar.defaultProps = defaultProps

export default UISearchBar
