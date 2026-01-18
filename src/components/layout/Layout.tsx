import { ReactNode } from 'react'
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
 * - Mobile/Tablet (<1280px): Sidebar não renderiza, conteúdo ocupa 100%
 * - Desktop (≥1280px): Sidebar visível, conteúdo ajusta largura
 */
export default function Layout({ children }: LayoutProps) {
  const { isExpanded } = useSidebar()

  // Largura da sidebar baseada no estado
  const sidebarWidth = isExpanded ? 300 : 80

  return (
    <div className="min-h-screen bg-background-secondary overflow-x-hidden">
      {/* Sidebar - apenas desktop (≥1280px) */}
      <Sidebar />

      {/* Conteúdo Principal */}
      {/* Desktop - com largura calculada descontando a sidebar */}
      <main
        className="
          hidden lg:block
          transition-all duration-300 ease-in-out 
          min-h-screen
        "
        style={{
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        {children}
      </main>
      
      {/* Mobile/Tablet - largura total */}
      <main className="w-full min-h-screen lg:hidden">
        {children}
      </main>
    </div>
  )
}
