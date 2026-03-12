import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import './Header.css'
import { useAuth } from '@/lib/useAuth'
import { useAuthContext } from '@/lib/useAuthContext'

const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
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

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="header-container">
      <h2 className="page-title">{getPageTitle(location.pathname)}</h2>

      <div className="header-actions">
        <div className="user-avatar">
          <User size={20} color="#666" />
        </div>

        <span className="user-name">{user?.name || 'Usuário'}</span>

        <div className="divider-vertical"></div>

        <button className="header-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Header
