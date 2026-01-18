/**
 * Componente: Navbar do Dashboard
 * Barra superior com busca, filtros, membros e botão de nova transação
 * Conforme design Figma node 42-3099
 * 
 * Funcionalidades:
 * - Busca em tempo real (atualiza filtro searchText no contexto)
 * - Filtro de tipo de transação (popover com glassmorphism)
 * - Seletor de período com calendário interativo
 * - Seleção de membros da família com feedback visual
 * - Botão de nova transação
 */

import { useState, useRef, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { NewTransactionModal, AddMemberModal, FiltersMobileModal } from '@/components/modals'

// ============================================================================
// ÍCONES
// ============================================================================

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
  </svg>
)

const SettingsSlidersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

// ============================================================================
// HELPERS
// ============================================================================

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const MONTHS_SHORT_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

/**
 * Formata período para exibição no botão
 */
function formatDateRange(startDate: Date, endDate: Date): string {
  const startDay = startDate.getDate().toString().padStart(2, '0')
  const startMonth = MONTHS_SHORT_PT[startDate.getMonth()]
  const endDay = endDate.getDate().toString().padStart(2, '0')
  const endMonth = MONTHS_SHORT_PT[endDate.getMonth()]
  const year = endDate.getFullYear()
  
  return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`
}

/**
 * Retorna os dias do mês para o calendário
 */
function getMonthDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days: (number | null)[] = []
  
  // Dias vazios antes do primeiro dia
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  
  // Dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  
  return days
}

/**
 * Verifica se uma data está dentro do intervalo
 */
function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  const d = date.getTime()
  return d >= start.getTime() && d <= end.getTime()
}

/**
 * Verifica se duas datas são o mesmo dia
 */
function isSameDay(date1: Date, date2: Date | null): boolean {
  if (!date2) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Cores de avatar baseadas no índice
 */
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
]

// ============================================================================
// COMPONENTES INTERNOS
// ============================================================================

interface FilterPopoverProps {
  isOpen: boolean
  onClose: () => void
  transactionType: 'all' | 'income' | 'expense'
  onTypeChange: (type: 'all' | 'income' | 'expense') => void
  isMobile?: boolean
}

/**
 * Popover de filtros com glassmorphism (desktop) ou modal fullscreen (mobile)
 */
function FilterPopover({ isOpen, onClose, transactionType, onTypeChange, isMobile }: FilterPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora (desktop)
  useEffect(() => {
    if (!isOpen || isMobile) return

    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose, isMobile])

  // Bloqueia scroll do body quando modal mobile está aberto
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isMobile, isOpen])

  if (!isOpen) return null

  const options = [
    { value: 'all' as const, label: 'Todos' },
    { value: 'income' as const, label: 'Receitas' },
    { value: 'expense' as const, label: 'Despesas' },
  ]

  // Mobile: Modal fullscreen que desliza de baixo
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div 
          className="relative w-full bg-white rounded-t-[24px] p-[24px] animate-slide-up"
          ref={popoverRef}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-[24px]">
            <h3 className="text-[18px] font-semibold text-text-primary">Filtros</h3>
            <button 
              onClick={onClose}
              className="p-[8px] hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Tipo de Transação */}
          <div>
            <p className="text-[14px] font-medium text-text-secondary mb-[12px]">
              Tipo de Transação
            </p>
            <div className="flex flex-col gap-[8px]">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onTypeChange(option.value)
                    onClose()
                  }}
                  className={`
                    w-full px-[16px] py-[12px] rounded-[12px]
                    text-[14px] font-medium text-left
                    transition-colors
                    ${transactionType === option.value
                      ? 'bg-[#080B12] text-white'
                      : 'bg-gray-100 text-text-primary hover:bg-gray-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Desktop: Popover flutuante com glassmorphism
  return (
    <div 
      ref={popoverRef}
      className="
        absolute top-full left-0 mt-[8px] z-50
        min-w-[200px] p-[16px]
        bg-white/90 backdrop-blur-md
        rounded-[16px] shadow-lg
        border border-white/20
      "
    >
      <p className="text-[12px] font-medium text-text-secondary mb-[12px] uppercase tracking-wider">
        Tipo de Transação
      </p>
      <div className="flex flex-col gap-[6px]">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onTypeChange(option.value)}
            className={`
              px-[12px] py-[8px] rounded-[8px]
              text-[14px] font-medium text-left
              transition-colors
              ${transactionType === option.value
                ? 'bg-[#080B12] text-white'
                : 'hover:bg-gray-100 text-text-primary'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface DatePickerProps {
  isOpen: boolean
  onClose: () => void
  startDate: Date
  endDate: Date
  onDateChange: (start: Date, end: Date) => void
  isMobile?: boolean
}

/**
 * Calendário interativo para seleção de período
 */
function DatePicker({ isOpen, onClose, startDate, endDate, onDateChange, isMobile }: DatePickerProps) {
  const [viewDate, setViewDate] = useState(new Date())
  const [selectingStart, setSelectingStart] = useState(true)
  const [tempStart, setTempStart] = useState<Date | null>(startDate)
  const [tempEnd, setTempEnd] = useState<Date | null>(endDate)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Reset ao abrir
  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate)
      setTempEnd(endDate)
      setSelectingStart(true)
      setViewDate(startDate)
    }
  }, [isOpen, startDate, endDate])

  // Fecha ao clicar fora (desktop)
  useEffect(() => {
    if (!isOpen || isMobile) return

    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        if (tempStart && tempEnd) {
          onDateChange(tempStart, tempEnd)
        }
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose, isMobile, tempStart, tempEnd, onDateChange])

  // Bloqueia scroll do body quando modal mobile está aberto
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isMobile, isOpen])

  if (!isOpen) return null

  const handleDayClick = (day: number, monthOffset: number = 0) => {
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + monthOffset, day)
    
    if (selectingStart) {
      setTempStart(clickedDate)
      setTempEnd(null)
      setSelectingStart(false)
    } else {
      if (tempStart && clickedDate < tempStart) {
        setTempStart(clickedDate)
        setTempEnd(tempStart)
      } else {
        setTempEnd(clickedDate)
      }
      setSelectingStart(true)
    }
  }

  const handleConfirm = () => {
    if (tempStart && tempEnd) {
      onDateChange(tempStart, tempEnd)
    }
    onClose()
  }

  const handleQuickSelect = (type: string) => {
    const now = new Date()
    let start: Date
    let end: Date

    switch (type) {
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        end = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case 'last3Months':
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'thisYear':
        start = new Date(now.getFullYear(), 0, 1)
        end = new Date(now.getFullYear(), 11, 31)
        break
      default:
        return
    }

    setTempStart(start)
    setTempEnd(end)
    setViewDate(start)
  }

  const navigateMonth = (direction: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1))
  }

  const renderMonth = (monthOffset: number = 0) => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth() + monthOffset
    const adjustedDate = new Date(year, month, 1)
    const days = getMonthDays(adjustedDate.getFullYear(), adjustedDate.getMonth())

    return (
      <div className="flex-1">
        <div className="text-center mb-[12px]">
          <span className="text-[14px] font-semibold text-text-primary">
            {MONTHS_PT[adjustedDate.getMonth()]} {adjustedDate.getFullYear()}
          </span>
        </div>
        
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-[2px] mb-[4px]">
          {WEEKDAYS_PT.map((day) => (
            <div key={day} className="text-center text-[11px] text-text-secondary font-medium py-[4px]">
              {day}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-[2px]">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-[32px]" />
            }

            const currentDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), day)
            const isStart = isSameDay(currentDate, tempStart)
            const isEnd = isSameDay(currentDate, tempEnd)
            const isInRangeDay = isInRange(currentDate, tempStart, tempEnd)
            const isToday = isSameDay(currentDate, new Date())

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day, monthOffset)}
                className={`
                  h-[32px] text-[13px] rounded-[6px]
                  transition-colors
                  ${isStart || isEnd
                    ? 'bg-[#080B12] text-white font-semibold'
                    : isInRangeDay
                      ? 'bg-gray-200 text-text-primary'
                      : isToday
                        ? 'border border-[#080B12] text-text-primary'
                        : 'hover:bg-gray-100 text-text-primary'
                  }
                `}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const quickButtons = [
    { label: 'Este mês', value: 'thisMonth' },
    { label: 'Mês passado', value: 'lastMonth' },
    { label: 'Últimos 3 meses', value: 'last3Months' },
    { label: 'Este ano', value: 'thisYear' },
  ]

  // Mobile: Modal fullscreen
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        
        <div 
          ref={pickerRef}
          className="relative w-full bg-white rounded-t-[24px] p-[24px] animate-slide-up max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-[20px]">
            <h3 className="text-[18px] font-semibold text-text-primary">Selecionar Período</h3>
            <button onClick={onClose} className="p-[8px] hover:bg-gray-100 rounded-full">
              <CloseIcon />
            </button>
          </div>

          {/* Atalhos rápidos */}
          <div className="flex flex-wrap gap-[8px] mb-[20px]">
            {quickButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => handleQuickSelect(btn.value)}
                className="px-[12px] py-[6px] text-[12px] font-medium rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Navegação */}
          <div className="flex items-center justify-between mb-[16px]">
            <button onClick={() => navigateMonth(-1)} className="p-[8px] hover:bg-gray-100 rounded-full">
              <ChevronLeftIcon />
            </button>
            <span className="text-[14px] font-semibold">
              {MONTHS_PT[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button onClick={() => navigateMonth(1)} className="p-[8px] hover:bg-gray-100 rounded-full">
              <ChevronRightIcon />
            </button>
          </div>

          {/* Calendário (1 mês no mobile) */}
          {renderMonth(0)}

          {/* Período selecionado */}
          {tempStart && tempEnd && (
            <div className="mt-[16px] p-[12px] bg-gray-50 rounded-[12px] text-center">
              <span className="text-[14px] text-text-secondary">
                {formatDateRange(tempStart, tempEnd)}
              </span>
            </div>
          )}

          {/* Botão confirmar */}
          <button
            onClick={handleConfirm}
            disabled={!tempStart || !tempEnd}
            className="
              w-full mt-[20px] py-[14px]
              bg-[#080B12] text-white
              rounded-[100px] font-semibold
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-opacity
            "
          >
            Confirmar
          </button>
        </div>
      </div>
    )
  }

  // Desktop: Popover com 2 meses lado a lado
  return (
    <div 
      ref={pickerRef}
      className="
        absolute top-full left-0 mt-[8px] z-50
        p-[20px] bg-white rounded-[16px] shadow-xl
        border border-gray-100
      "
    >
      {/* Atalhos rápidos */}
      <div className="flex gap-[8px] mb-[16px] pb-[16px] border-b border-gray-100">
        {quickButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleQuickSelect(btn.value)}
            className="px-[10px] py-[5px] text-[11px] font-medium rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Navegação */}
      <div className="flex items-center justify-between mb-[12px]">
        <button onClick={() => navigateMonth(-1)} className="p-[6px] hover:bg-gray-100 rounded-full">
          <ChevronLeftIcon />
        </button>
        <button onClick={() => navigateMonth(1)} className="p-[6px] hover:bg-gray-100 rounded-full">
          <ChevronRightIcon />
        </button>
      </div>

      {/* Calendários (2 meses lado a lado) */}
      <div className="flex gap-[24px]">
        {renderMonth(0)}
        {renderMonth(1)}
      </div>

      {/* Período selecionado e botão OK */}
      <div className="flex items-center justify-between mt-[16px] pt-[16px] border-t border-gray-100">
        <span className="text-[13px] text-text-secondary">
          {tempStart && tempEnd ? formatDateRange(tempStart, tempEnd) : 'Selecione o período'}
        </span>
        <button
          onClick={handleConfirm}
          disabled={!tempStart || !tempEnd}
          className="
            px-[16px] py-[8px]
            bg-[#080B12] text-white text-[13px] font-semibold
            rounded-[100px]
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:opacity-90 transition-opacity
          "
        >
          OK
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function Navbar() {
  const {
    familyMembers,
    filters,
    setSearchText,
    setTransactionType,
    setSelectedMember,
    setDateRange,
  } = useFinance()

  // Estados locais para UI
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Estados dos modais
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [showFiltersMobileModal, setShowFiltersMobileModal] = useState(false)

  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const dateButtonRef = useRef<HTMLButtonElement>(null)

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handler de busca em tempo real
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  // Handler de seleção de membro
  const handleMemberClick = (memberId: string) => {
    if (filters.selectedMember === memberId) {
      setSelectedMember(null) // Remove filtro se clicar no mesmo
    } else {
      setSelectedMember(memberId)
    }
  }

  // Handler de mudança de período
  const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ startDate: start, endDate: end })
  }

  return (
    <nav className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between w-full">
      {/* Lado esquerdo - Busca, filtros e membros */}
      <div className="flex flex-wrap gap-[8px] items-center">
        {/* Grupo de busca e filtros */}
        <div className="flex gap-[8px] items-center relative">
          {/* Campo de busca - Input real com busca em tempo real */}
          <div
            className={`
              flex gap-[8px] items-center
              w-full lg:w-[175px]
              px-[24px] py-[12px]
              rounded-[100px]
              border bg-background-primary
              transition-colors
              ${isSearchFocused ? 'border-[#080B12]' : 'border-[#9CA3AF]'}
            `}
          >
            <SearchIcon />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={filters.searchText}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="
                flex-1 bg-transparent outline-none
                text-[14px] font-normal leading-[20px] tracking-[0.3px]
                text-text-primary placeholder:text-text-secondary
              "
            />
          </div>

          {/* Botão de filtros */}
          <div className="relative">
            <button
              ref={filterButtonRef}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`
                flex items-center justify-center
                p-[12px]
                text-text-primary
                hover:opacity-80
                transition-opacity
                ${isFilterOpen ? 'opacity-60' : ''}
                ${filters.transactionType !== 'all' ? 'text-[#080B12]' : ''}
              `}
              aria-label="Filtros"
            >
              <SettingsSlidersIcon />
              {/* Indicador de filtro ativo */}
              {filters.transactionType !== 'all' && (
                <span className="absolute top-[8px] right-[8px] w-[6px] h-[6px] bg-[#080B12] rounded-full" />
              )}
            </button>

            <FilterPopover
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              transactionType={filters.transactionType}
              onTypeChange={setTransactionType}
              isMobile={isMobile}
            />
          </div>

          {/* Seletor de período */}
          <div className="relative">
            <button
              ref={dateButtonRef}
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className={`
                flex gap-[8px] items-center
                px-[24px] py-[12px]
                rounded-[100px]
                border bg-background-primary
                text-text-primary
                hover:border-gray-500
                transition-colors
                ${isDatePickerOpen ? 'border-[#080B12]' : 'border-[#9CA3AF]'}
              `}
            >
              <CalendarIcon />
              <span className="text-[14px] font-normal leading-[20px] tracking-[0.3px]">
                {formatDateRange(filters.dateRange.start || filters.dateRange.startDate!, filters.dateRange.end || filters.dateRange.endDate!)}
              </span>
            </button>

            <DatePicker
              isOpen={isDatePickerOpen}
              onClose={() => setIsDatePickerOpen(false)}
              startDate={filters.dateRange.start || filters.dateRange.startDate!}
              endDate={filters.dateRange.end || filters.dateRange.endDate!}
              onDateChange={handleDateRangeChange}
              isMobile={isMobile}
            />
          </div>
        </div>

        {/* Avatares dos membros */}
        <div className="flex items-center">
          {/* Membros da família com efeito de pilha */}
          <div className="flex items-center -space-x-[8px]">
            {familyMembers.map((member, index) => {
              const isSelected = filters.selectedMember === member.id
              const initial = member.name.charAt(0).toUpperCase()
              const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length]

              return (
                <button
                  key={member.id}
                  onClick={() => handleMemberClick(member.id)}
                  className={`
                    relative
                    w-[44px] h-[44px]
                    rounded-full
                    overflow-visible
                    transition-all duration-200
                    hover:scale-110 hover:z-10
                    group
                    ${isSelected ? 'z-20 scale-110' : ''}
                  `}
                  style={{ zIndex: isSelected ? 20 : familyMembers.length - index }}
                  aria-label={`Filtrar por ${member.name}`}
                >
                  {/* Avatar */}
                  <div
                    className={`
                      w-full h-full rounded-full
                      flex items-center justify-center
                      text-white text-[14px] font-semibold
                      ${colorClass}
                      border-2 transition-all
                      ${isSelected ? 'border-[#080B12] border-[3px]' : 'border-white'}
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

                  {/* Tooltip com nome e função - aparece no hover (abaixo do avatar) */}
                  <div className="
                    absolute top-full left-1/2 -translate-x-1/2 mt-[8px]
                    px-[12px] py-[6px]
                    bg-[#080B12] text-white
                    text-[12px] font-medium
                    rounded-[8px]
                    whitespace-nowrap
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200
                    z-50 shadow-lg
                    pointer-events-none
                  ">
                    <span className="font-semibold">{member.name}</span>
                    <span className="text-gray-400"> - {member.role}</span>
                    {/* Seta do tooltip apontando para cima */}
                    <div className="
                      absolute bottom-full left-1/2 -translate-x-1/2
                      border-[6px] border-transparent border-b-[#080B12]
                    " />
                  </div>

                  {/* Check verde quando selecionado */}
                  {isSelected && (
                    <div className="absolute -bottom-[2px] -right-[2px] w-[18px] h-[18px] bg-[#15BE78] rounded-full flex items-center justify-center border-2 border-white">
                      <CheckIcon />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Botão adicionar membro */}
          <button
            onClick={() => setShowMemberModal(true)}
            className="
              w-[44px] h-[44px]
              rounded-full
              border-2 border-white
              bg-[#D1D5DB]
              flex items-center justify-center
              text-[#080B12]
              hover:bg-gray-400
              transition-colors
              ml-[8px]
            "
            aria-label="Adicionar membro"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lado direito - Botão nova transação */}
      <button
        onClick={() => setShowTransactionModal(true)}
        className="
          flex gap-[8px] items-center justify-center
          px-[16px] py-[12px]
          rounded-[100px]
          bg-[#080B12]
          text-white
          hover:opacity-90
          transition-opacity
          mt-[16px] lg:mt-0
          w-full lg:w-auto
          lg:py-[12px]
        "
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        <span className="text-[18px] font-semibold leading-[24px] tracking-[0.3px]">Nova transação</span>
      </button>

      {/* Modais */}
      <NewTransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />
      
      <AddMemberModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
      />
      
      <FiltersMobileModal
        isOpen={showFiltersMobileModal}
        onClose={() => setShowFiltersMobileModal(false)}
      />
    </nav>
  )
}
