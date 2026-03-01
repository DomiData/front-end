import { DashboardComponent } from '@/components/Dashboard/DashboardComponent'
import React from 'react'

export const Dashboard: React.FC = () => {
  return (
    <div className="home-container">
      <main className="home-main">
        <DashboardComponent />
      </main>
    </div>
  )
}
