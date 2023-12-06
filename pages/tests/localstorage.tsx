import Button from '@/components/AppleMusic/Buttons/Button'
import ButtonTestPage from '@/components/Tests/Pages/ButtonTestPage'
import SegmentedControlsTestPage from '@/components/Tests/Pages/SegmentedControlsTestPage'
import { iOSTheme } from '@/tailwind.config'

import React, { useEffect, useRef, useState } from 'react'

/**
 * @todo : useMemo / useCallback (car tous les components se regénère à chaque action)
 */
export default function localStoragePage() {
	const [value, setValue] = useState<number>(0)
	const [storageValue, setStorageValue] = useState<any[]>([])
	const [inputValue, setInputValue] = useState<string>('first')
	const inputRef = useRef<HTMLInputElement>(null)
	const key = 'testData'

	const getStorage = () => JSON.parse(localStorage.getItem(key) || '[]')
	const setStorage = (newTestData: any[]) => {
		localStorage.setItem(key, JSON.stringify(newTestData))
		setStorageValue(newTestData)
	}

	const getCurrent = () => ({
		value: value,
		inputValue: inputValue,
		inputRefValue: inputRef.current?.value,
	})

	const onLog = () => {
		console.log('[onLog] current:', getCurrent())
		console.log('[onLog] localStorage:', getStorage())
	}

	const onSave = () => {
		if (typeof window !== 'undefined') {
			const testData = getStorage()

			const newTestData = [...testData]
			const valueIndex = newTestData.findIndex(
				(elt: any) => elt.inputValue === inputValue
			)
			if (valueIndex < 0) {
				newTestData.push(getCurrent())
			} else {
				newTestData[valueIndex] = getCurrent()
			}
			setStorage(newTestData)

			return true
		} else {
			console.log('[onSave] noWindow')
			return false
		}
	}

	const onReset = () => setStorage([])

	useEffect(() => {
		console.log('MOUNTED')
		if (typeof window !== 'undefined') {
			setStorageValue(getStorage())
		}
		return () => {
			console.log('UNMOUNTED')
		}
	}, [])

	const buttonClassNames = () => '!w-auto'
	return (
		<div className="flex flex-col w-full my-24 mx-auto h-500 p-4 items-center justify-center">
			<div>Value : {value}</div>

			<input
				ref={inputRef}
				type="text"
				value={inputValue}
				// onInput={(e) => setInputValue(e.target.value)}
				onInput={(e) => setInputValue(inputRef.current?.value || '')}
			/>

			<div className="grid grid-cols-2 gap-4 p-2">
				<Button
					className={buttonClassNames()}
					Style="Filled"
					Color={iOSTheme.color.teal}
					onClick={() => setValue(value + 1)}
				>
					Increment
				</Button>
				<Button
					className={buttonClassNames()}
					Style="Filled"
					Color={iOSTheme.color.purple}
					onClick={() => setValue(value - 1)}
				>
					Decrement
				</Button>

				<Button
					className={buttonClassNames()}
					Style="Filled"
					Color={iOSTheme.color.green}
					onClick={onSave}
				>
					Save
				</Button>

				<Button
					className={buttonClassNames()}
					Style="Filled"
					Color={iOSTheme.color.red}
					onClick={onReset}
				>
					Reset
				</Button>

				<Button
					className={buttonClassNames()}
					Style="Filled"
					Color={iOSTheme.color.gray4.dark}
					onClick={onLog}
				>
					Log
				</Button>
			</div>

			<pre className="whitespace-wrap whitespace-break-spaces overflow-hidden  break-words max-w-full text-xs">
				{JSON.stringify(storageValue)}
			</pre>
			{/* <pre className="">{JSON.stringify(getStorage())}</pre> */}
		</div>
	)
}
