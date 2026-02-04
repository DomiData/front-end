import React from 'react'
import { useMap } from 'react-leaflet'

interface ChangeViewProps {
  center: [number, number]
}

export const ChangeView: React.FC<ChangeViewProps> = ({ center }) => {
  const map = useMap()

  React.useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}
