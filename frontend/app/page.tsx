"use client"

import { useEffect, useState } from "react"
import ScatterPlot from "@/components/ScatterPlot"
import SongList from "@/components/SongList"

type Song = {
  id: string
  title: string
  filename: string
  x: number
  y: number
}

type Recommendation = {
  id: string
  title: string
  filename: string
  score: number
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([])
  const [selected, setSelected] = useState<Song | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  useEffect(() => {
    fetch("http://localhost:8000/songs")
    .then((r) => r.json())
    .then(setSongs)
  }, [])

  async function handleSelectSong(song: Song) {
    setSelected(song)
    const res = await fetch(`http://localhost:8000/recommend?song_id=${song.id}`)
    const data = await res.json()
    setRecommendations(data)
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">SonicMatch</h1>
      <div className="mb-8">
        <ScatterPlot
          songs={songs}
          recommendations={recommendations}
          onSelect={handleSelectSong}
        />
      </div>
      {selected && (
        <div>
          <p className="text-gray-400 mb-4">
            Similar to <span className="text-white font_semibold">{selected.title}</span>
          </p>
          <SongList songs={recommendations} />
        </div>
      )}
    </main>
  )
}
