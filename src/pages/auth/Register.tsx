/**
 * Página de Registro
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { signUp, signIn } = useAuth()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validações
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    
    if (name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres')
      return
    }
    
    setLoading(true)
    
    const { error } = await signUp(email, password, name)
    
    if (error) {
      if (error.message.includes('already registered')) {
        setError('Este email já está cadastrado')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }
    
    // Aguardar um momento para o trigger confirmar o email
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Tentar fazer login automático
    const { error: signInError } = await signIn(email, password)
    
    if (signInError) {
      // Se falhar o login automático, mostrar mensagem de sucesso
      setSuccess(true)
      return
    }
    
    // Login bem sucedido, redirecionar para o dashboard
    navigate('/')
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Conta criada com sucesso!
            </h2>
            <p className="text-text-secondary mb-6">
              Verifique seu email para confirmar sua conta antes de fazer login.
            </p>
            <Link
              to="/login"
              className="inline-block py-3 px-6 bg-text-primary text-white rounded-xl font-medium
                hover:bg-gray-800 transition-colors"
            >
              Ir para o Login
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
        
        {/* Card de Registro */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Criar sua conta
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border-primary
                  focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                  transition-all"
                placeholder="Seu nome"
                required
              />
            </div>
            
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
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border-primary
                  focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                  transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-text-primary text-white rounded-xl font-medium
                hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-accent-primary font-medium hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
