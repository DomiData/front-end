import React from 'react'
import { useAuthContext } from '@/lib/useAuthContext'
import { useAuth } from '@/lib/useAuth'
import { Button } from '@/components/ui'
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
      <div className="home-content">
        <h1>Bem vindo, {user?.name || 'Usuário'}!</h1>
        <p>Você está logado com o email: {user?.email}</p>
        <Button variant="primary" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </div>
  )
}
