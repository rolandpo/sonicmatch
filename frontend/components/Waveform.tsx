"use client"

import { useEffect, useRef } from "react"
import WaveSurfer from "wavesurfer.js"

type Props = {
  url: string
}

export default function Waveform({ url }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#6366f1",
      progressColor: "#f43f5e",
      cursorColor: "white",
      height: 80,
      barWidth: 2,
      barGap: 1
    })

    wavesurferRef.current.load(url)

    return () => {
      wavesurferRef.current?.destroy()
    }
  }, [url])

  return (
    <div
    ref={containerRef}
    className="w-full bg-gray-900 rounded-xl p-4 cursor-pointer"
    onClick={() => wavesurferRef.current?.playPause()}
    />
  )
}
