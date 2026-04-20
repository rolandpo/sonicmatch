"use client"

import dynamic from "next/dynamic"
import Plotly, { type PlotMouseEvent } from "plotly.js"

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

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

type Props = {
  songs: Song[]
  recommendations: Recommendation[]
  onSelect: (song: Song) => void
}

export default function ScatterPlot({ songs, recommendations, onSelect}: Props) {
  const recommendedIds = new Set( recommendations.map((r) => r.id))

  const normal = songs.filter((s) => !recommendedIds.has(s.id))
  const highlighted = songs.filter((s) => recommendedIds.has(s.id))

  return (
    <Plot
      data={[
        {
          type: "scatter",
          mode: "markers",
          x: normal.map((s) => s.x) as unknown as Plotly.Datum[],
          y: normal.map((s) => s.y) as unknown as Plotly.Datum[],
          text: normal.map((s) => s.title),
          marker: { color: "#6366f1", size: 8 },
          hovertemplate: "%{text}<extra></extra>",
          customdata: normal as unknown as Plotly.Datum[]
        },
        {
          type: "scatter",
          mode: "markers",
          x: highlighted.map((s) => s.x) as unknown as Plotly.Datum[],
          y: highlighted.map((s) => s.y) as unknown as Plotly.Datum[],
          text: highlighted.map((s) => s.title),
          marker: { color: "#3f43f5e", size: 10 },
          hovertemplate: "%{text}<extra></extra>",
          customdata: highlighted as unknown as Plotly.Datum[]
        }
      ]}
    layout={{
      paper_bgcolor: "transparant",
      plot_bgcolor: "transparant",
      font: { color: "white" },
      showlegend: false,
      xaxis: { showgrid: false, zeroline: false, showticklabels: false },
      yaxis: { showgrid: false, zeroline: false, showticklabels: false },
      margin: { t: 0, r: 0, b: 0, l: 0 }
    }}
    onClick={(e: PlotMouseEvent) => {
      const song = e.points[0].customdata as unknown as Song
      onSelect(song)
    }}
    style={{ width: "100%", height: "500px" }}
    config={{ displayModeBar: false }}
    />
  )
}
