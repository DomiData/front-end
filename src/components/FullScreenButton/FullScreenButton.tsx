import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

interface Props {
  onToggle: () => void
  isModal: boolean
}

const FullScreenButton = ({ onToggle, isModal }: Props) => {
  const map = useMap()

  useEffect(() => {
    const CustomControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function () {
        const btn = L.DomUtil.create(
          'a',
          'leaflet-bar leaflet-control leaflet-control-custom'
        )
        btn.innerHTML = isModal ? '✕' : '⛶'
        btn.style.backgroundColor = 'white'
        btn.style.width = '34px'
        btn.style.height = '34px'
        btn.style.lineHeight = '34px'
        btn.style.textAlign = 'center'
        btn.style.cursor = 'pointer'
        btn.style.fontSize = '18px'
        btn.style.fontWeight = 'bold'

        btn.onclick = e => {
          e.stopPropagation()
          onToggle()
        }
        return btn
      },
    })

    const control = new CustomControl()
    map.addControl(control)

    setTimeout(() => map.invalidateSize(), 10)

    return () => {
      map.removeControl(control)
    }
  }, [map, onToggle, isModal])

  return null
}

export default FullScreenButton
