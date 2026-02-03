/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import 'dayjs/locale/pt-br'
import dayjs, { Dayjs } from 'dayjs'
import type { FiltroDataState } from '../HeatMap/HeatMap'

dayjs.locale('pt-br')

interface FiltroDatasProps {
  onDataChange: (datas: FiltroDataState) => void
}

export const FiltroDatas: React.FC<FiltroDatasProps> = ({ onDataChange }) => {
  const [inicio, setInicio] = useState<Dayjs | null>(null)
  const [fim, setFim] = useState<Dayjs | null>(null)

  const handleUpdate = (newInicio: Dayjs | null, newFim: Dayjs | null) => {
    onDataChange({
      inicio: newInicio ? newInicio.format('YYYY-MM-DD') : null,
      fim: newFim ? newFim.format('YYYY-MM-DD') : null,
    })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <DatePicker
            label="Data Início"
            format="DD/MM/YYYY"
            value={inicio}
            onChange={(val: Dayjs | null) => {
              setInicio(val)
              handleUpdate(val, fim)
            }}
          />

          <DatePicker
            label="Data Fim"
            value={fim}
            format="DD/MM/YYYY"
            minDate={inicio || undefined}
            onChange={(val: Dayjs | null) => {
              setFim(val)
              handleUpdate(inicio, val)
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  )
}
