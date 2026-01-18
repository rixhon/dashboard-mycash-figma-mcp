import { useState } from 'react'

/**
 * Hook para gerenciar estado da sidebar
 * Persiste preferência no localStorage (apenas para UX, não para dados)
 */
export function useSidebar() {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Tenta recuperar preferência do localStorage
    const saved = localStorage.getItem('sidebar-expanded')
    return saved !== null ? saved === 'true' : true // Padrão: expandida
  })

  const toggle = () => {
    setIsExpanded((prev) => {
      const newValue = !prev
      localStorage.setItem('sidebar-expanded', String(newValue))
      return newValue
    })
  }

  const expand = () => {
    setIsExpanded(true)
    localStorage.setItem('sidebar-expanded', 'true')
  }

  const collapse = () => {
    setIsExpanded(false)
    localStorage.setItem('sidebar-expanded', 'false')
  }

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
  }
}
