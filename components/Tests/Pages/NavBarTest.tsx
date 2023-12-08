import React, { useEffect, useRef, useState } from 'react'
import { IoChevronBackOutline, IoMic, IoSearch } from 'react-icons/io5'
import TestsNavLinks from '../TestsNavLinks'

type Props = {}

export default function NavBarTest({}: Props) {
	const iOSDefaultLarge = () => (
		<div className="w-[393px] h-[175px] bg-white bg-opacity-75 border-b border-black border-opacity-30 backdrop-blur-[50px] flex-col justify-start items-center inline-flex">
			<div className="px-[9.50px] py-[11px] justify-start items-start gap-[3px] inline-flex">
				<div className="w-[5px] h-[5px] bg-white bg-opacity-40 rounded-full"></div>
				<div className="w-[5px] h-[5px] bg-white bg-opacity-40 rounded-full"></div>
				<div className="w-[5px] h-[5px] bg-white bg-opacity-40 rounded-full"></div>
			</div>
			<div className="w-[393px] h-11 relative">
				<div className="px-2 py-[11px] left-0 top-0 absolute justify-start items-center gap-[3px] inline-flex">
					<div className="text-center text-blue-600 text-[17px] leading-snug">
						<IoChevronBackOutline />
					</div>
					<div className="text-blue-600 text-[17px] font-normal leading-snug">
						Label
					</div>
				</div>
				<div className="pr-4 py-[11px] left-[352px] top-0 absolute justify-end items-center gap-4 inline-flex">
					<div className="justify-start items-start gap-2.5 flex">
						<div className="text-right text-blue-600 text-[17px] font-normal leading-snug">
							􀓔
						</div>
					</div>
				</div>
			</div>
			<div className="self-stretch h-[52px] px-4 pt-[3px] pb-2 flex-col justify-start items-start gap-2.5 flex">
				<div className="text-black text-[34px] font-bold leading-[41px]">
					Title
				</div>
			</div>
			<div className="self-stretch h-[52px] px-4 pt-px pb-[15px] flex-col justify-start items-start flex">
				<div className="self-stretch px-2 py-[7px] bg-zinc-500 bg-opacity-10 rounded-[10px] justify-start items-center inline-flex">
					<div className="w-[25px] text-zinc-700 text-opacity-60 text-[17px] font-normal leading-snug">
						<IoSearch />
					</div>
					<div className="grow shrink basis-0 h-[22px] text-zinc-700 text-opacity-60 text-[17px] font-normal leading-snug">
						Search
					</div>
					<div className="text-center text-zinc-700 text-opacity-60 text-[17px] font-normal leading-snug">
						<IoMic />
					</div>
				</div>
			</div>
		</div>
	)

	const back = 'Label'
	// const title = 'Bibliothèquexwdsdsdsdq  dqsd qsd '
	const title = 'Playlists'

	// small title
	const titleSwitchScroll = 52
	const smallTitleRef = useRef(null)
	const [smallTitleVisible, setSmallTitleVisible] = useState<boolean>(false)

	// large title
	const largeTitleMaxHeight = 52
	const largeTitleRef = useRef(null)
	const [largeTitleVisible, setLargeTitleVisible] = useState<boolean>(true)
	const [largeTitleHeight, setLargeTitleHeight] = useState<string | number>(
		'auto'
	)

	/**
	 * @todo : en gros c'est la searchbar qui à partir d'un moment doit être sticky en haut, le largeTitle scroll avec le tout
	 */
	useEffect(() => {
		const handleScroll = () => {
			// small title visible
			setSmallTitleVisible(window.scrollY > titleSwitchScroll)
			setLargeTitleVisible(window.scrollY <= titleSwitchScroll)

			if (window.scrollY <= 0) {
				setLargeTitleHeight('auto')
			} else {
				const w = largeTitleMaxHeight - window.scrollY
				setLargeTitleHeight(w > 0 ? w : 0)
			}
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

	const iOSLarge = () => (
		<>
			<div
				className="sticky top-0 z-50 w-full"
				style={{
					gridArea: 'nav-header',
				}}
			>
				<div className="w-full  bg-white bg-opacity-75 border-b border-black border-opacity-30 backdrop-blur-[50px] flex-col justify-start items-center inline-flex">
					{/* Top */}
					<div className="w-full h-11 relative flex items-center justify-between">
						<div className="px-2 py-[11px] justify-start items-center gap-[3px] inline-flex">
							<div className="text-center text-blue-600 text-[17px] leading-snug">
								<IoChevronBackOutline />
							</div>
							<div className="text-blue-600 text-[17px] font-normal leading-snug">
								{back}
							</div>
						</div>

						<div
							ref={smallTitleRef}
							style={{
								opacity: smallTitleVisible ? 1 : 0,
								transition: 'opacity 0.3s ease',
							}}
							className={`text-center text-black text-[17px] leading-snug font-bold items-center justify-center truncate`}
						>
							{title}
						</div>

						<div className="px-4 py-[11px] justify-end items-center gap-4 inline-flex">
							<div className="justify-start items-start gap-2.5 flex">
								<div className="text-right text-blue-600 text-[17px] font-normal leading-snug">
									􀓔
								</div>
							</div>
						</div>
					</div>

					<div className="self-stretch">
						{/* Large title */}
						{/* h-[52px] */}
						<div
							id="largeTitle"
							// className="self-stretch   flex-col justify-start items-start gap-2.5 flex "
							className="self-stretch gap-2.5 flex flex-col justify-start items-start overflow-hidden"
							style={{
								height: largeTitleHeight,
							}}
						>
							<div
								ref={largeTitleRef}
								style={{
									opacity: largeTitleVisible ? 1 : 0,
									transition: 'opacity 0.3s ease',
								}}
								// className="w-full px-4 pt-[3px] pb-2 text-black text-[34px] font-bold leading-[41px] truncate"
								className="w-full px-4 pt-[3px] text-black text-[34px] font-bold leading-[41px] truncate"
							>
								{title}
							</div>
						</div>

						{/* Search bar */}
						<div className="self-stretch px-4 pt-2 pb-[15px] flex-col justify-start items-start flex border-b">
							{/* <div className="self-stretch h-[52px] px-4 pt-px pb-[15px] flex-col justify-start items-start flex border-b"> */}
							<div className="self-stretch px-2 py-[7px] bg-zinc-500 bg-opacity-10 rounded-[10px] justify-start items-center inline-flex">
								<div className="w-[25px] text-zinc-700 text-opacity-60 text-[17px] font-normal leading-snug">
									<IoSearch />
								</div>
								<div className="grow shrink basis-0 h-[22px] text-zinc-700 text-opacity-60 text-[17px] font-normal leading-snug">
									Search
								</div>
								<div className="text-center text-zinc-700 text-opacity-60 text-[17px] font-normal leading-snug">
									<IoMic />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Scroll content */}
			<div
				id="content"
				className="flex w-full text-black font-normal bg-gray "
				style={{
					gridArea: 'nav-content',
				}}
			>
				<div className="overflow-auto">
					<div className={`w-full min-h-[999px] bg-red`}>
						content
						<br />
						<br />
						<br />
						<TestsNavLinks />
					</div>
				</div>
			</div>
		</>
	)

	return (
		<>
			{/* <div className={`w-full min-h-[999px] min-h-[100vh] bg-white `}> */}
			{/* <div className="w-full h-[100vh] grid sticky top-0 bottom-0 bg-blue "> */}
			<div
				className="w-full h-[100vh] grid  bg-blue "
				style={{
					gridTemplateAreas: '"nav-header" "nav-content"',
					gridTemplateColumns: 'minmax(0,1fr)',
					// gridTemplateRows: '45px auto 1fr auto',
				}}
			>
				{iOSLarge()}
			</div>
			{/* <div>{iOSDefaultLarge()}</div> */}
			{/* </div> */}
		</>
	)
}
