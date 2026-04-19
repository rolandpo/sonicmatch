"use client"

import { useState, useRef } from "react"

type UploadedSong = {
  id: string
  title: string
  filename: string
}

type Props = {
  onUploaded: (songs: UploadedSong[]) => void
}

export default function UploadZone({ onUploaded }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append("files", file))

    const res = await fetch("http://localhost:8000/upload/batch", {
      method: "POST",
      body: formData
    })

    const data = await res.json()
    setProgress(100)
    setUploading(false)
    onUploaded(data)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transistion-colors ${dragging ? "border-indigo-400 bg-indigo-950" : "border-gray-700 hover:border-gray-500"}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".mp3"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      {uploading ? (
        <div>
          <p className="text-gray-400 mb-3">Uploading...</p>
          <div className="w-full bg_greay-800 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full transition-a;;" style={{ width: `${progress}%` }} />
            </div>
          </div>
      ) : (
        <p className="text-gray-400">Drop MP3s here or click to select</p>
      )}
    </div>
  )
}
