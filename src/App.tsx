import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/AuthContext'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'
import { Home } from '@/pages/Home'
import { Chat } from '@/pages/Chat'
import Layout from './components/Layout/Layout'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<Layout />}>
            <Route
              path="dashboard"
              element={<div>Página em desenvolvimento</div>}
            />
            <Route index path="/mapa" element={<Home />} />
            <Route
              path="importar"
              element={<div>Página em desenvolvimento</div>}
            />
            <Route
              path="analise"
              element={<div>Página em desenvolvimento</div>}
            />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
