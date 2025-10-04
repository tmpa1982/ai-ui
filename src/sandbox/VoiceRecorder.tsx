import { useState, useRef } from "react"
import apiUrl from "../apiUrl";

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        sendChunkToServer(event.data)
      }
    }

    mediaRecorder.start(1000) // collect every 1s
    setRecording(true)
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const sendChunkToServer = async (chunk: Blob) => {
    const formData = new FormData()
    formData.append("file", chunk, "chunk.webm")

    await fetch(`${apiUrl}/upload/audio`, {
      method: "POST",
      body: formData,
    })
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
    </div>
  )
}
