import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ROUTES } from './constants'
import { AuthProvider } from './contexts/AuthContext'
import { FinanceProvider } from './contexts/FinanceContext'
import { SidebarProvider } from './contexts/SidebarContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Cards from './pages/Cards'
import Transactions from './pages/Transactions'
import Goals from './pages/Goals'
import Profile from './pages/Profile'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

/**
 * App - Componente raiz da aplicação
 * 
 * Estrutura de providers (de fora para dentro):
 * 1. AuthProvider - Autenticação Supabase
 * 2. FinanceProvider - Estado global financeiro
 * 3. SidebarProvider - Estado da sidebar (expandida/colapsada)
 * 4. BrowserRouter - Roteamento
 * 5. Layout - Estrutura visual (sidebar + conteúdo)
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Rotas protegidas */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <FinanceProvider>
                  <SidebarProvider>
                    <Layout>
                      <Routes>
                        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                        <Route path={ROUTES.CARDS} element={<Cards />} />
                        <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
                        <Route path={ROUTES.GOALS} element={<Goals />} />
                        <Route path={ROUTES.PROFILE} element={<Profile />} />
                      </Routes>
                    </Layout>
                  </SidebarProvider>
                </FinanceProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
