import React, { useState } from 'react';
import { Button, Input, Link, Logo } from '@/components/ui';
import { useAuth } from '@/lib/useAuth';
import './SignUp.css';

export const SignUp: React.FC = () => {
  const { signup, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validações
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    setErrors(newErrors);
    setSuccessMessage('');

    if (Object.keys(newErrors).length === 0) {
      try {
        await signup({
          email: formData.email,
          password: formData.password,
        });
        setSuccessMessage('Cadastro realizado com sucesso!');
        // Limpar formulário
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        // Redirecionar ou fazer outra ação
        console.log('Usuário cadastrado com sucesso');
      } catch (err) {
        console.error('Erro ao cadastrar:', err);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <Logo text="Your Logo" className="signup-logo" />
        <div className="signup-content">
          <h1>Sign Up to</h1>
          <p>Lorem Ipsum is simply the industry's standard dummy text.</p>
          <div className="signup-login-link">
            <span>If you already have an account</span>
            <Link href="/login">Login here!</Link>
          </div>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-card">
          <div className="signup-header">
            <h2>Sign Up</h2>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {error && (
              <div className="error-message">
                {error.message}
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            <Input
              label="Name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Contact number"
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

            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <Button type="submit" fullWidth variant="primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Register'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
