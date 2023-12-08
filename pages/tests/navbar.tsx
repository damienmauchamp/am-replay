import Button from '@/components/AppleMusic/Buttons/Button'
import NavBarTest from '@/components/Tests/Pages/NavBarTest'
import TestsNavLinks from '@/components/Tests/TestsNavLinks'

import React, { useState } from 'react'
import { IoReorderThreeOutline, IoVideocamOutline } from 'react-icons/io5'

export default function navbar() {
	const [wrappedIcon, setWrappedIcon] = useState<boolean>(false)
	const [search, setSearch] = useState<boolean>(true)
	const [scrollX, setScrollX] = useState<boolean>(false)
	const [title, setTitle] = useState<string>('Playlists')
	const [back, setBack] = useState<string>('Retour')
	const [searchPlaceholder, setSearchPlaceholder] = useState<string>(
		'Rechercher dans les playlists'
	)
	const [speechToText, setSpeechToText] = useState<boolean>(true)

	const renderTests = () => (
		<>
			<h1>Content</h1>
			<section>
				<h2>Actions</h2>
				<div className="grid grip-cols-2 grip-rows-2 gap-2">
					<Button
						Style="Filled"
						onClick={() => setWrappedIcon(!wrappedIcon)}
					>
						Wrapped icon : {Number(wrappedIcon)}
					</Button>

					<Button Style="Filled" onClick={() => setSearch(!search)}>
						Search : {Number(search)}
					</Button>

					<Button Style="Filled" onClick={() => setScrollX(!scrollX)}>
						ScrollX : {Number(scrollX)}
					</Button>

					<Button
						Style="Filled"
						onClick={() => setSpeechToText(!speechToText)}
					>
						SpeechToText : {Number(speechToText)}
					</Button>

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
							back :
							<input
								type="text"
								name="back"
								value={back}
								onInput={({ currentTarget }) =>
									setBack(currentTarget.value)
								}
							/>
						</label>
					</div>

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

	return (
		<>
			<NavBarTest
				title={title}
				search={search}
				back={back}
				scrollX={scrollX}
				searchPlaceholder={searchPlaceholder}
				TopIcon={
					wrappedIcon ? IoReorderThreeOutline : IoVideocamOutline
				}
				topIconWrapped={wrappedIcon}
				speechToText={speechToText}
			>
				{renderTests()}
			</NavBarTest>
		</>
	)
}
