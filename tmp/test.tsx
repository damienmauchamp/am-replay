import React, { forwardRef, ForwardedRef, ReactElement, HTMLProps } from 'react'

interface TestJsxProps extends HTMLProps<HTMLDivElement> {
	children?: ReactElement
}

const TestJsx = (
	{ children, ...props }: TestJsxProps,
	ref: ForwardedRef<HTMLDivElement>
) => {
	return (
		<>
			<div {...props} ref={ref}>
				{children}
			</div>
		</>
	)
}

const TestJsxWithRef = forwardRef(
	(props: TestJsxProps, ref: ForwardedRef<HTMLDivElement>) => (
		<TestJsx {...props} ref={ref} />
	)
)

export default TestJsxWithRef
export type { TestJsxProps }
