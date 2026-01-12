import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  LogOut,
  Download,
} from 'lucide-react'
import './Sidebar.css'

const Sidebar: React.FC = () => {
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
          to="/mapa-calor"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <BarChart3 size={20} />
          <span>Mapa de Calor</span>
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
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
