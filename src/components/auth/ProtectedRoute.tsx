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
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/015b0f48-f030-4861-8cd4-aa766eca13cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProtectedRoute.tsx:15',message:'ProtectedRoute render',data:{hasUser:!!user,userId:user?.id,loading,pathname:location.pathname},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'F'})}).catch(()=>{});
  // #endregion
  
  // Mostra loading enquanto verifica autenticação
  if (loading) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/015b0f48-f030-4861-8cd4-aa766eca13cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProtectedRoute.tsx:20',message:'showing loading spinner',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/015b0f48-f030-4861-8cd4-aa766eca13cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProtectedRoute.tsx:33',message:'redirecting to login - no user',data:{pathname:location.pathname},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return <>{children}</>
}
