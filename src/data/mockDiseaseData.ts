// Dados mockados de doenças para Campina Grande, PB
// Coordenadas baseadas em bairros reais da cidade

export interface DiseasePoint {
  lat: number
  lng: number
  intensity: number // 0-1 (intensidade do ponto no heat map)
}

export interface DiseaseData {
  id: string
  name: string
  color: string
  points: DiseasePoint[]
}

// Coordenadas centrais de Campina Grande
export const CAMPINA_GRANDE_CENTER = {
  lat: -7.2306,
  lng: -35.8811,
}

export const DEFAULT_ZOOM = 13

// Dados mockados por doença
export const mockDiseaseData: DiseaseData[] = [
  {
    id: 'DENG',
    name: 'Dengue',
    color: '#ff4444',
    points: [
      // Centro
      { lat: -7.2172, lng: -35.8813, intensity: 0.9 },
      { lat: -7.2195, lng: -35.8795, intensity: 0.85 },
      { lat: -7.215, lng: -35.883, intensity: 0.75 },
      // Malvinas
      { lat: -7.2489, lng: -35.9101, intensity: 0.8 },
      { lat: -7.251, lng: -35.908, intensity: 0.7 },
      { lat: -7.2475, lng: -35.912, intensity: 0.65 },
      // Bodocongó
      { lat: -7.2225, lng: -35.915, intensity: 0.7 },
      { lat: -7.224, lng: -35.918, intensity: 0.6 },
      { lat: -7.221, lng: -35.913, intensity: 0.55 },
      // Liberdade
      { lat: -7.235, lng: -35.875, intensity: 0.6 },
      { lat: -7.237, lng: -35.873, intensity: 0.5 },
      // Alto Branco
      { lat: -7.205, lng: -35.89, intensity: 0.5 },
      { lat: -7.203, lng: -35.892, intensity: 0.45 },
      // Prata
      { lat: -7.228, lng: -35.865, intensity: 0.55 },
      { lat: -7.2295, lng: -35.867, intensity: 0.5 },
      // Catolé
      { lat: -7.245, lng: -35.86, intensity: 0.4 },
      { lat: -7.247, lng: -35.858, intensity: 0.35 },
      // Sandra Cavalcante
      { lat: -7.255, lng: -35.87, intensity: 0.45 },
      // Cruzeiro
      { lat: -7.21, lng: -35.87, intensity: 0.6 },
      { lat: -7.208, lng: -35.868, intensity: 0.55 },
      // Palmeira
      { lat: -7.238, lng: -35.895, intensity: 0.5 },
    ],
  },
  {
    id: 'CHIK',
    name: 'Chikungunya',
    color: '#ff9800',
    points: [
      // Centro
      { lat: -7.218, lng: -35.88, intensity: 0.6 },
      { lat: -7.2165, lng: -35.8825, intensity: 0.55 },
      // Malvinas
      { lat: -7.25, lng: -35.909, intensity: 0.7 },
      { lat: -7.252, lng: -35.907, intensity: 0.65 },
      // Bodocongó
      { lat: -7.223, lng: -35.916, intensity: 0.5 },
      { lat: -7.2215, lng: -35.914, intensity: 0.45 },
      // José Pinheiro
      { lat: -7.215, lng: -35.865, intensity: 0.6 },
      { lat: -7.2135, lng: -35.867, intensity: 0.55 },
      // Monte Castelo
      { lat: -7.232, lng: -35.888, intensity: 0.4 },
      // Dinamérica
      { lat: -7.26, lng: -35.885, intensity: 0.5 },
      { lat: -7.258, lng: -35.887, intensity: 0.45 },
      // Pedregal
      { lat: -7.242, lng: -35.905, intensity: 0.55 },
      // Três Irmãs
      { lat: -7.255, lng: -35.9, intensity: 0.4 },
    ],
  },
  {
    id: 'ZIKA',
    name: 'Zika',
    color: '#9c27b0',
    points: [
      // Centro
      { lat: -7.2185, lng: -35.881, intensity: 0.4 },
      // Malvinas
      { lat: -7.2495, lng: -35.9095, intensity: 0.5 },
      { lat: -7.248, lng: -35.911, intensity: 0.45 },
      // Bodocongó
      { lat: -7.222, lng: -35.9155, intensity: 0.35 },
      // Liberdade
      { lat: -7.236, lng: -35.874, intensity: 0.3 },
      // Conceição
      { lat: -7.24, lng: -35.885, intensity: 0.4 },
      { lat: -7.2385, lng: -35.887, intensity: 0.35 },
      // Ramadinha
      { lat: -7.265, lng: -35.895, intensity: 0.45 },
      // Serrotão
      { lat: -7.27, lng: -35.91, intensity: 0.5 },
      { lat: -7.272, lng: -35.908, intensity: 0.4 },
    ],
  },
  {
    id: 'LEIV',
    name: 'Leishmaniose Visceral',
    color: '#2196f3',
    points: [
      // Centro (alta concentração)
      { lat: -7.217, lng: -35.8815, intensity: 0.8 },
      { lat: -7.219, lng: -35.879, intensity: 0.75 },
      { lat: -7.2155, lng: -35.8835, intensity: 0.7 },
      { lat: -7.22, lng: -35.8805, intensity: 0.65 },
      // Malvinas
      { lat: -7.249, lng: -35.91, intensity: 0.6 },
      { lat: -7.2505, lng: -35.9085, intensity: 0.55 },
      // Catolé
      { lat: -7.2455, lng: -35.8605, intensity: 0.5 },
      { lat: -7.2465, lng: -35.859, intensity: 0.45 },
      // Alto Branco
      { lat: -7.2055, lng: -35.8905, intensity: 0.55 },
      { lat: -7.204, lng: -35.8925, intensity: 0.5 },
      // Mirante
      { lat: -7.2, lng: -35.875, intensity: 0.45 },
      // Prata
      { lat: -7.2285, lng: -35.8655, intensity: 0.4 },
      // Bodocongó
      { lat: -7.2235, lng: -35.9175, intensity: 0.5 },
      // Universitário
      { lat: -7.215, lng: -35.91, intensity: 0.55 },
      { lat: -7.213, lng: -35.912, intensity: 0.5 },
      // Santa Rosa
      { lat: -7.23, lng: -35.855, intensity: 0.4 },
    ],
  },
]

// Função para obter dados de uma doença específica
export const getDiseaseData = (diseaseId: string): DiseaseData | undefined => {
  return mockDiseaseData.find(d => d.id === diseaseId)
}

// Função para obter todas as doenças disponíveis
export const getAvailableDiseases = (): {
  id: string
  name: string
  color: string
}[] => {
  return mockDiseaseData.map(d => ({ id: d.id, name: d.name, color: d.color }))
}

// Função para converter pontos para o formato do leaflet.heat
export const toHeatmapData = (
  points: DiseasePoint[]
): [number, number, number][] => {
  return points.map(p => [p.lat, p.lng, p.intensity])
}
