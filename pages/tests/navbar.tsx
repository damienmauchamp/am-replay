import Button from '@/components/AppleMusic/Buttons/Button'
import UICollectionView from '@/components/AppleMusic/Layout/UICollectionView/UICollectionView'
import UINavigation, {
	UINavBarTopCornerIconProps,
} from '@/components/AppleMusic/Navigation/UINavigation/UINavigation'
import TestsNavLinks from '@/components/Tests/TestsNavLinks'
import { getColor } from '@/helpers/colors'
import tailwindConfig, { buttonColor, iOSTheme } from '@/tailwind.config'

import React, { useRef, useState } from 'react'
import {
	IoAddOutline,
	IoPersonCircleOutline,
	IoReorderThreeOutline,
	IoVideocamOutline,
} from 'react-icons/io5'

export default function navbar() {
	const [search, setSearch] = useState<boolean>(true)
	const [scrollX, setScrollX] = useState<boolean>(false)
	const [title, setTitle] = useState<string>('Playlists')
	const [goBack, setGoBack] = useState<boolean>(true)
	const [goBackLabel, setGoBackLabel] = useState<string>('Retour')
	const onBack = () => console.log('onBack()')
	const [searchText, setSearchText] = useState<string>('ddff')
	const [searchPlaceholder, setSearchPlaceholder] = useState<string>(
		'Rechercher dans les playlists'
	)
	const [speechToText, setSpeechToText] = useState<boolean>(true)
	const [transcript, setTranscript] = useState<string>('')
	const [topIconActive, setTopIconActive] = useState<boolean>(true)

	const topCornerIcons = [
		{
			title: 'Add',
			Icon: IoAddOutline,
			wrapped: true,
			active: topIconActive,
			onClick: () => console.log('topCorner : Add'),
		},
		// {
		// 	title: 'Sort',
		// 	Icon: IoReorderThreeOutline,
		// 	wrapped: true,
		// 	active: false,
		// 	onClick: () => console.log('topCorner : Sort'),
		// 	ref: useRef(),
		// 	// ref: useRef<HTMLDivElement>(),
		// },
		{
			title: 'Camera',
			Icon: IoVideocamOutline,
			wrapped: false,
			active: false,
			onClick: () => console.log('topCorner : Camera'),
		},
	] as UINavBarTopCornerIconProps[]

	const renderTests = () => (
		<>
			<h1>Content</h1>
			<section>
				<h2>Actions</h2>
				<div className="grid grip-cols-2 grip-rows-2 gap-2">
					<Button Style="Filled" onClick={() => setSearch(!search)}>
						Search : {Number(search)}
					</Button>

					<Button Style="Filled" onClick={() => setScrollX(!scrollX)}>
						ScrollX : {Number(scrollX)}
					</Button>

					<Button
						Style="Filled"
						onClick={() => setTopIconActive(!topIconActive)}
					>
						topIconActive : {Number(topIconActive)}
					</Button>

					<Button
						Style="Filled"
						onClick={() => setSpeechToText(!speechToText)}
					>
						SpeechToText : {Number(speechToText)}
					</Button>

					<div>
						<label>
							searchText :
							<input
								type="text"
								name="searchText"
								value={searchText}
								onInput={({ currentTarget }) => {
									setSearchText(currentTarget.value)
								}}
							/>
						</label>
					</div>

					<p>transcript : {transcript} </p>

					<div>
						<label>
							title :
							<input
								type="text"
								name="title"
								value={title}
								onInput={({ currentTarget }) =>
									setTitle(currentTarget.value)
								}
							/>
						</label>
					</div>

					<div>
						<label>
							goBackLabel :
							<input
								type="text"
								name="goBackLabel"
								value={goBackLabel}
								onInput={({ currentTarget }) =>
									setGoBackLabel(currentTarget.value)
								}
							/>
						</label>
					</div>

					<Button Style="Filled" onClick={() => setGoBack(!goBack)}>
						GoBack : {Number(goBack)}
					</Button>

					<div>
						<label>
							searchPlaceholder :
							<input
								type="text"
								name="searchPlaceholder"
								value={searchPlaceholder}
								onInput={({ currentTarget }) =>
									setSearchPlaceholder(currentTarget.value)
								}
							/>
						</label>
					</div>
				</div>
			</section>
		</>
	)

	const renderTestCollection = () => {
		const items = [...Array(16)].map((value, index) => {
			return (
				<div
					key={`ti${index}`}
					style={{
						height: index % 2 ? 50 : 40,
						background: index % 2 ? 'teal' : 'purple',
					}}
				>
					{index}
				</div>
			)
		})

		console.log('items', items)

		return <UICollectionView items={items} />
	}

	return (
		<>
			<UINavigation
				title={title}
				search={search}
				searchText={searchText}
				onSearchInput={(e) => {
					setSearchText(e.currentTarget.value)
					console.log('LAUNCH SEARCH', e.currentTarget.value)
				}}
				onSearchTranscript={(value) => {
					setTranscript(value)
				}}
				// onSearch
				goBack={goBack}
				goBackLabel={goBackLabel}
				onBack={onBack}
				scrollX={scrollX}
				searchPlaceholder={searchPlaceholder}
				speechToText={speechToText}
				topCornerIcons={topCornerIcons}
				// headerContent={
				// 	<>
				// 		<p>Hey !!!</p>
				// 		<p>Cooool</p>
				// 	</>
				// }
				titleRightContent={
					<div className="self-stretch ml-auto">
						<IoPersonCircleOutline
							className={`cursor-pointer`}
							onClick={() => {
								console.log('todo')
							}}
							size={40}
							style={{
								color: getColor(buttonColor),
							}}
						/>
					</div>
				}
			>
				{renderTests()}
				{renderTestCollection()}
			</UINavigation>
		</>
	)
}
