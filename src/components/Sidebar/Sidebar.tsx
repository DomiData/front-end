import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  LogOut,
  Download,
} from 'lucide-react'
import './Sidebar.css'
import { useAuth } from '@/lib/useAuth'

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar-container">
      <nav className="nav-list">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/mapa"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <BarChart3 size={20} />
          <span>Mapa de Doenças</span>
        </NavLink>

        <NavLink
          to="/importar"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <Download size={20} />
          <span>Importar Dados</span>
        </NavLink>

        <NavLink
          to="/analise"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <PieChart size={20} />
          <span>Análise Preditiva</span>
        </NavLink>
      </nav>

      <div className="logout-section">
        <button
          className="nav-item logout-btn"
          onClick={() => console.log('Logout acionado')}
        >
          <LogOut size={20} />
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
