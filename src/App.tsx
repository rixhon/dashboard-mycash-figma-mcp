import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ROUTES } from './constants'
import { FinanceProvider } from './contexts/FinanceContext'
import { SidebarProvider } from './contexts/SidebarContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Cards from './pages/Cards'
import Transactions from './pages/Transactions'
import Goals from './pages/Goals'
import Profile from './pages/Profile'

/**
 * App - Componente raiz da aplicação
 * 
 * Estrutura de providers (de fora para dentro):
 * 1. FinanceProvider - Estado global financeiro
 * 2. SidebarProvider - Estado da sidebar (expandida/colapsada)
 * 3. BrowserRouter - Roteamento
 * 4. Layout - Estrutura visual (sidebar + conteúdo)
 */
function App() {
  return (
    <FinanceProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.CARDS} element={<Cards />} />
              <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
              <Route path={ROUTES.GOALS} element={<Goals />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </SidebarProvider>
    </FinanceProvider>
  )
}

export default App
