import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

interface HeatMapLayerProps {
  points: [number, number, number][] // [lat, lng, intensity]
  options?: {
    radius?: number
    blur?: number
    maxZoom?: number
    max?: number
    minOpacity?: number
    gradient?: Record<number, string>
  }
}

export const HeatMapLayer: React.FC<HeatMapLayerProps> = ({
  points,
  options = {},
}) => {
  const map = useMap()

  useEffect(() => {
    if (!map || points.length === 0) return

    const defaultOptions = {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      minOpacity: 0.4,
      ...options,
    }
    const heatLayer = L.heatLayer(points, defaultOptions)
    heatLayer.addTo(map)

    // Cleanup ao desmontar
    return () => {
      map.removeLayer(heatLayer)
    }
  }, [map, points, options])

  return null
}
