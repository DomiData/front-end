import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/ui'
import './Landing.css'

export const Landing: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <Logo text="Domidata" className="landing-logo" />
        <div className="landing-nav-actions">
          <button
            className="landing-btn-ghost"
            onClick={() => navigate('/login')}
          >
            Entrar
          </button>
          <button
            className="landing-btn-primary"
            onClick={() => navigate('/signup')}
          >
            Cadastre-se
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-badge">
            Plataforma de Vigilância Epidemiológica
          </span>
          <h1>
            Monitore surtos e doenças com{' '}
            <span className="highlight">dados em tempo real</span>
          </h1>
          <p>
            O Domidata é uma plataforma inteligente para visualização e análise
            de dados epidemiológicos. Acompanhe a propagação de doenças através
            de mapas de calor interativos e tome decisões mais informadas para a
            saúde pública.
          </p>
          <div className="landing-hero-actions">
            <button
              className="landing-btn-primary landing-btn-lg"
              onClick={() => navigate('/signup')}
            >
              Começar agora
            </button>
            <button
              className="landing-btn-outline landing-btn-lg"
              onClick={() => {
                document
                  .getElementById('features')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Saiba mais
            </button>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="landing-map-preview">
            <div className="map-dot dot-1" />
            <div className="map-dot dot-2" />
            <div className="map-dot dot-3" />
            <div className="map-dot dot-4" />
            <div className="map-dot dot-5" />
            <div className="map-grid" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        <h2>Por que usar o Domidata?</h2>
        <p className="landing-features-subtitle">
          Ferramentas poderosas para vigilância epidemiológica e gestão de saúde
          pública.
        </p>
        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Mapas de Calor</h3>
            <p>
              Visualize a concentração de casos de doenças em tempo real através
              de mapas interativos com camadas de calor georreferenciadas.
            </p>
          </div>
          <div className="landing-feature-card">
            <div className="feature-icon">📊</div>
            <h3>Análise de Dados</h3>
            <p>
              Acesse relatórios e gráficos detalhados sobre a evolução de surtos
              e tendências epidemiológicas na sua região.
            </p>
          </div>
          <div className="landing-feature-card">
            <div className="feature-icon">📍</div>
            <h3>Filtros por Localização</h3>
            <p>
              Filtre os dados por bairro, cidade ou região para obter uma visão
              precisa da situação epidemiológica local.
            </p>
          </div>
          <div className="landing-feature-card">
            <div className="feature-icon">📅</div>
            <h3>Filtros por Período</h3>
            <p>
              Selecione intervalos de datas para comparar a evolução dos casos
              ao longo do tempo e identificar padrões sazonais.
            </p>
          </div>
          <div className="landing-feature-card">
            <div className="feature-icon">📤</div>
            <h3>Exportação de Dados</h3>
            <p>
              Exporte seus dados e relatórios em diversos formatos para facilitar a análise
              externa e o compartilhamento de resultados.
            </p>
          </div>
          <div className="landing-feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Acesso Seguro</h3>
            <p>
              Autenticação segura com controle de acesso para garantir a
              privacidade e integridade dos dados epidemiológicos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Pronto para começar?</h2>
        <p>
          Crie sua conta gratuitamente e tenha acesso a dados epidemiológicos
          detalhados com visualizações interativas.
        </p>
        <div className="landing-cta-actions">
          <button
            className="landing-btn-primary landing-btn-lg"
            onClick={() => navigate('/signup')}
          >
            Criar conta gratuita
          </button>
          <button
            className="landing-btn-ghost landing-btn-lg"
            onClick={() => navigate('/login')}
          >
            Já tenho uma conta
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Logo text="Domidata" className="landing-footer-logo" />
        <p>
          &copy; {new Date().getFullYear()} Domidata. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  )
}
