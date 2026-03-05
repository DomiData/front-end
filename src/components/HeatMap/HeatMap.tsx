import React, { useState, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { HeatMapLayer } from './HeatMapLayer'
import api from '@/services/api'
import {
  CAMPINA_GRANDE_CENTER,
  DEFAULT_ZOOM,
  mockDiseaseData,
  toHeatmapData,
  getAvailableDiseases,
} from '@/data/mockDiseaseData'
import 'leaflet/dist/leaflet.css'
import './HeatMap.css'
import { FiltroDatas } from '../FiltroDatas/FiltroDatas'
import { FiltroLocalizacao } from '../FiltroLocalizacao/FiltroLocalizacao'
import { ChangeView } from '../ChangeView/ChangeView'
import { Search } from 'lucide-react'
import FullScreenButton from '../FullScreenButton/FullScreenButton'

interface HeatMapProps {
  className?: string
}
export interface FiltroDataState {
  inicio: string | null
  fim: string | null
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

interface DiseasePoints {
  lat: number
  lng: number
  intensity: number
}

export const HeatMap: React.FC<HeatMapProps> = ({ className = '' }) => {
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(['DENG'])
  const [diseasePoints, setDiseasePoints] = useState<DiseasePoints[]>([])

  const [datas, setDatas] = useState<FiltroDataState>({
    inicio: null,
    fim: null,
  })
  const [selectedCidadeCode, setSelectedCidadeCode] = useState<number | null>(
    2504009
  )
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [naturalQuery, setNaturalQuery] = useState<string>('')
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [, setIsNaturalSearchActive] = useState<boolean>(false)
  const [, setNaturalSearchColor] = useState<string>('#ff4444')

  const [isModal, setIsModal] = useState(false)

  const diseases = getAvailableDiseases()

  // Detecta a doença mencionada na query e retorna o ID e cor
  const detectDiseaseFromQuery = (
    query: string
  ): { id: string; color: string } | null => {
    const queryLower = query.toLowerCase()
    const diseaseKeywords: Record<string, { id: string; color: string }> = {
      dengue: { id: 'DENG', color: '#ff4444' },
      chikungunya: { id: 'CHIK', color: '#ff9800' },
      chik: { id: 'CHIK', color: '#ff9800' },
      zika: { id: 'ZIKA', color: '#9c27b0' },
    }

    for (const [keyword, disease] of Object.entries(diseaseKeywords)) {
      if (queryLower.includes(keyword)) {
        return disease
      }
    }
    return null
  }

  const toggleDisease = (diseaseId: string) => {
    setIsNaturalSearchActive(false) // Desativa modo de busca natural ao mudar toggle
    setSelectedDiseases(prev => {
      if (prev.includes(diseaseId)) {
        if (prev.length === 1) return prev
        return prev.filter(id => id !== diseaseId)
      } else {
        console.log(diseaseId)
        return [diseaseId]
      }
    })
  }

  const selectAll = () => {
    setIsNaturalSearchActive(false)
    setSelectedDiseases(diseases.map(d => d.id))
  }

  const clearSelection = () => {
    setIsNaturalSearchActive(false)
    setSelectedDiseases(['dengue'])
  }

  const handleMudancaData = (novasDatas: FiltroDataState) => {
    setDatas(novasDatas)
    console.log(novasDatas)
  }

  const handleMudancaCidade = (cidadeSelectedCode: number | null) => {
    setSelectedCidadeCode(cidadeSelectedCode)
  }

  const handleMudancaEstado = (_estadoCode: number | null) => {
    // reserved for future use
  }

  const isFormComplete = useMemo(() => {
    return (
      selectedDiseases.length > 0 &&
      datas.inicio !== null &&
      datas.fim !== null &&
      selectedCidadeCode !== null
    )
  }, [selectedDiseases, datas, selectedCidadeCode])

  const mapCenter = useMemo((): [number, number] | null => {
    if (diseasePoints.length > 0) {
      return [diseasePoints[2].lat, diseasePoints[2].lng]
    }
    return null
  }, [diseasePoints])

  const fetch = async (payload: any) => {
    const response = await api.post('/heatmap', payload)
    const diseasePoints: DiseasePoints[] = response.data
    console.log(response.data)
    setDiseasePoints(diseasePoints)
  }

  const handleNaturalSearch = async () => {
    if (!naturalQuery.trim()) return

    setIsSearching(true)
    try {
      // Detecta a doença da query e atualiza o toggle automaticamente
      const detectedDisease = detectDiseaseFromQuery(naturalQuery)
      if (detectedDisease) {
        setSelectedDiseases([detectedDisease.id])
        setNaturalSearchColor(detectedDisease.color)
      }

      const response = await api.post('/heatmap/natural-search', {
        query: naturalQuery,
      })
      const points: DiseasePoints[] = response.data.map(
        (p: { lat: number; lng: number; value: number }) => ({
          lat: p.lat,
          lng: p.lng,
          intensity: p.value,
        })
      )
      console.log('Natural search response:', response.data)
      setDiseasePoints(points)
      setIsNaturalSearchActive(true)
    } catch (error) {
      console.error('Erro na busca natural:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNaturalSearch()
    }
  }

  const handleAplicarFiltros = async () => {
    const payload = {
      filters: {
        disease_acronym: selectedDiseases[0],
        start_date: datas.inicio,
        end_date: datas.fim,
        city_code: String(selectedCidadeCode),
      },
      group_by: 'city',
      metric: 'count',
    }

    console.log('PAYLOAD:', JSON.stringify(payload, null, 2))

    try {
      fetch(payload)
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error)
    }
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
          points: toHeatmapData(diseasePoints),
          gradient: generateGradient(diseaseData.color),
        }
      })
      .filter(Boolean)
  }, [selectedDiseases, diseasePoints])

  useEffect(() => {
    const payload = {
      filters: {
        disease_acronym: selectedDiseases[0],
        start_date: datas.inicio,
        end_date: datas.fim,
        city_code: String(selectedCidadeCode),
      },
      group_by: 'city',
      metric: 'count',
    }

    fetch(payload)
  }, [selectedDiseases])

  return (
    <div className={`heatmap-wrapper ${className}`}>
      {isModal && (
        <div className="map-overlay" onClick={() => setIsModal(false)} />
      )}

      <div className="heatmap-controls">
        <div className="natural-search-container">
          <h3>Busca Inteligente</h3>
          <p className="search-hint">
            Digite sua busca em linguagem natural, ex: "casos de dengue em João
            Pessoa"
          </p>
          <div className="natural-search-input-wrapper">
            <input
              type="text"
              className="natural-search-input"
              placeholder="Ex: casos de chikungunya em Campina Grande no último ano"
              value={naturalQuery}
              onChange={e => setNaturalQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="natural-search-button"
              onClick={handleNaturalSearch}
              disabled={isSearching || !naturalQuery.trim()}
            >
              {isSearching ? (
                <span className="loading-spinner" />
              ) : (
                <Search size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="search-mode-divider">
          <span>ou use os filtros avançados</span>
        </div>

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
                { '--disease-color': disease.color } as React.CSSProperties
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

        <div style={{ margin: '20px 0' }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="expand-btn"
          >
            {showAdvanced ? '▲ Ocultar filtros' : '▼ Filtrar busca'}
          </button>
        </div>

        {showAdvanced && (
          <div className="expandable-area">
            <div className="filter-wrapper">
              <div className="dates">
                <h3>Período de ocorrências</h3>
                <FiltroDatas onDataChange={handleMudancaData} />
              </div>
              <div className="localization">
                <h3>Localização</h3>
                <FiltroLocalizacao onCidadeSelected={handleMudancaCidade} onEstadoSelected={handleMudancaEstado} />
              </div>
            </div>

            <button
              disabled={!isFormComplete}
              className="submit-btn"
              onClick={handleAplicarFiltros}
            >
              Aplicar Filtros
            </button>
          </div>
        )}
      </div>

      <div className={`heatmap-container ${isModal ? 'map-modal-mode' : ''}`}>
        <MapContainer
          center={[CAMPINA_GRANDE_CENTER.lat, CAMPINA_GRANDE_CENTER.lng]}
          zoom={DEFAULT_ZOOM}
          className="heatmap-map"
          scrollWheelZoom={true}
        >
          <FullScreenButton
            isModal={isModal}
            onToggle={() => setIsModal(!isModal)}
          />

          {mapCenter && <ChangeView center={mapCenter} />}

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

      {!isModal && (
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
      )}
    </div>
  )
}
