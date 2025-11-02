import { useState, useRef } from 'react'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { Mic, MicOff, Send, CircleStop } from 'lucide-react'
import apiUrl from './apiUrl'
import { useAccessToken } from './hooks/useAccessToken'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onStop: () => void
  isLoading: boolean
}

function ChatInput({ onSendMessage, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [partialText, setPartialText] = useState('')
  const [recording, setRecording] = useState(false)
  const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null)
  const audioConfigRef = useRef<SpeechSDK.AudioConfig | null>(null)
  const { getToken } = useAccessToken()

  async function fetchToken() {
    const token = await getToken()
    const res = await fetch(`${apiUrl}/speech/token`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
    })
    if (!res.ok) throw new Error("Unable to fetch speech token")
    const body = await res.json()
    return body
  }

  const handleMic = () => {
    if (recording) {
      stopRecording()
    }
    else {
      startRecording()
    }
  }

  const startRecording = async () => {
    const { token, region } = await fetchToken()
    const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region)
    speechConfig.speechRecognitionLanguage = "en-US"

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
    audioConfigRef.current = audioConfig

    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig)
    recognizerRef.current = recognizer

    recognizer.recognizing = (_s, e) => {
      const text = e.result.text
      setPartialText(text)
    }

    recognizer.recognized = (_s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        const text = e.result.text
        setInput(prev => prev ? prev + ' ' + text : text)
        setPartialText('')
      } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
        // no speech recognized
      }
    }

    recognizer.startContinuousRecognitionAsync(
      () => {
        setRecording(true)
      },
      (err) => {
        console.error("Failed to start recognition:", err)
        stopRecording()
      }
    )

    recognizer.sessionStopped = () => {
      console.log("session stopped")
      recognizerRef.current = null
      setRecording(false)
    }

    recognizer.canceled = (_s, e) => {
      console.warn("Recognition canceled:", e)
      recognizerRef.current = null
      setRecording(false)
    }
  }

  const stopRecording = () => {
    const recognizer = recognizerRef.current
    if (!recognizer) return
    recognizer.stopContinuousRecognitionAsync(() => {}, console.error)
  }

  const handleSendMessage = () => {
    stopRecording()
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  }

  const handleStopInterview = () => {
    stopRecording()
    onStop()
  }

  const handleTextChange = (text: string) => {
    if (recording) return
    setInput(text)
  }

  return (
    <div className="chat-input flex flex-col p-3 bg-gray-800 border-t border-gray-700 items-center sticky bottom-0 pb-[env(safe-area-inset-bottom)] z-10">
      <div className="flex w-full gap-3">
        <textarea
          className="flex-1 resize-none bg-gray-700 border border-gray-600 rounded-xl p-3 text-base text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out min-h-[48px] max-h-40"
          value={partialText ? input + ' ' + partialText : input}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyUp={async (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={recording}
          placeholder="Type your message..."
          rows={2}
        />
        <button
          className="mic-button btn-chat-input"
          onClick={handleMic}
          aria-label="Record voice message"
        >
          {recording ? <MicOff size={22} /> : <Mic size={22} />
          }
        </button>
        <button
          className="send-button btn-chat-input"
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
        >
          <Send size={22} />
        </button>
        <button
          className="stop-button btn-chat-input"
          onClick={handleStopInterview}
          disabled={isLoading}
          aria-label="Stop Interview"
        >
          <CircleStop size={22} />
        </button>
      </div>
      <p className="text-gray-500 text-xs my-2">Press Enter to send, Shift + Enter for new line</p>
    </div>
  )
}

export default ChatInput
