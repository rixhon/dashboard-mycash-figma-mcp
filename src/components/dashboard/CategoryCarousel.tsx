/**
 * Componente: CategoryCarousel
 * Carrossel horizontal de categorias de despesas
 * 
 * Conforme documentação:
 * - Lista horizontal de cards scrollável
 * - Cards com largura fixa de 160px, espaçamento de 16px
 * - Scroll via: mouse wheel, clique e arrasta, setas de navegação
 * - Setas aparecem no hover (desktop), não aparecem no mobile
 * - Bordas com gradiente de máscara (fade out)
 * - Cards com hover: borda verde-limão
 */

import { useRef, useState, useEffect } from 'react'
import ExpenseCard from './ExpenseCard'
import { ExpenseByCategory } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/utils/formatters'

// Ícones de seta
const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
)

interface CategoryCarouselProps {
  categories: ExpenseByCategory[]
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Verifica se deve mostrar as setas baseado na posição do scroll
  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
  }

  // Atualiza visibilidade das setas quando o container muda
  useEffect(() => {
    updateArrowVisibility()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateArrowVisibility)
      return () => container.removeEventListener('scroll', updateArrowVisibility)
    }
  }, [categories])

  // Scroll horizontal com mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    // Previne scroll vertical da página
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault()
      container.scrollLeft += e.deltaY
    }
  }

  // Clique e arrasta
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    setIsDragging(true)
    setStartX(e.pageX - container.offsetLeft)
    setScrollLeft(container.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const container = scrollContainerRef.current
    if (!container) return
    
    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 1.5 // Velocidade do arraste
    container.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsHovering(false)
  }

  // Navegação por setas (200px por clique)
  const scrollByAmount = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const amount = direction === 'left' ? -200 : 200
    container.scrollBy({ left: amount, behavior: 'smooth' })
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-[140px] bg-background-primary rounded-[20px] border border-border-light">
        <p className="text-text-secondary text-[14px]">Nenhuma despesa no período</p>
      </div>
    )
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradiente de máscara à esquerda */}
      <div 
        className={`
          absolute left-0 top-0 bottom-0 w-[40px] z-10
          bg-gradient-to-r from-background-secondary to-transparent
          pointer-events-none
          transition-opacity duration-200
          ${showLeftArrow ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Gradiente de máscara à direita */}
      <div 
        className={`
          absolute right-0 top-0 bottom-0 w-[40px] z-10
          bg-gradient-to-l from-background-secondary to-transparent
          pointer-events-none
          transition-opacity duration-200
          ${showRightArrow ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Seta esquerda (desktop only) */}
      <button
        onClick={() => scrollByAmount('left')}
        className={`
          absolute left-[8px] top-1/2 -translate-y-1/2 z-20
          w-[36px] h-[36px]
          bg-white rounded-full shadow-lg
          flex items-center justify-center
          text-text-primary
          hover:bg-gray-50
          transition-all duration-200
          hidden lg:flex
          ${isHovering && showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        aria-label="Scroll para esquerda"
      >
        <ChevronLeftIcon />
      </button>

      {/* Seta direita (desktop only) */}
      <button
        onClick={() => scrollByAmount('right')}
        className={`
          absolute right-[8px] top-1/2 -translate-y-1/2 z-20
          w-[36px] h-[36px]
          bg-white rounded-full shadow-lg
          flex items-center justify-center
          text-text-primary
          hover:bg-gray-50
          transition-all duration-200
          hidden lg:flex
          ${isHovering && showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        aria-label="Scroll para direita"
      >
        <ChevronRightIcon />
      </button>

      {/* Container do carrossel */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`
          flex gap-[16px] overflow-x-auto
          scrollbar-hide
          px-[4px] py-[4px]
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {categories.map((category, index) => (
          <ExpenseCard
            key={category.category}
            percentage={Math.round(category.percentage)}
            title={category.category}
            value={formatCurrency(category.total)}
            colorIndex={index}
            isCarouselItem={true}
          />
        ))}
      </div>
    </div>
  )
}
