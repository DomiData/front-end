import React from 'react'
import { useAuthContext } from '@/lib/useAuthContext'
import { useAuth } from '@/lib/useAuth'
import { Button } from '@/components/ui'
import { HeatMap } from '@/components/HeatMap'
import { useNavigate } from 'react-router-dom'
import './Home.css'

export const Home: React.FC = () => {
  const { user } = useAuthContext()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-left">
          <h1>Mapa de Doenças</h1>
          <span className="header-location">Campina Grande, PB</span>
        </div>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <Button variant="primary" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      {/* Conteúdo principal com o mapa */}
      <main className="home-main">
        <HeatMap />
      </main>
    </div>
  )
}
