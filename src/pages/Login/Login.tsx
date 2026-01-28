import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Link, Logo } from '@/components/ui'
import { useAuth } from '@/lib/useAuth'
import './Login.css'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Validações
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = 'Email é obrigatório'
    if (!formData.password) newErrors.password = 'Senha é obrigatória'

    setErrors(newErrors)
    setSuccessMessage('')

    if (Object.keys(newErrors).length === 0) {
      try {
        await login({
          email: formData.email,
          password: formData.password,
        })
        setSuccessMessage('Login realizado com sucesso!')
        navigate('/home')
      } catch (err) {
        console.error('Erro ao fazer login:', err)
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <Logo text="Your Logo" className="login-logo" />
        <div className="login-content">
          <h1>Sign in to</h1>
          <p>Lorem Ipsum is simply the industry's standard dummy text.</p>
          <div className="login-signup-link">
            <span>If you don't have an account</span>
            <Link href="/signup">Register here!</Link>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error.message}</div>}

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
