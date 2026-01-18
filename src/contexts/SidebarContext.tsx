/**
 * Contexto: SidebarContext
 * Gerencia o estado da sidebar de forma global
 * 
 * Permite que Layout e Sidebar compartilhem o mesmo estado,
 * garantindo que o conteúdo expanda/retraia corretamente
 * quando a sidebar muda de estado.
 */

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

// ============================================================================
// TIPOS
// ============================================================================

interface SidebarContextType {
  isExpanded: boolean
  toggle: () => void
  expand: () => void
  collapse: () => void
}

// ============================================================================
// CONTEXTO
// ============================================================================

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// ============================================================================
// PROVIDER
// ============================================================================

interface SidebarProviderProps {
  children: ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Tenta recuperar preferência do localStorage
    const saved = localStorage.getItem('sidebar-expanded')
    return saved !== null ? saved === 'true' : true // Padrão: expandida
  })

  const toggle = useCallback(() => {
    setIsExpanded((prev) => {
      const newValue = !prev
      localStorage.setItem('sidebar-expanded', String(newValue))
      return newValue
    })
  }, [])

  const expand = useCallback(() => {
    setIsExpanded(true)
    localStorage.setItem('sidebar-expanded', 'true')
  }, [])

  const collapse = useCallback(() => {
    setIsExpanded(false)
    localStorage.setItem('sidebar-expanded', 'false')
  }, [])

  return (
    <SidebarContext.Provider value={{ isExpanded, toggle, expand, collapse }}>
      {children}
    </SidebarContext.Provider>
  )
}

// ============================================================================
// HOOK
// ============================================================================

export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
