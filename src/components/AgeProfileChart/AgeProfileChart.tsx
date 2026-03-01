import React from 'react'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
} from 'recharts'

// import './AgeProfileChart.css'

interface AgeProfileChartProps {
  data: any[]
  groupBy: string[]
  cityMap: Record<string, string>
}

export const AgeProfileChart: React.FC<AgeProfileChartProps> = ({
  data,
  groupBy,
  cityMap,
}) => {
  const getLabel = (item: any) => {
    return groupBy
      .map(group => {
        if (group === 'city') {
          const code = item.city_code?.toString()

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

        return item[`${group} name`] || item[group] || 'N/A'
      })
      .join(' — ')
  }

  const chartData = data.map(item => ({
    ...item,
    displayName: getLabel(item),
  }))

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
        Perfil Etário por Agrupamento (Anos)
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 75]} unit=" anos" fontSize={12} />
          <YAxis
            dataKey="displayName"
            type="category"
            width={130}
            fontSize={11}
            tick={{ fill: '#64748b' }}
          />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            labelFormatter={label => label}
            formatter={(value: any, name: string) => {
              const labels: Record<string, string> = {
                avg_age: 'Idade Média',
                min_age: 'Idade Mínima',
                max_age: 'Idade Máxima',
              }

              if (!labels[name]) return [null]

              const formattedValue =
                typeof value === 'number' ? value.toFixed(1) : value

              return [`${formattedValue}`, labels[name]]
            }}
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />

          <Bar
            dataKey="avg_age"
            name="avg_age"
            fill="#f59e0b"
            barSize={
              groupBy.includes('sex') && !groupBy.includes('health_unit')
                ? 50
                : 25
            }
            radius={[0, 4, 4, 0]}
          />

          <Scatter dataKey="min_age" name="min_age" fill="#8aa4ca" />
          <Scatter dataKey="max_age" name="max_age" fill="#065be4" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
