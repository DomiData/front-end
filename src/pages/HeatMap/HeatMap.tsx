import type React from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './HeatMap.css'
import L from 'leaflet'
import { useEffect } from 'react'
import 'leaflet.heat'

const addressPoints = [
  [-7.2208, -35.8888, 1],
  [-7.221, -35.889, 0.8],
  [-7.2215, -35.888, 0.5],
  [-7.22, -35.8895, 0.9],
  [-7.219, -35.887, 0.4],
]

const HeatmapLayer = ({ points }: { points: number[][] }) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    // @ts-ignore
    const heat = L.heatLayer(points, {
      radius: 40,
      blur: 20,
      maxZoom: 17,
    }).addTo(map)

    return () => {
      map.removeLayer(heat)
    }
  }, [map, points])

  return null
}

export const HeatMap: React.FC = () => {
  return (
    <div className="container">
      <MapContainer center={[-7.220847631070851, -35.88883988531144]} zoom={13}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <HeatmapLayer points={addressPoints} />
      </MapContainer>
    </div>
  )
}
