import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/AuthContext'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'
import { Home } from '@/pages/Home'
import { Chat } from '@/pages/Chat'
import Layout from './components/Layout/Layout'
import { Dashboard } from './pages/Dashboard'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route index path="/mapa" element={<Home />} />
            <Route
              path="importar"
              element={<div>Página em desenvolvimento</div>}
            />
            <Route
              path="analise"
              element={<div>Página em desenvolvimento</div>}
            />
            <Route path="chat" element={<Chat />} />
          </Route>
          {/* <Route path="/home" element={<Home />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
