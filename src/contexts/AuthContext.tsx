/**
 * AuthContext - Contexto de Autenticação
 * 
 * Gerencia o estado de autenticação do usuário usando Supabase Auth.
 * Fornece funções para login, logout, registro e recuperação de senha.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// ============================================================================
// TIPOS
// ============================================================================

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
}

// ============================================================================
// CONTEXTO
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/015b0f48-f030-4861-8cd4-aa766eca13cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:46',message:'AuthContext useEffect started',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    // Busca sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/015b0f48-f030-4861-8cd4-aa766eca13cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:50',message:'getSession result',data:{hasSession:!!session,userId:session?.user?.id,userEmail:session?.user?.email},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuta mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/015b0f48-f030-4861-8cd4-aa766eca13cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:60',message:'onAuthStateChange fired',data:{event:_event,hasSession:!!session,userId:session?.user?.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Registro de novo usuário
  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    return { error }
  }

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  // Logout
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Recuperação de senha
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  // Atualização de senha
  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ============================================================================
// HOOK
// ============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
