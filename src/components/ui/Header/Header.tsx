import React from 'react'
import { useLocation } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import './Header.css'

const Header: React.FC = () => {
  const location = useLocation()

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Painel Epidemiológico'
      case '/mapa-calor':
        return 'Mapa de Calor'
      case '/importar':
        return 'Importar Dados'
      case '/analise':
        return 'Análise Preditiva'
      default:
        return 'Bem-vindo'
    }
  }

  return (
    <header className="header-container">
      <h2 className="page-title">{getPageTitle(location.pathname)}</h2>

      <div className="header-actions">
        <div className="user-avatar">
          <User size={20} color="#666" />
        </div>

        <span className="user-name">Admin</span>

        <div className="divider-vertical"></div>

        <button
          className="header-logout-btn"
          onClick={() => console.log('Logout')}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Header
