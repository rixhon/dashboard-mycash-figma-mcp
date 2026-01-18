import { ReactNode, useEffect, useState } from 'react'
import Sidebar from './Sidebar/Sidebar'
import { useSidebar } from '@/hooks/useSidebar'

interface LayoutProps {
  children: ReactNode
}

/**
 * Layout principal da aplicação
 * Gerencia sidebar e conteúdo principal com transições suaves
 * 
 * Responsividade:
 * - Mobile/Tablet (<1024px): Sidebar oculta, conteúdo ocupa 100%
 * - Desktop (≥1024px): Sidebar visível, conteúdo ajusta largura dinamicamente
 * 
 * O conteúdo expande/retrai de forma fluida quando a sidebar muda de estado,
 * com transição suave de 300ms sincronizada com a animação da sidebar
 */
export default function Layout({ children }: LayoutProps) {
  const { isExpanded } = useSidebar()
  const [isDesktop, setIsDesktop] = useState(false)

  // Detectar se está em desktop para aplicar estilos condicionalmente
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    // Verificar no mount
    checkDesktop()
    
    // Listener para resize
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Largura da sidebar baseada no estado
  const sidebarWidth = isExpanded ? 300 : 80

  return (
    <div className="min-h-screen bg-background-secondary overflow-x-hidden">
      {/* Sidebar - renderiza apenas em desktop via CSS interno */}
      <Sidebar />

      {/* 
        Conteúdo Principal
        - Em mobile/tablet: largura 100%, sem margem
        - Em desktop: largura e margem calculadas dinamicamente baseado na sidebar
        - Transição suave sincronizada com a sidebar (300ms ease-in-out)
      */}
      <main
        className="min-h-screen transition-all duration-300 ease-in-out"
        style={isDesktop ? {
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100vw - ${sidebarWidth}px)`,
        } : {
          marginLeft: 0,
          width: '100%',
        }}
      >
        {children}
      </main>
    </div>
  )
}
