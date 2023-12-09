import React, {
	ForwardedRef,
	HTMLProps,
	forwardRef,
	useEffect,
	useState,
} from 'react'
import styles from './UISearchBar.module.css'
import { IoMic, IoSearch } from 'react-icons/io5'
import 'regenerator-runtime/runtime'
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition'

export interface UISearchBarProps extends HTMLProps<HTMLDivElement> {
	value: string
	onInput: React.FormEventHandler<HTMLInputElement> | undefined
	onTranscript: (value: string) => void
	speechToText?: boolean
}

// export const defaultProps: UISearchBarProps = {}

const UISearchBar = forwardRef(
	(
		{
			value,
			onInput,
			speechToText,
			onTranscript,
			placeholder,
			...props
		}: UISearchBarProps,
		ref: ForwardedRef<HTMLDivElement>
	) => {
		// searchText
		const [searchbarText, setSearchBarText] = useState<string>(value)
		const updateSearchText = (text: string) => setSearchBarText(text)

		useEffect(() => {
			updateSearchText(value)
		}, [value])

		// transcript
		const {
			transcript,
			browserSupportsSpeechRecognition,
			isMicrophoneAvailable,
		} = useSpeechRecognition()

		const [speechToTextEnabled, setSpeechToTextEnabled] = useState<boolean>(
			Boolean(speechToText)
		)
		const [speechToTextIsListening, setSpeechToTextIsListening] =
			useState<boolean>(false)

		const startListening = (event: any) => {
			if (!isMicrophoneAvailable || !speechToTextEnabled) {
				// todo : handle error ?
				setSpeechToTextEnabled(false)
				console.error('Mic not available')
				return
			}
			setSpeechToTextIsListening(true)
			SpeechRecognition.startListening()
		}
		const stopListening = (event: any) => {
			SpeechRecognition.stopListening()
			setSpeechToTextIsListening(false)
			updateSearchText(transcript)
		}

		useEffect(() => {
			if (!browserSupportsSpeechRecognition) {
				setSpeechToTextEnabled(false)
			}
		}, [])
		useEffect(() => {
			setSpeechToTextEnabled(Boolean(speechToText))
		}, [speechToText])
		useEffect(() => {
			updateSearchText(transcript)
			onInput &&
				onInput({
					currentTarget: { value: transcript },
				} as React.FormEvent<HTMLInputElement>)
			onTranscript && onTranscript(transcript)
		}, [transcript])

		const renderMic = () => {
			return (
				<div
					className={styles.inputMicIcon}
					onClick={(event) => {
						console.log('click Mic')
						return speechToTextEnabled
							? speechToTextIsListening
								? stopListening(event)
								: startListening(event)
							: {}
					}}
				>
					<IoMic
						size={18}
						className={`${
							speechToTextIsListening ? 'text-green' : ''
						}`}
					/>
				</div>
			)
		}

		return (
			<div
				ref={ref}
				{...props}
				className={`${props.className} ${styles.searchbar}`}
			>
				<div className={styles.inputContainer}>
					<input
						className={styles.input}
						type="text"
						value={searchbarText}
						onInput={(e: React.FormEvent<HTMLInputElement>) => {
							updateSearchText(e.currentTarget.value)
							return onInput && onInput(e)
						}}
						placeholder={placeholder}
					/>

					<div className={styles.inputIcons}>
						<div className={styles.inputIconsContainer}>
							<div className={styles.inputSearchIcon}>
								<IoSearch size={18} />
							</div>
							{speechToText && renderMic()}
						</div>
					</div>
				</div>
			</div>
		)
	}
)

// UISearchBar.defaultProps = defaultProps

export default UISearchBar
