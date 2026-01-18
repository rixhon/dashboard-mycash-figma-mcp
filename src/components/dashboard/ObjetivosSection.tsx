/**
 * Componente: ObjetivosSection
 * Seção de objetivos financeiros no dashboard
 * 
 * Funcionalidades:
 * - Header com ícone de alvo, título "Objetivos" e botão "Ver mais"
 * - Grid responsivo: 1 coluna (mobile), 2 colunas (tablet), 4 colunas (desktop)
 * - Exibe apenas os 4 primeiros objetivos
 * - Card de objetivo com:
 *   - Imagem com zoom no hover (scale 1.05, 700ms)
 *   - Badge de categoria (glassmorphism)
 *   - Nome, valor atual/meta
 *   - Barra de progresso animada (1000ms)
 *   - Percentual e valor faltante
 * - Hover no card: borda muda para cinza média, sombra aumenta
 */

import { useCallback, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { Goal } from '@/types'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'

// ============================================================================
// ÍCONES
// ============================================================================

// Ícone de alvo (target) para o header
const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

// Ícone de seta para direita
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
)

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Formata valor monetário brasileiro
 */
function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Calcula percentual de progresso
 */
function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0
  return Math.min((current / target) * 100, 100)
}

/**
 * Imagens placeholder por categoria
 * Em produção, viriam do objetivo.imageUrl
 */
const CATEGORY_IMAGES: Record<string, string> = {
  'Segurança': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
  'Lazer': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
  'Tecnologia': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
  'Educação': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
  'Transporte': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
  'Saúde': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  'default': 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop',
}

function getCategoryImage(category: string): string {
  return CATEGORY_IMAGES[category] || CATEGORY_IMAGES['default']
}

// ============================================================================
// COMPONENTE: GoalCard
// ============================================================================

interface GoalCardProps {
  goal: Goal
  onClick: () => void
}

function GoalCard({ goal, onClick }: GoalCardProps) {
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount)
  const remaining = goal.targetAmount - goal.currentAmount
  const imageUrl = getCategoryImage(goal.category)

  return (
    <div
      onClick={onClick}
      className="
        bg-white
        border border-gray-200
        rounded-[32px]
        overflow-hidden
        cursor-pointer
        transition-all duration-300 ease-out
        hover:border-gray-400
        hover:shadow-lg
        group
      "
    >
      {/* Área de Imagem */}
      <div className="relative h-[192px] overflow-hidden">
        <img
          src={imageUrl}
          alt={goal.title}
          className="
            w-full h-full object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-105
          "
        />
        
        {/* Badge de categoria (glassmorphism) */}
        <div
          className="
            absolute top-3 right-3
            px-3 py-1
            bg-black/50
            backdrop-blur-sm
            rounded-full
          "
        >
          <span className="text-[10px] font-medium text-white uppercase tracking-wider">
            {goal.category}
          </span>
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="p-6">
        {/* Subárea de Informações */}
        <div className="mb-4">
          <h4 className="text-[18px] font-bold text-gray-900 mb-2">
            {goal.title}
          </h4>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-bold text-gray-900">
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="text-[12px] text-gray-400">de</span>
            <span className="text-[12px] text-gray-400">
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>
        </div>

        {/* Subárea de Progresso */}
        <div>
          {/* Barra de progresso */}
          <div className="h-[10px] bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[#C4E703] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentual e valor faltante */}
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-bold text-gray-900">
              {progress.toFixed(0)}%
            </span>
            <span className="text-[12px] font-bold text-gray-400">
              Faltam {formatCurrency(remaining > 0 ? remaining : 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ObjetivosSection() {
  const { goals } = useFinance()
  const navigate = useNavigate()

  // Pega apenas os 4 primeiros objetivos não completados
  const displayGoals = useMemo(() => {
    return goals
      .filter(g => !g.isCompleted)
      .slice(0, 4)
  }, [goals])

  // Handler de ver mais
  const handleViewMore = useCallback(() => {
    navigate(ROUTES.GOALS)
  }, [navigate])

  // Handler de clique no card
  const handleGoalClick = useCallback((goal: Goal) => {
    // TODO: Abrir modal de detalhes do objetivo
    console.log('Goal clicked:', goal)
  }, [])

  // Se não há objetivos, não renderiza a seção
  if (displayGoals.length === 0) {
    return null
  }

  return (
    <section className="w-full">
      {/* Header da Seção */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3 items-center">
          {/* Ícone em círculo preto */}
          <div className="w-10 h-10 bg-[#080B12] rounded-full flex items-center justify-center">
            <TargetIcon />
          </div>
          <h2 className="text-[24px] font-bold text-gray-900">
            Objetivos
          </h2>
        </div>

        {/* Botão Ver mais */}
        <button
          onClick={handleViewMore}
          className="
            flex items-center gap-1
            text-[14px] font-medium text-gray-500
            hover:text-gray-900
            transition-colors
          "
        >
          Ver mais
          <ArrowRightIcon />
        </button>
      </div>

      {/* Grid de Objetivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onClick={() => handleGoalClick(goal)}
          />
        ))}
      </div>
    </section>
  )
}
