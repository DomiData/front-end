import type React from 'react'
import './KPICard.css'

interface KPICardProps {
  label: string
  value: string | number
  color?: string
  icon?: string
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  color = '#3b82f6',
}) => (
  <div className="kpi-card" style={{ borderLeft: `4px solid ${color}` }}>
    <span className="kpi-label">{label}</span>
    <span className="kpi-value">{value}</span>
  </div>
)
