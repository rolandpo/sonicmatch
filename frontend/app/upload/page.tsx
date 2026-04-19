"use client"

import { useState } from "react"
import Link from "next/link"
import UploadZone from "@/components/UploadZone"
import Waveform from "@/components/Waveform"

type UploadedSong = {
  id: string
  title: string
  filename: string
}

export default function UploadPage() {
  const [uploaded, setUploaded] = useState<UploadedSong[]>([])
  const [selected, setSelected] = useState<UploadedSong | null>(null)

return (
  <main className="p-8 max-w-2xl mx-auto">
    <div className="flex-items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Upload Songs</h1>
      <Link href="/" className="text-indigo-400 hover:text-indigo-300">
        Back to catalog
      </Link>
    </div>

    <UploadZone onUploaded={(songs) => setUploaded((prev) => [...prev, ...songs])} />
  
    {uploaded.length > 0 && (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Uploaded</h2>
        <ul className="space-y-2">
          {uploaded.map((song) => (
            <li
            key={song.id}
            className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-800"
            onClick={() => setSelected(song)}
          >
            <p className="font-medium">{song.title}</p>
            <audio controls src={`http://localhost:8000/audio/${song.filename}`} className="h-8" />
            </li>
          ))}
      </ul>
    </div>
    )}

    {selected && (
      <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Waveform - {selected.title}</h2>
        <Waveform url={`http://localhost:8000/audio/${selected.filename}`}
      />
      </div>
    )}
  </main>
)}
