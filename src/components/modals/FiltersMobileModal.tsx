/**
 * Componente: FiltersMobileModal
 * Modal fullscreen para filtros no mobile
 * 
 * Conforme PROMPT 16:
 * - Animação slide-up de baixo para cima
 * - Header fixo com título e botão X
 * - Filtros: tipo de transação, membro, período (calendário)
 * - Footer fixo com botão "Aplicar Filtros"
 * - Estado temporário até aplicar
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CloseIcon } from './Modal'

// ============================================================================
// ÍCONES
// ============================================================================

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
)

// ============================================================================
// TIPOS
// ============================================================================

interface FiltersMobileModalProps {
  isOpen: boolean
  onClose: () => void
}

type TransactionFilterType = 'all' | 'income' | 'expense'

// ============================================================================
// CONSTANTES
// ============================================================================

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
]

// ============================================================================
// HELPERS
// ============================================================================

function getMonthDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days: (number | null)[] = []
  
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  
  return days
}

function isSameDay(date1: Date, date2: Date | null): boolean {
  if (!date2) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  const d = date.getTime()
  return d >= start.getTime() && d <= end.getTime()
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function FiltersMobileModal({ isOpen, onClose }: FiltersMobileModalProps) {
  const {
    familyMembers,
    filters,
    setTransactionType,
    setSelectedMember,
    setDateRange,
  } = useFinance()

  // Estado temporário dos filtros
  const [tempType, setTempType] = useState<TransactionFilterType>(filters.transactionType)
  const [tempMember, setTempMember] = useState<string | null>(filters.selectedMember)
  const [tempStartDate, setTempStartDate] = useState<Date | null>(filters.dateRange.startDate)
  const [tempEndDate, setTempEndDate] = useState<Date | null>(filters.dateRange.endDate)
  const [selectingStart, setSelectingStart] = useState(true)

  // Estado do calendário
  const [viewDate, setViewDate] = useState(new Date())

  // Sincroniza estado temporário quando modal abre
  useEffect(() => {
    if (isOpen) {
      setTempType(filters.transactionType)
      setTempMember(filters.selectedMember)
      setTempStartDate(filters.dateRange.startDate)
      setTempEndDate(filters.dateRange.endDate)
      setViewDate(filters.dateRange.startDate)
      setSelectingStart(true)
    }
  }, [isOpen, filters])

  // Bloqueia scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  // Dias do mês atual
  const monthDays = useMemo(() => 
    getMonthDays(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  )

  // Handler de clique no dia
  const handleDayClick = useCallback((day: number) => {
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    
    if (selectingStart) {
      setTempStartDate(clickedDate)
      setTempEndDate(null)
      setSelectingStart(false)
    } else {
      if (tempStartDate && clickedDate < tempStartDate) {
        setTempStartDate(clickedDate)
        setTempEndDate(tempStartDate)
      } else {
        setTempEndDate(clickedDate)
      }
      setSelectingStart(true)
    }
  }, [viewDate, selectingStart, tempStartDate])

  // Navegação do calendário
  const navigateMonth = useCallback((direction: number) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
  }, [])

  // Aplicar filtros
  const handleApply = useCallback(() => {
    setTransactionType(tempType)
    setSelectedMember(tempMember)
    if (tempStartDate && tempEndDate) {
      setDateRange({ startDate: tempStartDate, endDate: tempEndDate })
    }
    onClose()
  }, [tempType, tempMember, tempStartDate, tempEndDate, setTransactionType, setSelectedMember, setDateRange, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex flex-col bg-white animate-slide-up">
        {/* Header fixo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h2 className="text-[20px] font-bold text-[#080B12]">Filtros</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Tipo de Transação */}
          <div className="mb-8">
            <h3 className="text-[14px] font-bold text-[#080B12] mb-4">
              Tipo de Transação
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'all' as const, label: 'Todos' },
                { value: 'income' as const, label: 'Receitas' },
                { value: 'expense' as const, label: 'Despesas' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTempType(option.value)}
                  className={`
                    h-12 rounded-full
                    text-[14px] font-medium
                    transition-all
                    ${tempType === option.value
                      ? 'bg-[#080B12] text-white'
                      : 'bg-white border border-gray-300 text-gray-600'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Membro da Família */}
          <div className="mb-8">
            <h3 className="text-[14px] font-bold text-[#080B12] mb-4">
              Membro da Família
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* Botão "Todos" */}
              <button
                onClick={() => setTempMember(null)}
                className={`
                  h-12 px-6 rounded-full
                  text-[14px] font-medium
                  transition-all
                  ${tempMember === null
                    ? 'bg-[#080B12] text-white'
                    : 'bg-white border border-gray-300 text-gray-600'
                  }
                `}
              >
                Todos
              </button>
              
              {/* Botões de membros */}
              {familyMembers.map((member, index) => {
                const isSelected = tempMember === member.id
                const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length]
                const initial = member.name.charAt(0).toUpperCase()
                
                return (
                  <button
                    key={member.id}
                    onClick={() => setTempMember(member.id)}
                    className={`
                      h-12 pl-2 pr-5 rounded-full
                      flex items-center gap-2
                      text-[14px] font-medium
                      transition-all
                      ${isSelected
                        ? 'bg-[#080B12] text-white'
                        : 'bg-white border border-gray-300 text-gray-600'
                      }
                    `}
                  >
                    <div
                      className={`
                        w-8 h-8 rounded-full
                        flex items-center justify-center
                        text-white text-[12px] font-semibold
                        ${colorClass}
                        ${isSelected ? 'border-2 border-white' : ''}
                      `}
                    >
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        initial
                      )}
                    </div>
                    {member.name.split(' ')[0]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Período (Calendário) */}
          <div>
            <h3 className="text-[14px] font-bold text-[#080B12] mb-4">
              Período
            </h3>
            
            {/* Navegação do mês */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeftIcon />
              </button>
              <span className="text-[16px] font-semibold text-[#080B12]">
                {MONTHS_PT[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                onClick={() => navigateMonth(1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronRightIcon />
              </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS_PT.map((day) => (
                <div
                  key={day}
                  className="h-10 flex items-center justify-center text-[12px] font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-10" />
                }

                const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
                const isStart = isSameDay(currentDate, tempStartDate)
                const isEnd = isSameDay(currentDate, tempEndDate)
                const isInRangeDay = isInRange(currentDate, tempStartDate, tempEndDate)
                const isToday = isSameDay(currentDate, new Date())

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`
                      h-10 rounded-lg
                      text-[14px] font-medium
                      transition-all
                      ${isStart || isEnd
                        ? 'bg-[#080B12] text-white'
                        : isInRangeDay
                          ? 'bg-gray-200 text-[#080B12]'
                          : isToday
                            ? 'border border-[#080B12] text-[#080B12]'
                            : 'text-[#080B12] hover:bg-gray-100'
                      }
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            {/* Período selecionado */}
            {tempStartDate && tempEndDate && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
                <span className="text-[14px] text-gray-600">
                  {tempStartDate.toLocaleDateString('pt-BR')} - {tempEndDate.toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer fixo */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleApply}
            className="
              w-full h-14
              bg-[#080B12] text-white
              rounded-full
              text-[16px] font-semibold
              transition-opacity hover:opacity-90
            "
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  )
}
