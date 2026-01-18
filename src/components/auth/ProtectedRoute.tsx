/**
 * ProtectedRoute - Componente de Proteção de Rotas
 * 
 * Redireciona usuários não autenticados para a página de login.
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  
  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    )
  }
  
  // Redireciona para login se não autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return <>{children}</>
}
