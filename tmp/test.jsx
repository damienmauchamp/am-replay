import {forwardRef, type ForwardedRef, type ReactElement, type HTMLProps} from 'react';


interface TestJsxProps extends HTMLProps<HTMLDivElement> {
	children?: ReactElement
}

const TestJsx = ({
					 children,
					 ...props
				 }: TestJsxProps, ref: ForwardedRef<HTMLDivElement>) => {
	return (
			<>
				<div
						{...props}
						ref={ref}
				>
					{children}
				</div>
			</>
	);
}

const TestJsxWithRef = forwardRef(TestJsx) as
		(props: TestJsxProps & { ref?: ForwardedRef<HTMLDivElement> }) => ReactElement;

export default TestJsxWithRef;
export type {
	TestJsxProps
}