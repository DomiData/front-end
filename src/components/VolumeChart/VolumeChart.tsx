import React, { useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface VolumeChartProps {
  data: any[]
  groupBy: string[]
  cityMap: Record<string, string>
}

export const VolumeChart: React.FC<VolumeChartProps> = ({
  data,
  groupBy,
  cityMap,
}) => {
  const labelMap: Record<string, string> = {
    city: 'Cidade',
    disease: 'Doença',
    health_unit: 'Unidade de Saúde',
    sex: 'Sexo',
  }

  const translatedTitle = groupBy.map(id => labelMap[id] || id).join(' e ')
  const getLabel = (item: any) => {
    return groupBy
      .map(group => {
        if (group === 'city') {
          const code = (item.city || item.city_code)?.toString()

          return cityMap[code] || code || 'N/A'
        }

        if (group === 'health_unit') {
          return item.health_unit_name
        }

        if (group === 'sex') {
          return item.patient_sex
        }

        if (group === 'disease') {
          return item.disease_name
        }

        const dynamicKey = `${group} name`
        return item[dynamicKey] || item[group] || 'N/A'
      })
      .join(' — ')
  }

  const chartData = data.map(item => ({
    ...item,
    displayName: getLabel(item),
  }))

  useEffect(() => {}, [])

  const height = groupBy.includes('health_unit')
    ? data.length > 5
      ? '700px'
      : '400px'
    : '400px'

  return (
    <div
      style={{
        width: '100%',
        height: height,
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ marginBottom: '20px', fontSize: '1rem', color: '#334155' }}>
        Total de Ocorrências por {translatedTitle}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="displayName"
            type="category"
            width={150}
            fontSize={12}
            tick={{ fill: '#64748b' }}
          />

          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            labelFormatter={label => label}
            formatter={(value: any, name: string) => {
              if (name === 'count') {
                return [value, 'Total de ocorrências']
              }
              return [null]
            }}
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />

          <Bar
            dataKey="count"
            name="count"
            fill="#3b82f6"
            radius={[0, 4, 4, 0]}
            barSize={25}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#3b82f6" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
