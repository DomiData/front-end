import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import './Layout.css'

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <Sidebar />

      <div className="main-content-wrapper">
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
