import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { IoChevronBackOutline, IoMic, IoSearch } from 'react-icons/io5'
import TestsNavLinks from '../TestsNavLinks'
import styles from './NavBarTest.module.css'

/**
 * @property {boolean} faded fade BG
 */
type Props = {
	children?: ReactNode
	//
	title?: string
	back?: string
	onBack?: React.MouseEventHandler<HTMLButtonElement>
	//
	faded?: boolean
	//
	search?: boolean
	searchPlaceholder?: string
	//
	scrollX?: boolean

	TopIcon?: React.ElementType
	topIconWrapped?: boolean
	onTopIconClick?: React.MouseEventHandler<HTMLDivElement>
}

const defaultProps: Props = {
	searchPlaceholder: 'Search',
	faded: true,
	// scrollX: true,
	// onTopIconClick: () => void
}

NavBarTest.defaultProps = defaultProps

export default function NavBarTest({
	children,
	title,
	back,
	TopIcon,
	topIconWrapped,
	onTopIconClick,
	onBack,
	faded,
	search,
	searchPlaceholder,
	...props
}: Props) {
	// small title
	// todo : useRef / getBound
	const titleSwitchScroll = 32
	const smallTitleRef = useRef<HTMLDivElement>(null)
	const [smallTitleVisible, setSmallTitleVisible] = useState<boolean>(false)

	// large title
	// const largeTitleMaxHeight = 52
	const largeTitleRef = useRef<HTMLDivElement>(null)
	const [largeTitleVisible, setLargeTitleVisible] = useState<boolean>(true)

	const topRef = useRef<HTMLDivElement>(null)

	//
	const [searchBarIsFixed, setSearchBarIsFixed] = useState<boolean>(false)
	const searchBarRef = useRef<HTMLDivElement>(null)

	// scroll
	const [scrollY, setScrollY] = useState<number>(0)

	const toggleSearchBarFixation = () => {
		if (!search) {
			return
		}
		const topBarInfo = topRef.current?.getBoundingClientRect()
		if (!topBarInfo) {
			console.error('NO topBarInfo')
			return
		}

		// fixing searchbar
		const topBarBottom = topBarInfo.top + topBarInfo.height
		const searchBarShouldBeFixed = topBarBottom <= window.scrollY

		// fix for the clipping title
		const titleGap = 5
		if (largeTitleRef.current) {
			if (
				topBarBottom <= window.scrollY + titleGap &&
				window.scrollY > titleSwitchScroll
			) {
				largeTitleRef.current.style.visibility = 'hidden'
			} else {
				largeTitleRef.current.style.visibility = 'visible'
			}
		}
		// setSearchBarIsFixed(true)
		setSearchBarIsFixed(searchBarShouldBeFixed)
	}
	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY)

			// titles visibility
			setSmallTitleVisible(window.scrollY > titleSwitchScroll)
			setLargeTitleVisible(window.scrollY <= titleSwitchScroll)

			//
			toggleSearchBarFixation()
		}
		window.addEventListener('scroll', handleScroll)
		handleScroll()

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	useEffect(() => {
		console.log('smallTitleRef', smallTitleRef)
	}, [])

	/**
	 * wrapped icons
	 */
	const renderTopRightIcon = () =>
		TopIcon && (
			<div className="justify-start items-start gap-2.5 flex">
				<div
					className={`${styles.uiTopRightIcon} ${
						(topIconWrapped && styles.uiTopRightIconWrapped) || ''
					}`}
					onClick={onTopIconClick}
				>
					<TopIcon size={topIconWrapped ? 20 : 30} />
				</div>
			</div>
		)

	const iOSLarge = () => (
		<>
			<div
				id="main"
				className={styles.uiMain}
				data-fixed={Number(searchBarIsFixed)}
				data-backdrop={Number(faded)}
				data-search={Number(search)}
			>
				<div
					id="uiTop"
					ref={topRef}
					className={styles.uiTop}
					data-visible={Number(smallTitleVisible)}
				>
					{/* Topbar */}
					<div className={styles.uiSmallTitleContainer}>
						<button
							className={styles.uiSmallTitleButton}
							onClick={onBack}
						>
							{back && (
								<>
									<IoChevronBackOutline size={28} />
									<div
										className={
											styles.uiSmallTitleButtonLabel
										}
									>
										{back}
									</div>
								</>
							)}
						</button>

						<div
							ref={smallTitleRef}
							style={{ opacity: Number(smallTitleVisible) }}
							className={`${styles.titleTransition} ${styles.uiSmallTitle}`}
						>
							{title}
						</div>

						{/* <div className="px-4 py-[11px] justify-end items-center gap-4 inline-flex"> */}
						<div className={styles.uiRightIcon}>
							{renderTopRightIcon()}
						</div>
					</div>
				</div>

				{/* Screen */}
				<div id="uiBottom" className={styles.uiBottom}>
					<div
						id="uiBottomTop"
						data-fixed={Number(searchBarIsFixed)}
						className={styles.uiBottomTop}
					>
						{/* Large title */}
						{/* h-[52px] */}
						<div
							id="largeTitle"
							// className="self-stretch   flex-col justify-start items-start gap-2.5 flex "
							className="self-stretch gap-2.5 flex flex-col justify-start items-start overflow-hidden"
							style={{}}
						>
							<div
								ref={largeTitleRef}
								style={{
									opacity: Number(largeTitleVisible),
								}}
								// className="w-full px-4 pt-[3px] pb-2 text-black text-[34px] font-bold leading-[41px] truncate"
								className={`${styles.titleTransition} w-full px-5 pt-[3px] text-[34px] font-bold leading-[41px] truncate`}
							>
								{title}
							</div>
						</div>

						{/* Search bar */}
						{search && (
							<div
								id="searchbar"
								ref={searchBarRef}
								data-fixed={Number(searchBarIsFixed)}
								className={styles.searchbar}
							>
								<div className="self-stretch px-2 py-[7px] bg-zinc-500 bg-opacity-10 rounded-[10px] justify-start items-center inline-flex">
									<div className="w-[25px] text-zinc-700 text-opacity-60 text-[17px] font-normal leading-snug">
										<IoSearch size={18} />
									</div>
									<div className="grow shrink basis-0 h-[22px] text-zinc-700 text-opacity-60 text-[17px] font-normal leading-snug truncate">
										{searchPlaceholder}
									</div>
									<div className="text-center text-zinc-700 text-opacity-60 text-[17px] font-normal leading-snug">
										<IoMic size={18} />
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Scroll content */}
					<div
						id="content"
						className={`${styles.content} ${
							props.scrollX ? '' : styles.noScrollX
						}`}
					>
						{children}
						{true && (
							<div className="flex flex-col gap-4 mt-4 ">
								<TestsNavLinks />

								<div
									className={`w-full border-t 
							${false ? 'bg-red' : ''}
							${false ? 'min-h-[999px]' : ''}
							${true ? 'min-w-[999px]' : ''}
							`}
								>
									<p>content / scrollY : {scrollY}</p>
									<p>
										searchBarIsFixed:{' '}
										{Number(searchBarIsFixed)}
									</p>
									<div className="my-96"></div>
									<div className="my-96"></div>
									<p>Foot</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)

	return (
		<div className="w-full h-[100vh] flex" style={{}}>
			{iOSLarge()}
		</div>
	)
}
