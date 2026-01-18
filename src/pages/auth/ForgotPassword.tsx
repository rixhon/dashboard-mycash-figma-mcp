/**
 * Página de Recuperação de Senha
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const { error } = await resetPassword(email)
    
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    
    setSuccess(true)
    setLoading(false)
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Email enviado!
            </h2>
            <p className="text-text-secondary mb-6">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <Link
              to="/login"
              className="inline-block py-3 px-6 bg-text-primary text-white rounded-xl font-medium
                hover:bg-gray-800 transition-colors"
            >
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    )
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
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Esqueceu sua senha?
          </h2>
          <p className="text-text-secondary mb-6 text-sm">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
          
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
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-text-primary text-white rounded-xl font-medium
                hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-accent-primary text-sm font-medium hover:underline">
              ← Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
