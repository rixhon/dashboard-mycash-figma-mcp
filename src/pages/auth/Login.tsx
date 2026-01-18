/**
 * Página de Login
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'Email ou senha inválidos' 
        : error.message)
      setLoading(false)
      return
    }
    
    navigate('/')
  }
  
  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            mycash<span className="text-accent-primary">+</span>
          </h1>
          <p className="text-text-secondary mt-2">
            Gestão financeira familiar
          </p>
        </div>
        
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Entrar na sua conta
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border-primary
                  focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                  transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border-primary
                  focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                  transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-border-primary text-accent-primary focus:ring-accent-primary" />
                <span className="ml-2 text-sm text-text-secondary">Lembrar-me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-accent-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-text-primary text-white rounded-xl font-medium
                hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-accent-primary font-medium hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
