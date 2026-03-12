import React from 'react'
import { useLocation } from 'react-router-dom'
import { User } from 'lucide-react'
import './Header.css'
import { useAuthContext } from '@/lib/useAuthContext'

const Header: React.FC = () => {
  const location = useLocation()
  const { user } = useAuthContext()

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Painel Epidemiológico'
      case '/mapa':
        return 'Mapa de Doenças'
      case '/chat':
        return 'Chat IA'
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

        <span className="user-name">{user?.name || 'Usuário'}</span>
      </div>
    </header>
  )
}

export default Header
