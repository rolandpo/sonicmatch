"use client"

type Song = {
  id: string
  title: string
  filename: string
  score?: number
}

type Props = {
  songs: Song[]
}

export default function SongList({ songs }: Props) {
  return (
    <ul className="space-y-2">
      {songs.map((song) => (
        <li key={song.id} className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3">
          <div>
            <p className="font-medium">{song.title}</p>
            {song.score && (
              <p className="text-sm text-gray-400">Match: {(song.score * 100).toFixed(1)}%</p>
            )}
            </div>
            <audio controls src={`http://localhost:8000/audio/${song.filename}`} className="h-8" />
            </li>
      ))}
    </ul>
  )
}
