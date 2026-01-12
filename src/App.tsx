import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'
import { Home } from './pages/Dashboard/Dashboard'
import Layout from './components/ui/Layout/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Home />} />
          <Route
            path="mapa-calor"
            element={<div>Página de Mapa de Calor</div>}
          />
          <Route
            path="importar"
            element={<div>Página de importar dados</div>}
          />
          <Route
            path="analise"
            element={<div>Página de analise preditiva</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
