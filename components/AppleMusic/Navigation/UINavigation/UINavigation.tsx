import React, {
	CSSProperties,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from 'react'
import { IoChevronBackOutline, IoMic, IoSearch } from 'react-icons/io5'
import TestsNavLinks from '@/components/Tests/TestsNavLinks'
import styles from './UINavigation.module.css'
import 'regenerator-runtime/runtime'
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition'
import UISearchBar from '../UISearchBar/UISearchBar'

export interface UINavBarTopCornerIconProps {
	key?: string
	ref?: React.MutableRefObject<HTMLDivElement | undefined>
	title?: string
	Icon: React.ElementType
	wrapped: boolean
	active: boolean
	onClick?: React.MouseEventHandler<HTMLDivElement>
	style?: CSSProperties
}

/**
 * @property {boolean} faded fade BG
 */
type UINavBarProps = {
	children?: ReactNode
	headerContent?: ReactNode
	//
	title?: string
	titleRightContent?: ReactNode
	//
	goBack?: boolean
	goBackLabel?: string
	onBack?: React.MouseEventHandler<HTMLButtonElement>
	//
	faded?: boolean
	//
	search?: boolean
	searchText: string
	onSearchInput: React.FormEventHandler<HTMLInputElement> | undefined
	searchPlaceholder?: string
	speechToText?: boolean
	onSearchTranscript: (value: string) => void
	//
	scrollX?: boolean

	//
	topCornerIcons: UINavBarTopCornerIconProps[]
}

export const defaultProps: UINavBarProps = {
	//
	goBack: false,
	goBackLabel: '',
	onBack: () => {},
	//
	searchText: '',
	searchPlaceholder: 'Search',
	speechToText: true,
	onSearchInput: (event: React.FormEvent<HTMLInputElement>) => {},
	onSearchTranscript: (value: string) => {},
	faded: true,
	// scrollX: true,
	topCornerIcons: [] as UINavBarTopCornerIconProps[],
}

/**
 * @todo move classNames to css + cleanup
 * @todo real colors + border outline
 * @todo input bar + color + onFocus fixed & titleHidden + Cancel
 * @todo iPad & desktop versions
 */
const UINavigation = ({
	children,
	headerContent,
	title,
	titleRightContent,
	goBack,
	goBackLabel,
	onBack,
	topCornerIcons,
	faded,
	search,
	onSearchInput,
	searchText,
	searchPlaceholder,
	speechToText,
	onSearchTranscript,
	...props
}: UINavBarProps) => {
	// region Utils
	const generateUniqId = (prefix: string = '') =>
		`${prefix}${Date.now() * Math.random()}`
	// endregion Utils

	// region Top bar

	// region TopRightIcons
	const renderTopRightIcon = (
		topIcon: UINavBarTopCornerIconProps,
		index: number,
		array: UINavBarTopCornerIconProps[]
	) => {
		let props = {}
		if (topIcon.ref) {
			props = { ...props, ref: topIcon.ref }
		}

		return (
			topIcon.Icon && (
				<div
					key={topIcon.key || generateUniqId(`topIconKey-${index}`)}
					className={`${styles.uiTopRightIcon} ${
						(topIcon.wrapped && styles.uiTopRightIconWrapped) || ''
					} ${(topIcon.active && styles.uiTopRightIconActive) || ''}`}
					onClick={topIcon.onClick}
					style={{ ...topIcon.style }}
					title={topIcon.title}
					{...props}
				>
					<topIcon.Icon size={topIcon.wrapped ? 20 : 30} />
				</div>
			)
		)
	}
	const renderTopRightIcons = () => (
		<>
			<div className={styles.uiTopRightIcons}>
				{topCornerIcons.map(renderTopRightIcon)}
			</div>
		</>
	)
	// endregion TopRightIcons

	// endregion Top bar

	// region Titles toggling
	const [searchBarIsFixed, setSearchBarIsFixed] = useState<boolean>(false)
	const searchBarRef = useRef<HTMLDivElement>(null)

	// small title
	const smallTitleRef = useRef<HTMLDivElement>(null)
	const [smallTitleVisible, setSmallTitleVisible] = useState<boolean>(false)

	// large title
	const largeTitleRef = useRef<HTMLDivElement>(null)
	const [largeTitleVisible, setLargeTitleVisible] = useState<boolean>(true)
	const topRef = useRef<HTMLDivElement>(null)

	const bottomTopContentRef = useRef<HTMLDivElement>(null)

	const defaultTitleSwitchScroll = 32,
		gap = 12
	const getTitleSwitchLimit = () => {
		const largeTitleInfo = largeTitleRef.current?.getBoundingClientRect()
		const topBarInfo = topRef.current?.getBoundingClientRect()
		const bottomTopContentInfo =
			bottomTopContentRef.current?.getBoundingClientRect()

		if (!largeTitleInfo || !topBarInfo) {
			return defaultTitleSwitchScroll
		}

		let limit = topBarInfo.bottom - gap

		if (bottomTopContentInfo) {
			limit += bottomTopContentInfo.height
		}
		return limit
	}

	// scroll
	const [scrollY, setScrollY] = useState<number>(0)

	const toggleSearchBarFixation = () => {
		// if (!search) {
		// 	return
		// }

		const topBarInfo = topRef.current?.getBoundingClientRect()
		if (!topBarInfo) {
			console.error('NO topBarInfo')
			return
		}

		// fixing searchbar
		const topBarBottom = topBarInfo.top + topBarInfo.height
		const searchBarShouldBeFixed = getTitleSwitchLimit() <= window.scrollY

		// fix for the clipping title
		const titleGap = 5
		if (largeTitleRef.current) {
			if (
				topBarBottom <= window.scrollY + titleGap &&
				window.scrollY > getTitleSwitchLimit()
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

			const limit = getTitleSwitchLimit()

			// titles visibility
			setSmallTitleVisible(window.scrollY > limit)
			setLargeTitleVisible(window.scrollY <= limit)

			//
			toggleSearchBarFixation()
		}
		window.addEventListener('scroll', handleScroll)
		handleScroll()

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])
	// endregion Titles toggling

	// region SearchBar
	const defaultSearchText = ''
	const [searchbarText, setSearchBarText] = useState<string>(searchText)
	// endregion SearchBar

	const updateSearchText = (text: string) => {
		console.log('updateSearchText', text)
		setSearchBarText(text || defaultSearchText)
	}
	useEffect(() => {
		console.log('uE:', searchText)
		updateSearchText(searchText)
	}, [searchText])

	return (
		<div className="w-full h-[100vh] flex" style={{}}>
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
							onClick={(e) => (goBack && onBack ? onBack(e) : {})}
						>
							{goBack && (
								<>
									<IoChevronBackOutline
										size={28}
										className="shrink-0"
									/>
									<div
										className={
											styles.uiSmallTitleButtonLabel
										}
									>
										{goBackLabel}
									</div>
								</>
							)}
						</button>

						<div
							ref={smallTitleRef}
							style={{ opacity: Number(smallTitleVisible) }}
							className={styles.uiSmallTitle}
						>
							{title}
						</div>

						<div className={styles.uiRightIcon}>
							{renderTopRightIcons()}
						</div>
					</div>
				</div>

				{/* Screen */}
				<div id="uiBottom" className={styles.uiBottom}>
					<div
						id="uiBottomTopContent"
						ref={bottomTopContentRef}
						data-fixed={Number(searchBarIsFixed)}
						className={styles.uiBottomTopContent}
					>
						<div
							style={{
								opacity: Number(largeTitleVisible),
							}}
						>
							{headerContent}
						</div>
					</div>
					<div
						id="uiBottomTop"
						data-fixed={Number(searchBarIsFixed)}
						className={styles.uiBottomTop}
					>
						{/* Large title */}
						<div
							id="largeTitle"
							className={styles.uiLargeTitleContainer}
						>
							<div
								ref={largeTitleRef}
								style={{
									opacity: Number(largeTitleVisible),
								}}
								className={styles.uiLargeTitle}
							>
								{title}
							</div>
							<div
								className={styles.uiLargeTitleRight}
								style={{
									opacity: Number(largeTitleVisible),
								}}
							>
								{titleRightContent}
							</div>
						</div>

						{/* Search bar */}
						{/* {search && 'searchText:' + searchText} */}
						{search && (
							<UISearchBar
								id="searchbar"
								ref={searchBarRef}
								value={searchbarText}
								speechToText={speechToText}
								placeholder={searchPlaceholder}
								data-fixed={Number(searchBarIsFixed)}
								onInput={
									(e) => {
										console.log('UINav SonInput:', e)
										onSearchInput && onSearchInput(e)
										updateSearchText(e.currentTarget.value)
									}
									// setSearchBarText(e.currentTarget.value)
								}
								onTranscript={(value: string) => {
									console.log('UINav SonTranscript:', value)
									onSearchTranscript(value)
								}}
								// speechToText={speechToTextEnabled}
							/>
						)}
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
										{searchbarText}
									</div>
									<div className="text-center text-zinc-700 text-opacity-60 text-[17px] font-normal leading-snug">
										<div>
											{(speechToText && (
												<IoMic
													size={18}
													// data-enabled={Number(
													// 	speechToText
													// )}
													className={`${styles.uiSearchBarSpeechToText}`}
													// onClick={(e: Event) =>
													// 	speechToTextEnabled
													// 		? speechToTextIsListening
													// 			? stopListening(
													// 					e
													// 			  )
													// 			: startListening(
													// 					e
													// 			  )
													// 		: {}
													// }
												/>
											)) ||
												''}
										</div>
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
									{/* <p>transcript : {transcript}</p> */}
									<p>
										speechToText :{' '}
										{speechToText !== undefined
											? Number(speechToText)
											: 'undefined'}
									</p>
									<p>
										speechToTextEnabled :{' '}
										{speechToText !== undefined
											? Number(speechToText)
											: 'undefined'}
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
		</div>
	)
}

UINavigation.defaultProps = defaultProps

export default UINavigation
