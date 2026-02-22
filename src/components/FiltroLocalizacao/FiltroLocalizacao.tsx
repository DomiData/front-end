/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Autocomplete, TextField, Box, CircularProgress } from '@mui/material'

export interface Estado {
  id: number
  sigla: string
  nome: string
}

export interface Cidade {
  id: number
  nome: string
}

interface FiltroLocalizacaoProps {
  onCidadeSelected: (city_code: number | null) => void
}

export const FiltroLocalizacao: React.FC<FiltroLocalizacaoProps> = ({
  onCidadeSelected,
}) => {
  const [estados, setEstados] = useState<Estado[]>([])
  const [estadoSelecionado, setEstadoSelecionado] = useState<Estado | null>(
    null
  )

  const [cidades, setCidades] = useState<Cidade[]>([])
  const [loadingCidades, setLoadingCidades] = useState(false)
  const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(
    null
  )

  const handleEstadoChange = (_: any, novoEstado: Estado | null) => {
    setEstadoSelecionado(novoEstado)
    setCidadeSelecionada(null)
    setCidades([])

    if (novoEstado) {
      setLoadingCidades(true)
    }

    onCidadeSelected(null)
  }

  useEffect(() => {
    fetch(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
    )
      .then(res => res.json())
      .then(data => setEstados(data))
  }, [])

  useEffect(() => {
    if (!estadoSelecionado) return

    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado.id}/municipios?orderBy=nome`
    )
      .then(res => res.json())
      .then(data => {
        setCidades(data)
        setLoadingCidades(false)
      })
  }, [estadoSelecionado])

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2, width: '100%' }}>
      <Autocomplete
        options={estados}
        getOptionLabel={option => `${option.nome} (${option.sigla})`}
        onChange={handleEstadoChange}
        sx={{ flex: 1 }}
        renderInput={params => <TextField {...params} label="Estado (UF)" />}
      />

      <Autocomplete
        options={cidades}
        getOptionLabel={option => option.nome}
        sx={{ flex: 2 }}
        disabled={!estadoSelecionado}
        loading={loadingCidades}
        value={cidadeSelecionada}
        onChange={(_, newValue) => {
          setCidadeSelecionada(newValue)
          onCidadeSelected(newValue ? newValue.id : null)
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="Cidade"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingCidades ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Box>
  )
}
