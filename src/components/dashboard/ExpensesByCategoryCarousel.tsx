/**
 * Componente: ExpensesByCategoryCarousel
 * Carrossel horizontal de gastos por categoria com gráficos donut
 * 
 * Funcionalidades:
 * - Busca dados de calculateExpensesByCategory do contexto global
 * - Calcula percentual usando calculateCategoryPercentage (relativo à receita)
 * - Trata divisão por zero retornando 0%
 * - Cards com largura fixa de 160px, espaçamento de 16px
 * - Scroll via: mouse wheel, clique e arrasta, setas de navegação
 * - Setas aparecem no hover (desktop), não aparecem no mobile
 * - Bordas com gradiente de máscara (fade out)
 * - Cards com hover: borda verde-limão
 * - Percentual formatado com uma casa decimal
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/utils/formatters'

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * Array de cores para categorias (rotação)
 * 1º: verde-limão (#C4E703)
 * 2º: preto (#080B12)
 * 3º: cinza médio (#6B7280)
 * 4º: cinza claro (#D1D5DB)
 */
const CATEGORY_COLORS = [
  '#C4E703', // verde-limão
  '#080B12', // preto
  '#6B7280', // cinza médio
  '#D1D5DB', // cinza claro
]

// ============================================================================
// ÍCONES
// ============================================================================

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

// ============================================================================
// COMPONENTE: CategoryDonutCard
// ============================================================================

interface CategoryDonutCardProps {
  category: string
  total: number
  percentage: number
  colorIndex: number
}

/**
 * Card individual de categoria com gráfico donut
 * 
 * - Fundo branco, borda cinza clara
 * - Largura fixa de 160px
 * - Gráfico donut de 64px no topo
 * - Nome truncado com reticências se muito longo
 * - Valor formatado como moeda brasileira
 * - Hover: borda verde-limão
 */
function CategoryDonutCard({ category, total, percentage, colorIndex }: CategoryDonutCardProps) {
  const color = CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length]
  
  // Configurações do donut
  const size = 64
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const center = size / 2

  return (
    <div
      className="
        w-[160px] flex-shrink-0
        bg-white
        rounded-[20px]
        border border-gray-200
        transition-colors duration-200
        hover:border-[#C4E703]
        cursor-pointer
      "
    >
      <div className="flex flex-col gap-[12px] items-center p-[24px]">
        {/* Gráfico Donut */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
          >
            {/* Anel interno vazio (branco/cinza claro) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#E7E8EA"
              strokeWidth={strokeWidth}
            />
            {/* Anel externo colorido (percentual) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {/* Percentual no centro - uma casa decimal */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[12px] font-medium leading-[16px] text-gray-900">
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* Informações */}
        <div className="flex flex-col gap-[4px] items-center text-center w-full">
          {/* Nome da categoria - truncado se muito longo */}
          <p 
            className="text-[12px] font-normal leading-[16px] text-gray-500 truncate max-w-full"
            title={category}
          >
            {category}
          </p>
          {/* Valor total formatado */}
          <p className="text-[14px] font-bold leading-[20px] text-gray-900">
            {formatCurrency(total)}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL: ExpensesByCategoryCarousel
// ============================================================================

export default function ExpensesByCategoryCarousel() {
  const { calculateExpensesByCategory, calculateCategoryPercentage } = useFinance()
  
  // Busca dados do contexto
  const categories = calculateExpensesByCategory()
  
  // Refs e estados para controle do carrossel
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // ===== CONTROLE DE VISIBILIDADE DAS SETAS =====
  
  const updateArrowVisibility = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  // Atualiza visibilidade das setas quando o container ou categorias mudam
  useEffect(() => {
    updateArrowVisibility()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateArrowVisibility)
      window.addEventListener('resize', updateArrowVisibility)
      return () => {
        container.removeEventListener('scroll', updateArrowVisibility)
        window.removeEventListener('resize', updateArrowVisibility)
      }
    }
  }, [categories, updateArrowVisibility])

  // ===== SCROLL COM MOUSE WHEEL =====
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    // Converte scroll vertical em horizontal
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault()
      container.scrollLeft += e.deltaY
    }
  }, [])

  // ===== CLIQUE E ARRASTA =====
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    setIsDragging(true)
    setStartX(e.pageX - container.offsetLeft)
    setScrollLeft(container.scrollLeft)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    const container = scrollContainerRef.current
    if (!container) return
    
    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 1.5 // Velocidade do arraste
    container.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    setIsHovering(false)
  }, [])

  // ===== NAVEGAÇÃO POR SETAS (200px por clique) =====
  
  const scrollByAmount = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const amount = direction === 'left' ? -200 : 200
    container.scrollBy({ left: amount, behavior: 'smooth' })
  }, [])

  // ===== RENDERIZAÇÃO =====
  
  // Estado vazio
  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-[160px] bg-white rounded-[20px] border border-gray-200">
        <p className="text-gray-500 text-[14px]">Nenhuma despesa no período</p>
      </div>
    )
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradiente de máscara à esquerda (fade out) */}
      <div 
        className={`
          absolute left-0 top-0 bottom-0 w-[40px] z-10
          bg-gradient-to-r from-[#F3F4F6] to-transparent
          pointer-events-none
          transition-opacity duration-200
          ${showLeftArrow ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Gradiente de máscara à direita (fade out) */}
      <div 
        className={`
          absolute right-0 top-0 bottom-0 w-[40px] z-10
          bg-gradient-to-l from-[#F3F4F6] to-transparent
          pointer-events-none
          transition-opacity duration-200
          ${showRightArrow ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Seta esquerda (desktop only - hidden lg:flex) */}
      <button
        onClick={() => scrollByAmount('left')}
        className={`
          absolute left-[8px] top-1/2 -translate-y-1/2 z-20
          w-[36px] h-[36px]
          bg-white rounded-full shadow-lg
          flex items-center justify-center
          text-gray-700
          hover:bg-gray-50
          transition-all duration-200
          hidden lg:flex
          ${isHovering && showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        aria-label="Scroll para esquerda"
      >
        <ChevronLeftIcon />
      </button>

      {/* Seta direita (desktop only - hidden lg:flex) */}
      <button
        onClick={() => scrollByAmount('right')}
        className={`
          absolute right-[8px] top-1/2 -translate-y-1/2 z-20
          w-[36px] h-[36px]
          bg-white rounded-full shadow-lg
          flex items-center justify-center
          text-gray-700
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
          ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {categories.map((category, index) => {
          // Usa calculateCategoryPercentage para obter o percentual relativo à receita
          // Se a receita for zero, retorna 0% (tratamento de divisão por zero)
          const percentage = calculateCategoryPercentage(category.total)
          
          return (
            <CategoryDonutCard
              key={category.categoryId || category.category}
              category={category.categoryName || category.category || ''}
              total={category.total}
              percentage={percentage}
              colorIndex={index}
            />
          )
        })}
      </div>
    </div>
  )
}
