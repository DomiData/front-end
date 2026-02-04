import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  LogOut,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import './Sidebar.css'
import { useAuth } from '@/lib/useAuth'

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <button
        className="toggle-btn"
        onClick={toggleSidebar}
        title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <nav className="nav-list">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
          title="Dashboard"
        >
          <LayoutDashboard size={20} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/mapa"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
          title="Mapa de Doenças"
        >
          <BarChart3 size={20} />
          {!isCollapsed && <span>Mapa de Doenças</span>}
        </NavLink>

        <NavLink
          to="/importar"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
          title="Importar Dados"
        >
          <Download size={20} />
          {!isCollapsed && <span>Importar Dados</span>}
        </NavLink>

        <NavLink
          to="/analise"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
          title="Análise Preditiva"
        >
          <PieChart size={20} />
          {!isCollapsed && <span>Análise Preditiva</span>}
        </NavLink>
      </nav>

      <div className="logout-section">
        <button
          className="nav-item logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
