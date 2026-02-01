import React from 'react'
import { HeatMap } from '@/components/HeatMap'
import './Home.css'

export const Home: React.FC = () => {
  // const handleLogout = async () => {
  //   await logout()
  //   navigate('/login')
  // }

  return (
    <div className="home-container">
      {/* Header */}
      {/* <header className="home-header">
        <div className="header-left">
          <h1>Mapa de Doenças</h1>
          <span className="header-location">Campina Grande, PB</span>
        </div>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <Button variant="outline" onClick={() => navigate('/chat')}>
            Assistente AI
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header> */}

      {/* Conteúdo principal com o mapa */}
      <main className="home-main">
        <HeatMap />
      </main>
    </div>
  )
}
