import React, { useEffect, useState } from 'react'
import './DashboardComponent.css'
import api from '@/services/api'
import { getAvailableDiseases } from '@/data/mockDiseaseData'
import { FiltroDatas } from '@/components/FiltroDatas/FiltroDatas'
import {
  FiltroLocalizacao,
  type Cidade,
} from '@/components/FiltroLocalizacao/FiltroLocalizacao'
import type { FiltroDataState } from '@/components/HeatMap/HeatMap'
import { KPICard } from '../KPICard/KPICard'
import { VolumeChart } from '../VolumeChart/VolumeChart'
import { format } from 'date-fns'
import { AgeProfileChart } from '../AgeProfileChart/AgeProfileChart'

const groupByOptions = [
  { id: 'city', label: 'Cidade' },
  { id: 'disease', label: 'Doença' },
  { id: 'health_unit', label: 'Unidade de Saúde' },
  { id: 'sex', label: 'Sexo' },
]

interface DashboardSummary {
  totalCasos: number
  taxaRecuperacao: number
  taxaLetalidade: number
  idadeMedia: number
  dadosInconsistentes: number
}

export const DashboardComponent: React.FC = () => {
  const [appliedGroupBy, setAppliedGroupBy] = useState<string[]>(['city'])
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(['DENG'])
  const [query, setQuery] = useState({
    filters: {
      disease_acronym: '',
      start_date: '',
      end_date: '',
      min_age: null,
      max_age: null,
      patient_sex: '',
      city_code: '',
      evolution: '',
    },
    group_by: ['city'],
    metrics: [
      'count',
      'avg_age',
      'recovery_rate',
      'fatality_rate',
      'min_age',
      'max_age',
    ],
  })
  const [datas, setDatas] = useState<FiltroDataState>({
    inicio: null,
    fim: null,
  })
  const [selectedCidadeCode, setSelectedCidadeCode] = useState<number | null>(
    null
  )

  const [selectedEstadoCode, setSelectedEstadoCode] = useState<number | null>(
    25
  )

  const [cityMap, setCityMap] = useState<Record<string, string>>({})

  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false)

  const diseases = getAvailableDiseases()

  const toggleDisease = (diseaseId: string) => {
    setSelectedDiseases(prev => {
      if (prev.includes(diseaseId)) {
        return prev.filter(id => id !== diseaseId)
      } else {
        return [diseaseId]
      }
    })

    setHasPendingChanges(true)
  }

  const handleMudancaData = (novasDatas: FiltroDataState) => {
    setDatas(novasDatas)
    setHasPendingChanges(true)
  }

  const handleMudancaCidade = (cidadeSelectedCode: number | null) => {
    setSelectedCidadeCode(cidadeSelectedCode)
    setHasPendingChanges(true)
  }

  const handleMudancaEstado = (cidadeSelectedCode: number | null) => {
    setSelectedEstadoCode(cidadeSelectedCode)
    setHasPendingChanges(true)
  }

  const handleToggleArray = (
    category: 'group_by' | 'metrics',
    value: string
  ) => {
    setQuery(prev => {
      const current = prev[category]
      const isSelected = current.includes(value)

      if (isSelected) {
        if (current.length === 1) return prev

        return {
          ...prev,
          [category]: current.filter(item => item !== value),
        }
      } else {
        return {
          ...prev,
          [category]: [...current, value],
        }
      }
    })
    setHasPendingChanges(true)
  }

  const updateSummary = (data: any[]) => {
    const totalCasos = data.reduce((acc, curr) => acc + (curr.count || 0), 0)
    const totalInconsistentes = data.reduce(
      (acc, curr) => acc + (curr.evolution_not_registered || 0),
      0
    )

    const avg = (key: string) =>
      data.length > 0
        ? data.reduce((acc, curr) => acc + (curr[key] || 0), 0) / data.length
        : 0

    setSummary({
      totalCasos,
      taxaRecuperacao: avg('recovery_rate'),
      taxaLetalidade: avg('fatality_rate'),
      idadeMedia: avg('avg_age'),
      dadosInconsistentes: totalInconsistentes,
    })
  }

  const handleSearch = async () => {
    // Sincronização
    const finalQuery = {
      ...query,
      filters: {
        disease_acronym: selectedDiseases[0] || '',
        start_date: datas.inicio || '2025-01-01',
        end_date: datas.fim || format(new Date(), 'yyyy-dd-MM'),
        city_code: selectedCidadeCode?.toString() || '',
      },
    }

    if (finalQuery.group_by.length === 0 || finalQuery.metrics.length === 0) {
      alert('Selecione ao menos um agrupamento e uma métrica.')
      return
    }

    try {
      const response = await api.post('/dashboard', finalQuery)
      const rawData = response.data

      const processedData = [...rawData]
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .slice(0, 10)

      console.log('PROCESSED DATA:', processedData)
      setChartData(processedData)
      setAppliedGroupBy(query.group_by)
      updateSummary(rawData)
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setHasPendingChanges(false)
    }
  }

  const firstRequest = async () => {
    const firstPayload = {
      filters: {
        disease_acronym: 'DENG',
        start_date: '2025-01-01',
        end_date: format(new Date(), 'yyyy-dd-MM'),
      },
      group_by: ['city'],
      metrics: ['count', 'avg_age', 'recovery_rate', 'fatality_rate'],
    }

    const response = await api.post('/dashboard', firstPayload)
    const rawData = response.data

    const processedData = [...rawData]
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 10)

    console.log('PROCESSED DATA:', processedData)
    setChartData(processedData)

    updateSummary(rawData)
  }

  useEffect(() => {
    firstRequest()
  }, [])

  useEffect(() => {
    const carregarNomesCidades = async () => {
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstadoCode}/municipios`
        )
        const cidades: Cidade[] = await response.json()

        const mapa: Record<string, string> = {}
        cidades.forEach(c => {
          mapa[c.id.toString()] = c.nome
        })

        setCityMap(mapa)
      } catch (error) {
        console.error('Erro ao carregar nomes das cidades do IBGE:', error)
      }
    }

    carregarNomesCidades()
  }, [selectedEstadoCode])

  return (
    <div className="dashboard-wrapper">
      <div className="filter-bar">
        <div className="filter-section">
          <div className="input-group">
            <h3>Doença</h3>
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
          </div>
          <div className="filter-wrapper">
            <div className="dates">
              <h3>Período de ocorrências</h3>
              <FiltroDatas onDataChange={handleMudancaData} />
            </div>
            <div className="localization">
              <h3>Localização</h3>
              <FiltroLocalizacao
                onCidadeSelected={handleMudancaCidade}
                onEstadoSelected={handleMudancaEstado}
              />
            </div>
          </div>
          <div className="analysis-config">
            <div className="group-by-section">
              <h3>Agrupar por</h3>
              <div className="options-grid">
                {groupByOptions.map(opt => (
                  <button
                    key={opt.id}
                    className={`option-button ${query.group_by.includes(opt.id) ? 'active' : ''}`}
                    disabled={
                      !!(opt.id === 'city' && selectedCidadeCode) ||
                      !!(opt.id === 'disease' && selectedDiseases.length > 0)
                    }
                    onClick={() => handleToggleArray('group_by', opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            disabled={!hasPendingChanges}
            className={`submit-btn ${hasPendingChanges ? 'pending' : 'applied'}`}
            onClick={handleSearch}
          >
            Aplicar filtros
          </button>
        </div>
      </div>
      <div className="dashboard-content">
        {summary && (
          <>
            {summary.dadosInconsistentes > 0 && (
              <div className="data-alert">
                ⚠️ Atenção: {summary.dadosInconsistentes} ocorrências possuem
                evolução não registrada ou inconsistente.
              </div>
            )}

            <div className="kpi-grid">
              <KPICard
                label="Total de Casos"
                value={summary.totalCasos.toLocaleString()}
                color="#1a73e8"
              />
              <KPICard
                label="Taxa de Recuperação"
                value={`${summary.taxaRecuperacao.toFixed(1)}%`}
                color="#10b981"
              />
              <KPICard
                label="Taxa de Letalidade"
                value={`${summary.taxaLetalidade.toFixed(1)}%`}
                color="#ef4444"
              />
              <KPICard
                label="Idade Média"
                value={`${Math.round(summary.idadeMedia)} anos`}
                color="#f59e0b"
              />
            </div>
          </>
        )}
        <>
          {chartData.length > 0 ? (
            <div className="charts-grid">
              <VolumeChart
                data={chartData}
                groupBy={appliedGroupBy}
                cityMap={cityMap}
              />
              <AgeProfileChart
                data={chartData}
                groupBy={appliedGroupBy}
                cityMap={cityMap}
              />
            </div>
          ) : (
            <h1>Dados não encontrados</h1>
          )}
        </>
      </div>
    </div>
  )
}
