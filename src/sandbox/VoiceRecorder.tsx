import { useState, useRef } from "react"
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk"
import apiUrl from "../apiUrl";

export default function VoiceRecorder() {
  const [finalText, setFinalText] = useState("");
  const [partialText, setPartialText] = useState("");
  const [recording, setRecording] = useState(false)
  const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null)
  const audioConfigRef = useRef<SpeechSDK.AudioConfig | null>(null)

  async function fetchToken() {
    const res = await fetch(`${apiUrl}/speech/token`);
    if (!res.ok) throw new Error("Unable to fetch speech token");
    const body = await res.json();
    return body;
  }

  const startRecording = async () => {
    const { token, region } = await fetchToken()
    const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region)
    speechConfig.speechRecognitionLanguage = "en-US"

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
    audioConfigRef.current = audioConfig

    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    recognizerRef.current = recognizer

    recognizer.recognizing = (_s, e) => {
      setPartialText(e.result.text);
    }    

    recognizer.recognized = (_s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        const text = e.result.text
        setFinalText((prev) => (prev ? prev + " " + text : text))
        setPartialText("")
      } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
        // no speech recognized
      }
    }

    recognizer.startContinuousRecognitionAsync(
      () => {
        setRecording(true);
      },
      (err) => {
        console.error("Failed to start recognition:", err)
        stopRecording()
      }
    )

    recognizer.sessionStopped = () => {
      console.log("Session stopped")
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

  return (
    <div className="p-4 bg-black h-screen">
      {recording ? (
        <button onClick={stopRecording} className="bg-red-500 text-white p-2 rounded">
          Stop Recording
        </button>
      ) : (
        <button onClick={startRecording} className="bg-green-500 text-white p-2 rounded">
          Start Recording
        </button>
      )}
      <div className="text-gray-100">{partialText}</div>
      <div className="text-gray-300">{finalText}</div>
    </div>
  )
}
