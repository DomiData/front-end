import React, { useState, useMemo } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { HeatMapLayer } from './HeatMapLayer'
import {
  CAMPINA_GRANDE_CENTER,
  DEFAULT_ZOOM,
  mockDiseaseData,
  toHeatmapData,
  getAvailableDiseases,
} from '@/data/mockDiseaseData'
import 'leaflet/dist/leaflet.css'
import './HeatMap.css'

interface HeatMapProps {
  className?: string
}

// Função para gerar gradiente baseado na cor da doença
const generateGradient = (baseColor: string) => ({
  0.0: '#ffffff00',
  0.2: `${baseColor}33`,
  0.4: `${baseColor}66`,
  0.6: `${baseColor}99`,
  0.8: `${baseColor}cc`,
  1.0: baseColor,
})

export const HeatMap: React.FC<HeatMapProps> = ({ className = '' }) => {
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(['dengue'])
  const diseases = getAvailableDiseases()

  const toggleDisease = (diseaseId: string) => {
    setSelectedDiseases(prev => {
      if (prev.includes(diseaseId)) {
        if (prev.length === 1) return prev
        return prev.filter(id => id !== diseaseId)
      } else {
        return [...prev, diseaseId]
      }
    })
  }

  const selectAll = () => {
    setSelectedDiseases(diseases.map(d => d.id))
  }

  const clearSelection = () => {
    setSelectedDiseases(['dengue'])
  }

  const diseaseLayers = useMemo(() => {
    return selectedDiseases
      .map(diseaseId => {
        const diseaseData = mockDiseaseData.find(d => d.id === diseaseId)
        if (!diseaseData) return null
        return {
          id: diseaseData.id,
          name: diseaseData.name,
          color: diseaseData.color,
          points: toHeatmapData(diseaseData.points),
          gradient: generateGradient(diseaseData.color),
        }
      })
      .filter(Boolean)
  }, [selectedDiseases])

  return (
    <div className={`heatmap-wrapper ${className}`}>
      {/* Controles */}
      <div className="heatmap-controls">
        <div className="controls-header">
          <h3>Selecione as Doenças</h3>
          <div className="controls-actions">
            <button className="action-button" onClick={selectAll}>
              Todas
            </button>
            <button className="action-button" onClick={clearSelection}>
              Limpar
            </button>
          </div>
        </div>
        <div className="disease-buttons">
          {diseases.map(disease => (
            <button
              key={disease.id}
              className={`disease-button ${selectedDiseases.includes(disease.id) ? 'active' : ''}`}
              onClick={() => toggleDisease(disease.id)}
              style={
                {
                  '--disease-color': disease.color,
                } as React.CSSProperties
              }
            >
              <span
                className="disease-indicator"
                style={{ backgroundColor: disease.color }}
              />
              {disease.name}
            </button>
          ))}
        </div>
        {selectedDiseases.length > 1 && (
          <p className="multi-select-hint">
            {selectedDiseases.length} doenças selecionadas
          </p>
        )}
      </div>

      {/* Mapa */}
      <div className="heatmap-container">
        <MapContainer
          center={[CAMPINA_GRANDE_CENTER.lat, CAMPINA_GRANDE_CENTER.lng]}
          zoom={DEFAULT_ZOOM}
          className="heatmap-map"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {diseaseLayers.map(
            layer =>
              layer && (
                <HeatMapLayer
                  key={layer.id}
                  points={layer.points}
                  options={{
                    radius: 30,
                    blur: 20,
                    maxZoom: 17,
                    gradient: layer.gradient,
                  }}
                />
              )
          )}
        </MapContainer>
      </div>

      {/* Legenda */}
      <div className="heatmap-legend">
        <h4>Doenças Selecionadas</h4>
        <div className="legend-items">
          {diseaseLayers.map(
            layer =>
              layer && (
                <div key={layer.id} className="legend-item">
                  <span
                    className="legend-color"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span>{layer.name}</span>
                  <div
                    className="legend-mini-gradient"
                    style={{
                      background: `linear-gradient(to right, #ffffff, ${layer.color})`,
                    }}
                  />
                </div>
              )
          )}
        </div>
        <div className="legend-intensity">
          <span className="legend-label">Intensidade: Baixa → Alta</span>
        </div>
      </div>

      {/* Info */}
      <div className="heatmap-info">
        <p>
          <strong>📍 Campina Grande, PB</strong>
        </p>
        <p className="info-note">* Dados simulados para demonstração</p>
      </div>
    </div>
  )
}
