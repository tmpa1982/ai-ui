import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { FolderUp, Loader2 } from 'lucide-react'
import apiUrl from './apiUrl'

interface InterviewSetupProps {
  onSubmit: () => void
}

export default function InterviewSetup({ onSubmit }: InterviewSetupProps) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    setMessage(null)
    setError(null)
    setProgress(null)
    const f = e.target.files && e.target.files[0]
    setFile(f ?? null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (!file) {
      setError("Please select a file to upload.")
      return
    }

    const form = new FormData()
    form.append("file", file)

    setIsUploading(true)
    setProgress(0)

    try {
      // Use XMLHttpRequest so we can report upload progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", `${apiUrl}/upload/storage_account`)

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const pct = Math.round((evt.loaded / evt.total) * 100)
            setProgress(pct)
          }
        }

        xhr.onload = () => {
          setIsUploading(false)
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText)
              setMessage(`Uploaded: ${json.blob} (${json.size_bytes} bytes)`)
              setFile(null)
              setProgress(100)
              resolve()
            } catch {
              setMessage("Upload succeeded (could not parse response)")
              resolve()
            }
          } else {
            setError(`Upload failed: ${xhr.status} ${xhr.statusText}`)
            reject(new Error(xhr.statusText))
          }
        }

        xhr.onerror = () => {
          setIsUploading(false)
          setError("Network error while uploading")
          reject(new Error("network error"))
        }

        xhr.send(form)
      })
    } catch (err) {
      // error state already set in handlers above
      if (!error && err instanceof Error) setError(err?.message ?? "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="interview-setup h-full flex flex-col justify-center items-center">
      <div className="content-box p-8 justify-center">
        <h1 className="heading-main">Upload CV</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <div className="mt-1 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 hover:bg-gray-50">
                <FolderUp />
                <span className="text-sm">Choose file</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={onFileChange}
                  data-testid="file-input"
                />
              </label>

              <div className="text-sm text-gray-600">
                {file ? (
                  <div className="flex flex-col">
                    <span className="font-medium">{file.name}</span>
                    <span className="text-xs">{Math.round(file.size / 1024)} KB</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No file selected</span>
                )}
              </div>
            </div>
          </label>

          <div>
            <button
              type="submit"
              className="btn-primary m-4 px-6 py-3"
              disabled={!file || isUploading}
            >
              {isUploading ? <Loader2 /> : null}
              <span>{isUploading ? "Uploading..." : "Upload"}</span>
            </button>
          </div>

          {progress !== null && (
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {message && <div className="text-green-700 text-sm">{message}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      </div>
      <button className="btn-primary m-4 px-8 py-4" onClick={onSubmit}>Start!</button>
    </div>
  )
}
